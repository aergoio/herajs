import { constants, Address, fromHexString, fromNumber, base58, base58check } from '@herajs/common';
import JSBI from 'jsbi';
import { Buffer } from 'buffer';

export { fromHexString };
export { fromNumber };

/**
 * Converts BigInt to Uint8 array.
 * @param {JSBI} d
 */
export function fromBigInt(d: JSBI | string | number): Uint8Array {
    return fromHexString(JSBI.BigInt(d).toString(16));
}

/**
 * Encodes address or name from byte array to string.
 * @param {number[]} byteArray
 * @returns {string} base58check encoded address or name
 */
export function encodeAddress(byteArray: Uint8Array): string {
    return `${new Address(Buffer.from(byteArray))}`;
}

/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded address or name
 * @return {number[]} byte array
 */
export function decodeAddress(address: string): Uint8Array {
    return Uint8Array.from(new Address(address).asBytes());
}

/**
 * Encodes address form byte array to string.
 * @param {number[]} byteArray 
 * @param {string} address
 */
export function encodePrivateKey(byteArray: Uint8Array): string {
    const buf = Buffer.from([constants.ADDRESS_PREFIXES.PRIVATE_KEY, ...byteArray]);
    return base58check.encode(buf);
}

/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded privkey 
 * @return {number[]} byte array
 */
export function decodePrivateKey(key: string): Uint8Array {
    return base58check.decode(key).slice(1);
}

/**
 * Encodes data as base58 encoded string.
 * @param {Uint8Array} bytes data
 * @return {string} base58 encoded string
 */
export function encodeTxHash(bytes: Uint8Array | number[]): string {
    return base58.encode(Buffer.from(Uint8Array.from(bytes)));
}

/**
 * Decodes base58 encoded data.
 * @param {string} bs58string base58 encoded string
 * @return {Uint8Array} decoded data
 */
export function decodeTxHash(bs58string: string): Uint8Array {
    return base58.decode(bs58string);
}
