import JSBI from 'jsbi';
/**
 * Convert Uint8 array to hex string
 * @param {string} hexString
 * @return {Uint8Array}
 */
declare const fromHexString: (hexString: string) => Uint8Array;
/**
 * Convert Uint8 array to hex string
 * @param {Uint8Array} bytes
 * @return {string}
 */
declare const toHexString: (bytes: Uint8Array) => string;
/**
 * Convert number to Uint8 array
 * @param {number} d
 * @param {number} bitLength default 64, can also use 32
 */
declare const fromNumber: (d: number, bitLength?: number) => Uint8Array;
/**
 * Convert BigInt to Uint8 array
 * @param {JSBI} d
 */
declare const fromBigInt: (d: JSBI) => Uint8Array;
/**
 * Encodes address form byte array to string.
 * @param {number[]} byteArray
 * @param {string} address
 */
declare const encodeAddress: (byteArray: Uint8Array) => string;
/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded address or name
 * @return {number[]} byte array
 */
declare const decodeAddress: (address: string) => Uint8Array;
/**
 * Encodes address form byte array to string.
 * @param {number[]} byteArray
 * @param {string} address
 */
declare const encodePrivateKey: (byteArray: Uint8Array) => string;
/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded privkey
 * @return {number[]} byte array
 */
declare const decodePrivateKey: (key: string) => Uint8Array;
declare function encodeTxHash(bytes: Uint8Array | number[]): string;
declare function decodeTxHash(bs58string: string): Uint8Array;
export { fromHexString, toHexString, fromNumber, fromBigInt, encodeAddress, decodeAddress, encodePrivateKey, decodePrivateKey, encodeTxHash, decodeTxHash };
