import { ADDRESS_PREFIXES, ACCOUNT_NAME_LENGTH } from '../constants.js';
import bs58check from 'bs58check';

/**
 * A wrapper around addresses. Internally addresses are stored and sent as raw bytes,
 * but client-side they are displayed as base58-check encoded strings.
 * The encoding requires some computation, so you should only convert address objects to strings when needed.
 */
export default class Address {
    value: Buffer;
    encoded: string;
    isName: boolean;

    constructor(address: Address|string|Buffer|Uint8Array) {
        if (address instanceof Address) {
            // Copy buffer
            this.value = Buffer.from(address.value);
        } else if (typeof address === 'string') {
            if (address.length <= ACCOUNT_NAME_LENGTH) {
                this.value = Buffer.from(address); // .padEnd(ACCOUNT_NAME_LENGTH, "\0")
            } else {
                this.value = Address.decode(address);
            }
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

        // Test if this is a name
        this.isName = false;
        let arrValue = Array.from(this.value);
        while(arrValue[arrValue.length-1] === 0) {
            arrValue.pop(); // remove trailing 0
        }
        if (arrValue.length <= ACCOUNT_NAME_LENGTH) {
            this.isName = true;
            this.value = Buffer.from(arrValue);
        }
    }
    asBytes(): Buffer {
        return this.value;
    }
    toJSON(): string {
        return this.toString();
    }
    toString(): string {
        if (typeof this.encoded !== 'undefined' && this.encoded !== null) {
            return this.encoded;
        }
    
        // Account name
        if (this.isName) {
            this.encoded = Buffer.from(this.value).toString()
            return this.encoded;
        }

        // Account address
        this.encoded = Address.encode(this.value);
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