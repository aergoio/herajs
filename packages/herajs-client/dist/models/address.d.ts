/// <reference types="node" />
/**
 * A wrapper around addresses. Internally addresses are stored and sent as raw bytes,
 * but client-side they are displayed as base58-check encoded strings.
 * The encoding requires some computation, so you should only convert address objects to strings when needed.
 */
export default class Address {
    value: Buffer;
    encoded: string;
    isName: boolean;
    constructor(address: Address | string | Buffer | Uint8Array);
    asBytes(): Buffer;
    toJSON(): string;
    toString(): string;
    static decode(bs58string: any): Buffer;
    static encode(byteArray: any): string;
}
