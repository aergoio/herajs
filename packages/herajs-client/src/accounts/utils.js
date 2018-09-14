import { ADDRESS_PREFIXES } from '../constants.js';
import base58check from 'base58check';

const encodeAddress = (byteArray) => {
    return base58check.encode(Buffer.from(byteArray), ADDRESS_PREFIXES.ACCOUNT);
};

const decodeAddress = (address) => {
    return base58check.decode(address).data;
};

export {
    encodeAddress,
    decodeAddress
};