import { ADDRESS_PREFIXES } from '../constants.js';
import bs58check from 'bs58check';

/**
 * A wrapper around addresses. Internally addresses are stored and sent as raw bytes,
 * but client-side they are displayed as base58-check encoded strings.
 * The encoding requires some computation, so you should only convert address objects to strings when needed.
 */
export default class Address {
    constructor(address) {
        if (address instanceof Address) {
            // Copy buffer
            this.value = Buffer.from(address.value);
        } else if (typeof address === 'string') {
            // Decode string
            this.value = Address.decode(address);
            this.encoded = address;
        } else if (address.length >= 0) {
            // Treat array-like as buffer
            this.value = address;
        } else {
            throw new Error('Instantiate Address with raw bytes or string in base58-check encoding, not');
        }
    }
    asBytes() {
        return this.value;
    }
    toJSON() {
        return this.toString();
    }
    toString() {
        if (!this.encoded) {
            this.encoded = Address.encode(this.value);
        }
        return this.encoded;
    }
    static decode(bs58string) {
        return bs58check.decode(bs58string).slice(1);
    }
    static encode(byteArray) {
        if (!byteArray || byteArray.length === 0) return ''; // return empty string for null address
        const buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT, ...byteArray]);
        return bs58check.encode(buf);
    }
}