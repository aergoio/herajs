import bs58check from 'bs58check';
import { ADDRESS_PREFIXES } from './constants';

/**
 * Convert Uint8 array to hex string
 * @param {string} hexString
 * @return {Uint8Array} 
 */
const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

/**
 * Convert Uint8 array to hex string
 * @param {Uint8Array} bytes 
 * @return {string}
 */
const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

/**
 * Convert number to Uint8 array
 * @param {number} d 
 * @param {number} bitLength default 64, can also use 32
 */
const fromNumber = (d, bitLength = 64) => {
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
 * Encodes address form byte array to string.
 * @param {number[]} byteArray 
 * @param {string} address
 */
const encodeAddress = (byteArray) => {
    const buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT, ...byteArray]);
    return bs58check.encode(buf);
};

/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded address 
 * @return {number[]} byte array
 */
const decodeAddress = (address) => {
    return bs58check.decode(address).slice(1);
};

/**
 * Encodes address form byte array to string.
 * @param {number[]} byteArray 
 * @param {string} address
 */
const encodePrivateKey = (byteArray) => {
    const buf = Buffer.from([ADDRESS_PREFIXES.PRIVATE_KEY, ...byteArray]);
    return bs58check.encode(buf);
};

/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded address 
 * @return {number[]} byte array
 */
const decodePrivateKey = (key) => {
    return bs58check.decode(key).slice(1);
};

export {
    fromHexString,
    toHexString,
    fromNumber,
    encodeAddress,
    decodeAddress,
    encodePrivateKey,
    decodePrivateKey
};