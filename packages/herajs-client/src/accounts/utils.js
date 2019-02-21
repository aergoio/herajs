import { ADDRESS_PREFIXES } from '../constants';
import bs58check from 'bs58check';

const encodeAddress = (byteArray) => {
    if (!byteArray || byteArray.length === 0) return ''; // return empty string for null address
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