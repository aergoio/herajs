import rpcTypes from './client/types.js';
import JSBI from 'jsbi';
const CommitStatus = rpcTypes.CommitStatus;

const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const fromNumber = (d, length = 8) => {
    if (d >= Math.pow(2, length*8)) {
        throw new Error('Number exeeds range');
    }
    const arr = new Uint8Array(length);
    for (let i=0, j=1; i<8; i++, j *= 0x100) {
        arr[i] = (d / j) & 0xff;
    }
    return arr;
};

const toBytesUint32 = (num) => {
    const arr = new ArrayBuffer(8);
    const view = new DataView(arr);
    view.setUint32(0, num, true);
    return arr;
};

const bigIntToUint8Array = (value) => {
    const bigint = JSBI.BigInt(value);
    return fromHexString(bigint.toString(16));
};

const errorMessageForCode = (code) => {
    let errorMessage = 'UNDEFINED_ERROR';
    if (code && code < Object.values(CommitStatus).length) {
        errorMessage = Object.keys(CommitStatus)[Object.values(CommitStatus).indexOf(code)];
    }
    return errorMessage;
};

const waitFor = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};
const basicCheck = (result) => result instanceof Error === false;
const longPolling = async (func, check = basicCheck, timeout = 10000, wait = 250) => {
    // keep calling func until it does not throw and also satifies check(result) or until timeout is reached
    const started = + new Date();
    let lastError = '';
    try {
        const result = await func();
        if (!check(result)) throw new Error('Condition not satisfied');
        return result;
    } catch(e) {
        lastError = e;
    }
    const timePassed = new Date() - started;
    timeout -= timePassed;
    if (timeout < 0) {
        throw new Error('Long polling timed out. ' + lastError);
    }
    await waitFor(wait); // give some breathing time
    return await longPolling(func, check, timeout - wait, wait); 
};

export {
    fromHexString,
    toHexString,
    fromNumber,
    toBytesUint32,
    bigIntToUint8Array,
    errorMessageForCode,
    longPolling,
};