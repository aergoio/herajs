import { ADDRESS_PREFIXES } from '../constants.js';
import bs58check from 'bs58check';

/**
 * A wrapper around addresses. Internally addresses are stored and sent as raw bytes,
 * but client-side they are displayed as base58-check encoded strings.
 * The encoding requires some computation, so you should only convert address objects to strings when needed.
 */
export default class Address {
    value: Buffer;
    encoded: string;

    constructor(address: Address|string|Buffer|Uint8Array) {
        if (address instanceof Address) {
            // Copy buffer
            this.value = Buffer.from(address.value);
        } else if (typeof address === 'string') {
            // Decode string
            this.value = Address.decode(address);
            this.encoded = address;
        } else if (address instanceof Buffer) {
            // Treat array-like as buffer
            this.value = address;
        } else if (address instanceof Uint8Array) {
            // Treat array-like as buffer
            this.value = Buffer.from(address);
        }  else {
            throw new Error('Instantiate Address with raw bytes or string in base58-check encoding, not ' + address);
        }
    }
    asBytes(): Buffer {
        return this.value;
    }
    toJSON(): string {
        return this.toString();
    }
    toString(): string {
        if (!this.encoded) {
            this.encoded = Address.encode(this.value);
        }
        return this.encoded;
    }
    static decode(bs58string): Buffer {
        return bs58check.decode(bs58string).slice(1);
    }
    static encode(byteArray): string {
        if (!byteArray || byteArray.length === 0) return ''; // return empty string for null address
        const buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT, ...byteArray]);
        return bs58check.encode(buf);
    }
}