/// <reference types="node" />
import { ec } from 'elliptic';
interface Identity {
    address: string;
    publicKey: any;
    privateKey: Buffer;
    keyPair: ec.KeyPair;
}
/**
 * Encode public key as address
 * @param {ECPoint} publicKey
 * @return {string} base58check encoded address
 */
export declare function addressFromPublicKey(publicKey: any): string;
/**
 * Encodes a key pair into an identity object
 * @param {KeyPair} keyPair
 * @return {object}
 */
export declare function encodeIdentity(keyPair: ec.KeyPair): Identity;
/**
 * Shortcut function to create a new random private key and
 * return keys and address as encoded strings.
 */
export declare function createIdentity(): Identity;
/**
 * Returns identity associated with private key
 * @param {Buffer} privKeyBytes
 */
export declare function identifyFromPrivateKey(privKeyBytes: Uint8Array): Identity;
/**
 * Retrieve public key from address
 * @param {ECPoint} publicKey
 * @return {string} base58check encoded address
 */
export declare function publicKeyFromAddress(address: string): ec.KeyPair;
export declare function decryptPrivateKey(encryptedBytes: Uint8Array, password: string): Promise<Uint8Array>;
export declare function encryptPrivateKey(clearBytes: Uint8Array, password: string): Promise<Uint8Array>;
export {};
