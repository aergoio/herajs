import { Identity, identifyFromPrivateKey } from './keys';

import scrypt from '@web3-js/scrypt-shim';
import { AES_CTR } from 'asmcrypto.js';
import { hash } from './hashing';
import { rand } from 'elliptic';

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

function deriveCipherKey(kdf: KeystoreKdf, password: string): Buffer {
    if (kdf.algorithm !== 'scrypt') {
        throw new Error(`unsupported cipher key derivation scheme: ${kdf.algorithm}`);
    }
    const kdfparams = kdf.params;
    if (!kdfparams.salt) {
        throw new Error('kdf parameters are missing salt');
    }
    return scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
}

function decrypt(kdf: KeystoreKdf, cipher: KeystoreCipher, password: string): [Buffer, Buffer] {
    const decryptKey = deriveCipherKey(kdf, password);
    const nonce = Buffer.from(cipher.params.iv, 'hex');
    const ciphertext = Buffer.from(cipher.ciphertext, 'hex');
    const mac = generateMac(decryptKey, ciphertext);
    if (cipher.algorithm !== 'aes-128-ctr') {
        throw new Error(`unsupported encryption algorithm: ${cipher.algorithm}`);
    }
    const key = Buffer.from(AES_CTR.decrypt(ciphertext, decryptKey.slice(0, 16), nonce));
    return [key, mac];
}

function encrypt(kdf: KeystoreKdf, key: Buffer, nonce: Buffer, password: string): [Buffer, Buffer] {
    const decryptKey = deriveCipherKey(kdf, password);
    const ciphertext = Buffer.from(AES_CTR.encrypt(key, decryptKey.slice(0, 16), nonce));
    const mac = generateMac(decryptKey, ciphertext);
    return [ciphertext, mac];
}

export function identityFromKeystore(keystore: Keystore, password: string): Identity {
    if (keystore.ks_version !== '1') {
        throw new Error(`unsupported keystore version: ${keystore.ks_version}`);
    }
    const [privateKey, expectedMac] = decrypt(keystore.kdf, keystore.cipher, password);
    const mac = Buffer.from(keystore.kdf.mac, 'hex');
    if (!expectedMac.equals(Buffer.from(mac))) {
        throw new Error('invalid mac value');
    }
    return identifyFromPrivateKey(privateKey);
}

export function keystoreFromPrivateKey(key: Buffer, password: string, kdfParams?: Partial<ScryptParams>): Keystore {
    const identity = identifyFromPrivateKey(key);
    const nonce = rand(16);
    const kdf: KeystoreKdf = {
        algorithm: DEFAULTS.kdfAlgorithm,
        mac: '',
        params: {
            ...DEFAULTS.kdfParams,
            ...kdfParams,
            salt: kdfParams && typeof kdfParams.salt !== 'undefined' ? kdfParams.salt : rand(32).toString('hex'),
        },
    };
    const [ciphertext, mac] = encrypt(kdf, key, nonce, password);
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

