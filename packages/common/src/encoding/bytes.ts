import bs58 from './base58';
import { Buffer } from 'buffer';

export type StringOrBuffer = string | Buffer | Uint8Array;
export type ByteEncoding = 'base58' | BufferEncoding;

export function encodeBuffer(val: Buffer | Uint8Array, enc: ByteEncoding = 'base58'): string  {
    if (enc === 'base58') {
        return bs58.encode(Buffer.from(val));
    }
    return Buffer.from(val).toString(enc);
}

/**
 * If input is a string, use `enc` to decode string (default: base58).
 * Otherwise, just return Buffer.
 */
export function decodeToBytes(val: StringOrBuffer, enc: ByteEncoding = 'base58'): Buffer {
    if (typeof val === 'string') {
        if (enc === 'base58') {
            return bs58.decode(val);
        }
        return Buffer.from(val, enc);
    }
    return Buffer.from(val);
}

interface NumberIterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
interface HexConvertible {
    reduce: <U, T = this>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: NumberIterable<T>) => U, initialValue: U) => U;
}
/**
 * @param bytes anything to a hex string that has an iterable that returns numbers and a reduce method, e.g. number[], Uint8Array, Buffer
 * @param format add the string '0x' in front of the output
 */
export const toHexString = function(bytes: HexConvertible, format=false): string {
    const result = bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    if (!format) return result;
    if (result === '00' || result === '') return '0x0';
    return '0x' + result;
};

export const fromHexString = function(hexString: string): Uint8Array {
    if (hexString.length === 0) return Uint8Array.from([]);
    if (hexString.length % 2 === 1) hexString = '0' + hexString;
    const match = hexString.match(/.{1,2}/g);
    if (!match) throw new Error('cannot parse string as hex');
    return new Uint8Array(match.map(byte => parseInt(byte, 16)));
};

/**
 * Convert number to Uint8Array
 * @param d 
 * @param length 
 */
export const fromNumber = (d: number, length = 8): Uint8Array => {
    if (d >= Math.pow(2, length*8)) {
        throw new Error('Number exeeds range');
    }
    const arr = new Uint8Array(length);
    for (let i=0, j=1; i<8; i++, j *= 0x100) {
        arr[i] = (d / j) & 0xff;
    }
    return arr;
};

/**
 * TODO: what's this? Is this useful?
 */
export const toBytesUint32 = (num: number): ArrayBuffer => {
    const arr = new ArrayBuffer(8);
    const view = new DataView(arr);
    view.setUint32(0, num, true);
    return arr;
};
