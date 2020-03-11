import { AES_GCM } from 'asmcrypto.js';
import { encodeAddress, decodeAddress } from './encoding';
import { Buffer } from 'buffer';
import { ec } from 'elliptic';
import { ecdsa } from './ecdsa';

export interface Identity {
    address: string;
    publicKey: any; //?
    privateKey: Buffer;
    keyPair: ec.KeyPair;
}

interface StringCovertible {
    toString(): string;
}

/**
 * An object that's convertible to bytes, e.g. client.Address.
 * Used in this indirect way so we don't have to import @herajs/client here.
 */
interface BytesConvertible {
    bytes: Uint8Array;
}
function isBytesConvertible(obj: any): obj is BytesConvertible {
    return Object.prototype.hasOwnProperty.call(obj, 'bytes');
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
 * Retrieve public key from address
 * @param {string} base58check encoded address or Address object
 * @return {KeyPair} key pair (with missing private key)
 */
export function publicKeyFromAddress(address: string | BytesConvertible | StringCovertible): ec.KeyPair {
    if (isBytesConvertible(address)) {
        return ecdsa.keyFromPublic(address.bytes);
    }
    const pubkey = decodeAddress(`${address}`) as Buffer;
    return ecdsa.keyFromPublic(pubkey);
}

/**
 * Encodes a key pair into an identity object
 * @param {KeyPair} keyPair 
 * @return {Identity} identity including address and keys
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
 * @return {Identity} identity including address and keys
 */
export function createIdentity(): Identity {
    const keyPair = ecdsa.genKeyPair();
    return encodeIdentity(keyPair);
}

/**
 * Returns identity associated with private key
 * @param {Uint8Array} privKeyBytes 
 * @returns {Identity} identity including address and keys 
 */
export function identityFromPrivateKey(privKeyBytes: Uint8Array): Identity {
    const keyPair = ecdsa.keyFromPrivate(Buffer.from(privKeyBytes));
    return encodeIdentity(keyPair);
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

/**
 * Decrypt an AES_GCM encrypted private key
 * @returns {Uint8Array} decrypted private key bytes
 */
export function decryptPrivateKey(encryptedBytes: Uint8Array, password: string): Uint8Array {
    const [key, nonce] = _keyAndNonceFromPassword(password);
    return AES_GCM.decrypt(Uint8Array.from(encryptedBytes), key, nonce);
}

/**
 * Encrypt a private key using AES_GCM
 * @returns {Uint8Array} encrypted private key bytes
 */
export function encryptPrivateKey(clearBytes: Uint8Array, password: string): Uint8Array {
    const [key, nonce] = _keyAndNonceFromPassword(password);
    return AES_GCM.encrypt(Uint8Array.from(clearBytes), key, nonce);
}

