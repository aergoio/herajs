import { ec } from 'elliptic';
import { AES_GCM } from 'asmcrypto.js';
import { encodeAddress, decodeAddress } from './encoding';

const ecdsa = new ec('secp256k1');

interface Identity {
    address: string;
    publicKey: any; //?
    privateKey: Buffer;
    keyPair: ec.KeyPair;
}

/**
 * Encode public key as address
 * @param {ECPoint} publicKey
 * @return {string} base58check encoded address
 */
export function addressFromPublicKey(publicKey: any): string {
    const len = publicKey.curve.p.byteLength();
    const x = publicKey.getX().toArray('be', len);
    const address = Uint8Array.from([ publicKey.getY().isEven() ? 0x02 : 0x03 ].concat(x));
    return encodeAddress(address);
}

/**
 * Encodes a key pair into an identity object
 * @param {KeyPair} keyPair 
 * @return {object}
 */
export function encodeIdentity(keyPair: ec.KeyPair): Identity {
    //@ts-ignore
    const privateKey = Buffer.from(keyPair.getPrivate().toArray()) as Buffer;
    const publicKey = keyPair.getPublic();
    const address = addressFromPublicKey(publicKey);
    return {
        address,
        publicKey,
        privateKey,
        keyPair
    };
}

/**
 * Shortcut function to create a new random private key and
 * return keys and address as encoded strings.
 */
export function createIdentity(): Identity {
    const keyPair = ecdsa.genKeyPair();
    return encodeIdentity(keyPair);
}

/**
 * Returns identity associated with private key
 * @param {Buffer} privKeyBytes 
 */
export function identifyFromPrivateKey(privKeyBytes: Uint8Array): Identity {
    const keyPair = ecdsa.keyFromPrivate(Buffer.from(privKeyBytes));
    return encodeIdentity(keyPair);
}

/**
 * Retrieve public key from address
 * @param {ECPoint} publicKey
 * @return {string} base58check encoded address
 */
export function publicKeyFromAddress(address: string): ec.KeyPair {
    const pubkey = decodeAddress(address) as Buffer;
    return ecdsa.keyFromPublic(pubkey);
}

const _keyAndNonceFromPassword = (password: string): [Buffer, Buffer] => {
    // Make a key from double hashing the password
    const hash = ecdsa.hash();
    hash.update(password);
    const addr = hash.digest();
    const rehash = ecdsa.hash();
    rehash.update(password);
    rehash.update(addr);
    const key = Buffer.from(rehash.digest());
    const nonce = Buffer.from(addr.slice(4, 16));
    return [key, nonce];
};

export function decryptPrivateKey(encryptedBytes: Uint8Array, password: string): Uint8Array {
    const [key, nonce] = _keyAndNonceFromPassword(password);
    return AES_GCM.decrypt(Uint8Array.from(encryptedBytes), key, nonce);
}

export function encryptPrivateKey(clearBytes: Uint8Array, password: string): Uint8Array {
    const [key, nonce] = _keyAndNonceFromPassword(password);
    return AES_GCM.encrypt(Uint8Array.from(clearBytes), key, nonce);
}

