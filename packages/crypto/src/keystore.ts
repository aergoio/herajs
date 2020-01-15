import { Buffer } from 'buffer';

import scrypt from 'scrypt-async-modern';
import { AES_CTR } from 'asmcrypto.js';
import { rand } from 'elliptic';

import { Identity, identityFromPrivateKey } from './keys';
import { hash } from './hashing';

type HexString = string;

type CipherAlgorithm = 'aes-128-ctr';
type KdfAlgorithm = 'scrypt';
type Version = '1';

interface CipherParams {
    iv: HexString;
}
interface KeystoreCipher {
    algorithm: CipherAlgorithm;
    params: CipherParams;
    ciphertext: HexString;
}

interface ScryptParams {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt?: HexString;
}

interface KeystoreKdf {
    algorithm: 'scrypt';
    params: ScryptParams;
    mac: HexString;
}

interface Keystore {
    aergo_address: string;
    ks_version: Version;
    cipher: KeystoreCipher;
    kdf: KeystoreKdf;
}

const DEFAULTS = {
    version: '1' as Version,
    kdfAlgorithm: 'scrypt' as KdfAlgorithm,
    cipherAlgorithm: 'aes-128-ctr' as CipherAlgorithm,
    kdfParams: {
        dklen: 32,
        n: 1 << 18,
        p: 1,
        r: 8,
    },
};

function generateMac(derivedKey: Buffer, cipherText: Buffer): Buffer {
    const rawMac: Buffer = Buffer.concat([derivedKey.slice(16, 32), cipherText]);
    return hash(rawMac);
}

async function deriveCipherKey(kdf: KeystoreKdf, password: string): Promise<Buffer> {
    if (kdf.algorithm !== 'scrypt') {
        throw new Error(`unsupported kdf algorithm: ${kdf.algorithm}`);
    }
    if (!kdf.params.salt) {
        throw new Error('missing required kdf parameter: salt');
    }
    if (!password) {
        throw new Error('missing required parameter: password');
    }
    return Buffer.from(await scrypt(Buffer.from(password), Buffer.from(kdf.params.salt, 'hex'), {
        N: kdf.params.n,
        r: kdf.params.r,
        p: kdf.params.p,
        dkLen: kdf.params.dklen,
        encoding: 'binary',
    }));
}

async function decrypt(kdf: KeystoreKdf, cipher: KeystoreCipher, password: string): Promise<[Buffer, Buffer]> {
    const decryptKey = await deriveCipherKey(kdf, password);
    const nonce = Buffer.from(cipher.params.iv, 'hex');
    const ciphertext = Buffer.from(cipher.ciphertext, 'hex');
    const mac = generateMac(decryptKey, ciphertext);
    if (cipher.algorithm !== 'aes-128-ctr') {
        throw new Error(`unsupported encryption algorithm: ${cipher.algorithm}`);
    }
    const key = Buffer.from(AES_CTR.decrypt(ciphertext, decryptKey.slice(0, 16), nonce));
    return [key, mac];
}

async function encrypt(kdf: KeystoreKdf, key: Buffer, nonce: Buffer, password: string): Promise<[Buffer, Buffer]> {
    const decryptKey = await deriveCipherKey(kdf, password);
    const ciphertext = Buffer.from(AES_CTR.encrypt(key, decryptKey.slice(0, 16), nonce));
    const mac = generateMac(decryptKey, ciphertext);
    return [ciphertext, mac];
}

/**
 * Decrypt keystore and return identity information.
 * 
 * .. code-block:: javascript
 * 
 *     import { identityFromKeystore } from '@herajs/crypto';
 *     const keystore = JSON.parse('keystore file contents');
 *     const identity = await identityFromKeystore(keystore, 'password');
 *     console.log(identity);
 */
export async function identityFromKeystore(keystore: Keystore, password: string): Promise<Identity> {
    if (keystore.ks_version !== '1') {
        throw new Error(`unsupported keystore version: ${keystore.ks_version}`);
    }
    const [privateKey, expectedMac] = await decrypt(keystore.kdf, keystore.cipher, password);
    const mac = Buffer.from(keystore.kdf.mac, 'hex');
    if (!expectedMac.equals(Buffer.from(mac))) {
        throw new Error('invalid mac value');
    }
    return identityFromPrivateKey(privateKey);
}

/**
 * Encrypt private key and return keystore data.
 * 
 * .. code-block:: javascript
 * 
 *     import { keystoreFromPrivateKey, createIdentity } from '@herajs/crypto';
 *     const identity = createIdentity();
 *     const keystore = await keystoreFromPrivateKey(identity.privateKey, 'password');
 *     console.log(JSON.stringify(keystore, null, 2));
 */
export async function keystoreFromPrivateKey(key: Buffer, password: string, kdfParams?: Partial<ScryptParams>): Promise<Keystore> {
    const identity = identityFromPrivateKey(key);
    const nonce = Buffer.from(rand(16));
    const kdf: KeystoreKdf = {
        algorithm: DEFAULTS.kdfAlgorithm,
        mac: '',
        params: {
            ...DEFAULTS.kdfParams,
            ...kdfParams,
            salt: kdfParams && typeof kdfParams.salt !== 'undefined' ? kdfParams.salt : Buffer.from(rand(32)).toString('hex'),
        },
    };
    const [ciphertext, mac] = await encrypt(kdf, key, nonce, password);
    const keystore: Keystore = {
        kdf: {
            ...kdf,
            mac: mac.toString('hex'),
        },
        'aergo_address': identity.address,
        'ks_version': DEFAULTS.version,
        cipher: {
            algorithm: DEFAULTS.cipherAlgorithm,
            ciphertext: ciphertext.toString('hex'),
            params: {
                iv: nonce.toString('hex'),
            }
        }
    };
    return keystore;
}

