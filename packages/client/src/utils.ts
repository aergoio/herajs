import { CommitStatus } from '../types/rpc_pb';
import JSBI from 'jsbi';
import bs58 from 'bs58';
import { Buffer } from 'buffer';

export type ByteEncoding = 'base58' | 'bytes' | BufferEncoding;
export function encodeByteArray(val: Buffer | Uint8Array, enc: ByteEncoding = 'base58'): (string | Buffer) {
    if (enc === 'bytes') {
        return Buffer.from(val);
    }
    if (enc === 'base58') {
        return bs58.encode(Buffer.from(val));
    }
    return Buffer.from(val).toString(enc);
}
export function decodeToBytes(val: string | Buffer | Uint8Array, enc: ByteEncoding = 'base58'): Buffer {
    if (typeof val === 'string') {
        if (enc === 'base58') {
            return bs58.decode(val);
        }
        if (enc === 'bytes') {
            throw new Error('cannot decode string with encoding bytes, did you mean binary or to pass a byte array?');
        }
        return Buffer.from(val, enc);
    }
    return Buffer.from(val);
}

export const fromHexString = function(hexString: string): Uint8Array {
    if (hexString.length === 0) return Uint8Array.from([]);
    if (hexString.length % 2 === 1) hexString = '0' + hexString;
    const match = hexString.match(/.{1,2}/g);
    if (!match) throw new Error('cannot parse string as hex');
    return new Uint8Array(match.map(byte => parseInt(byte, 16)));
};

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

export const toBytesUint32 = (num: number): ArrayBuffer => {
    const arr = new ArrayBuffer(8);
    const view = new DataView(arr);
    view.setUint32(0, num, true);
    return arr;
};

export const bigIntToUint8Array = (value: string|JSBI): Uint8Array => {
    const bigint = JSBI.BigInt(value);
    return fromHexString(bigint.toString(16));
};

export const errorMessageForCode = (code: number): string => {
    let errorMessage = 'UNDEFINED_ERROR';
    if (code && code < Object.values(CommitStatus).length) {
        errorMessage = Object.keys(CommitStatus)[Object.values(CommitStatus).indexOf(code)];
    }
    return errorMessage;
};

export const waitFor = (ms: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};
const basicCheck = <T>(result: T): boolean => result instanceof Error === false;
/**
 * Keep calling a function until it does not throw and also satifies check(result), or until timeout is reached
 * @param func function to be called. Can return a promise.
 * @param check function that is called on func's result
 * @param timeout duration after which polling times out
 * @param wait duration between calls
 */
export const longPolling = async <T>(func: () => Promise<T>, check = basicCheck, timeout = 10000, wait = 250): Promise<T> => {
    const started = + new Date();
    let lastError = '';
    try {
        const result = await func();
        if (!check(result)) {
            let resultStr;
            try {
                resultStr = JSON.stringify(result);
            } catch(e) {
                resultStr = '' + resultStr;
            }
            throw new Error('Condition not satisfied. Last result was ' + resultStr);
        }
        return result;
    } catch(e) {
        lastError = e;
    }
    const timePassed = + new Date() - started;
    timeout -= timePassed;
    if (timeout < 0) {
        throw new Error('long polling timed out: ' + lastError);
    }
    await waitFor(wait); // give some breathing time
    return await longPolling(func, check, timeout - wait, wait); 
};

type PromiseFunction<I = any, O = any> = (n: I) => Promise<O>;
type WaterfallFunction<FirstI, LastO> = (input: FirstI) => Promise<LastO>;
export function waterfall<I extends any, O1 extends any, O2 extends any, O3 extends any, O4 extends any, O5 extends any>(fns: [PromiseFunction<I, O1>, PromiseFunction<O1, O2>, PromiseFunction<O2, O3>, PromiseFunction<O3, O4>, PromiseFunction<O4, O5>]): WaterfallFunction<I, O5>;
export function waterfall<I extends any, O1 extends any, O2 extends any, O3 extends any, O4 extends any>(fns: [PromiseFunction<I, O1>, PromiseFunction<O1, O2>, PromiseFunction<O2, O3>, PromiseFunction<O3, O4>]): WaterfallFunction<I, O4>;
export function waterfall<I extends any, O1 extends any, O2 extends any, O3 extends any>(fns: [PromiseFunction<I, O1>, PromiseFunction<O1, O2>, PromiseFunction<O2, O3>]): WaterfallFunction<I, O3>;
export function waterfall<I extends any, O1 extends any, O2 extends any>(fns: [PromiseFunction<I, O1>, PromiseFunction<O1, O2>]): WaterfallFunction<I, O2>;
export function waterfall<I extends any, O1 extends any>(fns: [PromiseFunction<I, O1>]): WaterfallFunction<I, O1>;
export function waterfall(fns: PromiseFunction[]): WaterfallFunction<any, any> {
    return async function(input: any): Promise<any> {
        let result = input;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    };
}

/**
 * Returns the next interval to use for exponential backoff.
 * This curve yields every value 4 times before doubling in the next step.
 * The function is :code:`multiplier * 2**Math.floor(n/4)`.
 * By default (multiplier = 1s), the intervals reach ca. 1 minute (total time elapsed ca. 4 minutes) after step 24,
 * so it is advised to declare a timeout after a certain number of steps.
 * @param n step on the interval curve
 * @param multiplier multiplier, default 1000 (1s)
 */
export function backoffIntervalStep(n: number, multiplier = 1000): number {
    return multiplier * 2**Math.floor(n/4);
}
