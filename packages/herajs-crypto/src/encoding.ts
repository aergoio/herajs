import bs58check from 'bs58check';
import { ADDRESS_PREFIXES, ACCOUNT_NAME_LENGTH } from './constants';
import JSBI from 'jsbi';
import { padStart } from './utils';
import bs58 from 'bs58';

/**
 * Convert Uint8 array to hex string
 * @param {string} hexString
 * @return {Uint8Array} 
 */
const fromHexString = function(hexString: string): Uint8Array {
    if (hexString.length % 2 === 1) hexString = '0' + hexString;
    const m = hexString.match(/.{1,2}/g);
    if (!m) return new Uint8Array([]);
    return new Uint8Array(m.map(byte => parseInt(byte, 16)));
};

/**
 * Convert Uint8 array to hex string
 * @param {Uint8Array} bytes 
 * @return {string}
 */
const toHexString = function(bytes: Uint8Array): string {
    return bytes.reduce((str, byte) => str + padStart(byte.toString(16), 2, '0'), '');
};

/**
 * Convert number to Uint8 array
 * @param {number} d 
 * @param {number} bitLength default 64, can also use 32
 */
const fromNumber = (d: number, bitLength = 64): Uint8Array => {
    const bytes = bitLength / 8;
    if (d >= Math.pow(2, bitLength)) {
        throw new Error('Number exeeds uint64 range');
    }
    const arr = new Uint8Array(bytes);
    for (let i=0, j=1; i<bytes; i++, j *= 0x100) {
        arr[i] = (d / j) & 0xff;
    }
    return arr;
};

/**
 * Convert BigInt to Uint8 array
 * @param {JSBI} d 
 */
const fromBigInt = (d: JSBI): Uint8Array => fromHexString(JSBI.BigInt(d).toString(16));

/**
 * Encodes address form byte array to string.
 * @param {number[]} byteArray 
 * @param {string} address
 */
const encodeAddress = (byteArray: Uint8Array): string => {
    if (byteArray.length <= ACCOUNT_NAME_LENGTH) {
        return Buffer.from(byteArray).toString();
    }
    const buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT, ...byteArray]);
    return bs58check.encode(buf);
};

/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded address or name
 * @return {number[]} byte array
 */
const decodeAddress = (address: string): Uint8Array => {
    if (address.length <= ACCOUNT_NAME_LENGTH) {
        return Buffer.from(address);
    }
    return bs58check.decode(address).slice(1);
};

/**
 * Encodes address form byte array to string.
 * @param {number[]} byteArray 
 * @param {string} address
 */
const encodePrivateKey = (byteArray: Uint8Array): string => {
    const buf = Buffer.from([ADDRESS_PREFIXES.PRIVATE_KEY, ...byteArray]);
    return bs58check.encode(buf);
};

/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded privkey 
 * @return {number[]} byte array
 */
const decodePrivateKey = (key: string): Uint8Array => {
    return bs58check.decode(key).slice(1);
};


function encodeTxHash(bytes: Uint8Array | number[]): string {
    return bs58.encode(Buffer.from(Uint8Array.from(bytes)));
}

function decodeTxHash(bs58string: string): Uint8Array {
    return bs58.decode(bs58string);
}


export {
    fromHexString,
    toHexString,
    fromNumber,
    fromBigInt,
    encodeAddress,
    decodeAddress,
    encodePrivateKey,
    decodePrivateKey,
    encodeTxHash,
    decodeTxHash
};