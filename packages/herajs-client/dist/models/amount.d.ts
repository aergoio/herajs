/// <reference types="node" />
import JSBI from 'jsbi';
/**
 * A wrapper around amounts with units.
 * Over the network, amounts are sent as raw bytes.
 * In the client, they are exposed as BigInts, but also compatible with plain strings or numbers (if smaller than 2^31-1)
 * Uses 'aergo' as default unit when passing strings, or numbers.
 * Uses 'aer' as default unit when passing BigInts, buffers or byte arrays.
 * For developers, whenever you pass amounts to other functions, they will try to coerce them using this class.
 */
export default class Amount {
    value: JSBI;
    unit: string;
    static _valueFromString(value: string, unit?: string): JSBI;
    constructor(value: Amount | JSBI | number | string | Buffer | Uint8Array, unit?: string, newUnit?: string);
    asBytes(): Buffer;
    toJSON(): string;
    toString(): string;
    /**
     * Move decimal point in string by digits, positive to the right, negative to the left.
     * This extends the string if necessary.
     * Example: ("0.0001", 4 => "1"), ("0.0001", -4 => "0.00000001")
     * @param str
     * @param digits
     */
    static moveDecimalPoint(str: string, digits: number): string;
    formatNumber(unit?: string): string;
    /**
     * Convert to another unit
     * @param unit string (aer, gaer, aergo)
     */
    toUnit(unit: string): Amount;
    compare(otherAmount: any): 0 | 1 | -1;
}
