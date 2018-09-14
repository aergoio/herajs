import { ADDRESS_PREFIXES } from '../constants.js';
import bs58check from 'bs58check';

const encodeAddress = (byteArray) => {
    const buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT, ...byteArray]);
    return bs58check.encode(buf);
};

const decodeAddress = (address) => {
    return bs58check.decode(address).slice(1);
};

export {
    encodeAddress,
    decodeAddress
};