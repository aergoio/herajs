import { CommitStatus } from '../types/rpc_pb';
import JSBI from 'jsbi';

export const fromHexString = function(hexString) {
    if (hexString.length % 2 === 1) hexString = '0' + hexString;
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
};

export const toHexString = function(bytes, format=false) {
    const result = bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    if (!format) return result;
    if (result === '00' || result === '') return '0x0';
    return '0x' + result;
};

export const fromNumber = (d, length = 8) => {
    if (d >= Math.pow(2, length*8)) {
        throw new Error('Number exeeds range');
    }
    const arr = new Uint8Array(length);
    for (let i=0, j=1; i<8; i++, j *= 0x100) {
        arr[i] = (d / j) & 0xff;
    }
    return arr;
};

export const toBytesUint32 = (num) => {
    const arr = new ArrayBuffer(8);
    const view = new DataView(arr);
    view.setUint32(0, num, true);
    return arr;
};

export const bigIntToUint8Array = (value) => {
    const bigint = JSBI.BigInt(value);
    return fromHexString(bigint.toString(16));
};

export const errorMessageForCode = (code) => {
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
const basicCheck = (result) => result instanceof Error === false;
/**
 * Keep calling a function until it does not throw and also satifies check(result), or until timeout is reached
 * @param func function to be called. Can return a promise.
 * @param check function that is called on func's result
 * @param timeout duration after which polling times out
 * @param wait duration between calls
 */
export const longPolling = async (func, check = basicCheck, timeout = 10000, wait = 250) => {
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
        throw new Error('Long polling timed out. ' + lastError);
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
    }
}
