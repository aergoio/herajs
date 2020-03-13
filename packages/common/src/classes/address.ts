import { ADDRESS_PREFIXES, ACCOUNT_NAME_LENGTH, SYSTEM_ADDRESSES } from '../constants';
import bs58check from '../encoding/base58check';
import { Buffer } from 'buffer';

let systemAddresses = [...SYSTEM_ADDRESSES];

export type AddressInput = Address | string | Buffer | Uint8Array;

/**
 * A wrapper around addresses. Internally addresses are stored and sent as raw bytes,
 * but client-side they are displayed as base58-check encoded strings.
 * The encoding requires some computation, so you should only convert address objects to strings when needed.
 */
export default class Address {
    value: Buffer;
    encoded?: string;
    isName: boolean;

    constructor(address: AddressInput) {
        this.isName = false;

        if (address instanceof Address) {
            // Just copy buffer
            this.value = Buffer.from(address.value);
        } else if (typeof address === 'string') {
            // Parse string
            if (address.length <= ACCOUNT_NAME_LENGTH || Address.isSystemName(address)) {
                this.value = Buffer.from(address);
                this.isName = true;
            } else {
                try {
                    this.value = Address.decode(address);
                } catch(e) {
                    throw new Error(`Address "${address}" could not be parsed as a base58-check encoded string and is not a valid name. ${e}`);
                }
            }
            this.encoded = address;
        } else if (address instanceof Buffer) {
            this.value = address;
        } else if (address instanceof Uint8Array) {
            // Treat array-like as buffer
            this.value = Buffer.from(address);
        } else {
            throw new Error(`Instantiate Address with raw bytes, a string in base58-check encoding, or a valid name, not ${address}`);
        }

        // Check for name encoded as bytes
        if (!this.isName) {
            const arrValue = Array.from(this.value);
            // Remove trailing 0s
            while (arrValue[arrValue.length-1] === 0) {
                arrValue.pop();
            }
            const buf = Buffer.from(arrValue);
            if (buf.length <= ACCOUNT_NAME_LENGTH || Address.isSystemName(buf.toString())) {
                this.isName = true;
                this.value = buf;
            }
        }
    }

    asBytes(): Uint8Array {
        return new Uint8Array(this.value);
    }

    get bytes(): Uint8Array {
        return this.asBytes();
    }

    toJSON(): string {
        return this.toString();
    }

    toString(): string {
        if (typeof this.encoded !== 'undefined' && this.encoded !== null) {
            return this.encoded;
        }
    
        if (this.isName) {
            this.encoded = Buffer.from(this.value).toString();
        } else {
            this.encoded = Address.encode(this.value);
        }
        return this.encoded;
    }

    /**
     * Decode bs58check string into bytes
     */
    static decode(bs58string: string): Buffer {
        const decoded = bs58check.decode(bs58string);
        if (decoded[0] !== ADDRESS_PREFIXES.ACCOUNT) throw new Error(`invalid address prefix (${decoded[0]})`);
        if (decoded.length !== 33 + 1) throw new Error(`invalid address length (${decoded.length-1})`);
        return Buffer.from(decoded.slice(1));
    }

    /**
     * Encode bytes into bs58check string
     */
    static encode(byteArray: Buffer): string {
        if (!byteArray || byteArray.length === 0) return ''; // return empty string for null address
        const buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT, ...byteArray]);
        return bs58check.encode(buf);
    }

    equal(_otherAddress: AddressInput): boolean {
        const otherAddress = _otherAddress instanceof Address ? _otherAddress : new Address(_otherAddress);
        return Address.valueEqual(this.value, otherAddress.value);
    }

    /**
     * Returns true if the address is empty, i.e. '' or empty buffer
     */
    isEmpty(): boolean {
        return this.value.length === 0;
    }

    get length(): number {
        return this.value.length;
    }

    isSystemAddress(): boolean {
        return this.isName && Address.isSystemName(this.toString());
    }

    static isSystemName(name: string): boolean {
        return systemAddresses.indexOf(name) !== -1;
    }

    static setSystemAddresses(addresses: string[]): void {
        systemAddresses = addresses;
    }

    private static valueEqual(a: Buffer, b: Buffer): boolean {
        return a.length == b.length && a.every((aElem, i) => aElem === b[i]);
    } 
}