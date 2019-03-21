import { UNITS } from '../constants';
import JSBI from 'jsbi';
import { fromHexString, toHexString } from '../utils';

const DEFAULT_USER_UNIT = 'aergo';
const DEFAULT_NETWORK_UNIT = 'aer';

/**
 * A wrapper around amounts with units.
 * Over the network, amounts are sent as raw bytes.
 * In the client, they are exposed as BigInts, but also compatible with plain strings or numbers (if smaller than 2^31-1)
 * Uses 'aergo' as default unit when passing strings or numbers.
 * Uses 'aer' as default unit when passing BigInts, buffers or byte arrays.
 * Whenever you pass amounts to other functions, they will try to coerce them using this class.
 */
export default class Amount {
    value: JSBI; // value in base unit
    unit: string; // unit for displaying

    private static _valueFromString(value: string, unit: string = ''): JSBI {
        if (unit === '') {
            unit = DEFAULT_USER_UNIT;
        }
        if (!UNITS.NATIVE_TOKEN.unitSize.hasOwnProperty(unit)) {
            throw new TypeError(`unrecognized unit: ${unit}`);
        }
        const prec = UNITS.NATIVE_TOKEN.unitSize[unit];
        if (prec > 0) {
            value = Amount.moveDecimalPoint(value, prec);
        }
        return JSBI.BigInt(value);
    }

    constructor(value: Amount|JSBI|number|string|Buffer|Uint8Array, unit = '', newUnit?: string) {
        if (value instanceof Amount) {
            return value;
        }
        if (typeof value === 'string') {
            let [amount, _unit] = value.split(' ', 2);
            unit = unit || _unit;
            this.value = Amount._valueFromString(amount, unit);
        } else if (typeof value === 'number') {
            this.value = Amount._valueFromString(''+value, unit);
        } else if (value instanceof JSBI) {
            if (typeof unit === 'undefined' || unit === '') {
                unit = DEFAULT_NETWORK_UNIT;
            }
            this.value = JSBI.BigInt(value)
        } else if (value instanceof Buffer || value instanceof Uint8Array) {
            if (typeof unit === 'undefined' || unit === '') {
                unit = DEFAULT_NETWORK_UNIT;
            }
            this.value = JSBI.BigInt(toHexString(value, true));
        } else {
            throw new Error(`Instantiate Amount with JSBI|number|string|Buffer|Uint8Array, not ${value} (${typeof value})`);
        }
        if (typeof this.unit === 'undefined') {
            this.unit = unit;
        }
        if (typeof this.unit === 'undefined' || this.unit === '') {
            this.unit = DEFAULT_USER_UNIT;
        }

        // Set new unit for displaying
        if (typeof newUnit !== 'undefined') {
            this.unit = newUnit;
        }
    }
    /**
     * Returns value as byte buffer
     */
    asBytes(): Buffer {
        return fromHexString(this.value.toString(16));
    }
    toJSON(): string {
        return this.value.toString();
    }
    /**
     * Returns formatted string including unit
     */
    toString(): string {
        return `${this.formatNumber()} ${this.unit}`;
    }
    /**
     * Move decimal point in string by digits, positive to the right, negative to the left.
     * This extends the string if necessary.
     * Example: ("0.0001", 4 => "1"), ("0.0001", -4 => "0.00000001")
     * @param str 
     * @param digits 
     */
    static moveDecimalPoint(str: string, digits: number) {
        if (digits === 0 || str === '0') return str;
        if (str.indexOf('.') === -1) {
            str = str + '.';
        }
        let idx = str.indexOf('.');

        // Extend string to have enough space to move decimal point
        if (digits > str.length - idx) {
            str = str.padEnd(digits + idx + 1, '0');
        }
        if (digits < -idx) {
            str = str.padStart(str.length-idx-digits, '0');
        }

        // remove decimal point and reinsert at new location
        idx = str.indexOf('.');
        str = str.replace('.', '')
        str = str.substr(0, idx + digits) + '.' + str.substr(idx + digits);

        // remove trailing 0 and .
        str = str.replace(/\.?0*$/, '');
        // remove leading 0
        str = str.replace(/^0+/, '');
        // add leading 0 before .
        str = str.replace(/^\./, '0.');
        return str;
    }
    formatNumber(unit: string = '') {
        if (unit === '') unit = this.unit;
        if (!UNITS.NATIVE_TOKEN.unitSize.hasOwnProperty(unit)) {
            throw new TypeError(`unrecognized unit: ${unit}`);
        }
        const prec = UNITS.NATIVE_TOKEN.unitSize[this.unit];
        return Amount.moveDecimalPoint(this.value.toString(), -prec);
    }
    /**
     * Convert to another unit
     * @param unit string (aer, gaer, aergo)
     */
    toUnit(unit: string): Amount {
        return new Amount(this.value, '', unit);
    }

    compare(otherAmount: Amount | number | JSBI ): number {
        if (!(otherAmount instanceof Amount)) otherAmount = new Amount(otherAmount);
        const [a, b] = [this.toUnit('aer').value, otherAmount.toUnit('aer').value];
        return JSBI.lessThan(a, b) ? -1 : (JSBI.equal(a, b) ? 0 : 1);
    }

    add(otherAmount: Amount | number | JSBI): Amount {
        const otherValue = (otherAmount instanceof Amount ? JSBI.BigInt(otherAmount.value) : JSBI.BigInt(otherAmount));
        const sum = JSBI.add(this.value, otherValue);
        return new Amount(sum, this.unit);
    }

    sub(otherAmount: Amount | number | JSBI): Amount {
        const otherValue = (otherAmount instanceof Amount ? JSBI.BigInt(otherAmount.value) : JSBI.BigInt(otherAmount));
        const sum = JSBI.subtract(this.value, otherValue);
        return new Amount(sum, this.unit);
    }
}