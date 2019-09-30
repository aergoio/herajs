import bs58check from 'bs58check';
import { ADDRESS_PREFIXES, ACCOUNT_NAME_LENGTH } from './constants';
import JSBI from 'jsbi';
import { padStart } from './utils';
import bs58 from 'bs58';
import { Buffer } from 'buffer';

const systemAddresses = ['aergo.system', 'aergo.name', 'aergo.enterprise'];
function isSystemAddress(address: string): boolean {
    return systemAddresses.indexOf(address) !== -1;
}

/**
 * Converts hex string to Uint8Array.
 * @param {string} hexString
 * @return {Uint8Array}
 */
export function fromHexString(hexString: string): Uint8Array {
    if (hexString.length % 2 === 1) hexString = '0' + hexString;
    const m = hexString.match(/.{1,2}/g);
    if (!m) return new Uint8Array([]);
    return new Uint8Array(m.map(byte => parseInt(byte, 16)));
}

/**
 * Converts Uint8 array to hex string.
 * @param {Uint8Array} bytes
 * @return {string}
 */
export function toHexString(bytes: Uint8Array): string {
    return bytes.reduce((str, byte) => str + padStart(byte.toString(16), 2, '0'), '');
}

/**
 * Converts number to Uint8 array.
 * @param {number} d
 * @param {number} bitLength default 64, can also use 32
 */
export function fromNumber(d: number, bitLength = 64): Uint8Array {
    const bytes = bitLength / 8;
    if (d >= Math.pow(2, bitLength)) {
        throw new Error('Number exeeds uint64 range');
    }
    const arr = new Uint8Array(bytes);
    for (let i=0, j=1; i<bytes; i++, j *= 0x100) {
        arr[i] = (d / j) & 0xff;
    }
    return arr;
}

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
 * @returns {string} base58check encoded address or character bytes of name
 */
export function encodeAddress(byteArray: Uint8Array): string {
    if (byteArray.length <= ACCOUNT_NAME_LENGTH || isSystemAddress(Buffer.from(byteArray).toString())) {
        return Buffer.from(byteArray).toString();
    }
    const buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT, ...byteArray]);
    return bs58check.encode(buf);
}

/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded address or name
 * @return {number[]} byte array
 */
export function decodeAddress(address: string): Uint8Array {
    if (address.length <= ACCOUNT_NAME_LENGTH || isSystemAddress(address)) {
        return Buffer.from(address);
    }
    return bs58check.decode(address).slice(1);
}

/**
 * Encodes address form byte array to string.
 * @param {number[]} byteArray 
 * @param {string} address
 */
export function encodePrivateKey(byteArray: Uint8Array): string {
    const buf = Buffer.from([ADDRESS_PREFIXES.PRIVATE_KEY, ...byteArray]);
    return bs58check.encode(buf);
}

/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded privkey 
 * @return {number[]} byte array
 */
export function decodePrivateKey(key: string): Uint8Array {
    return bs58check.decode(key).slice(1);
}

/**
 * Encodes data as base58 encoded string.
 * @param {Uint8Array} bytes data
 * @return {string} base58 encoded string
 */
export function encodeTxHash(bytes: Uint8Array | number[]): string {
    return bs58.encode(Buffer.from(Uint8Array.from(bytes)));
}

/**
 * Decodes base58 encoded data.
 * @param {string} bs58string base58 encoded string
 * @return {Uint8Array} decoded data
 */
export function decodeTxHash(bs58string: string): Uint8Array {
    return bs58.decode(bs58string);
}
