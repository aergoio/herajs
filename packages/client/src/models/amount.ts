import { UNITS } from '../constants';
import JSBI from 'jsbi';
import { fromHexString, toHexString } from '../utils';

const DEFAULT_USER_UNIT = 'aergo';
const DEFAULT_NETWORK_UNIT = 'aer';

type AmountArg = Amount | JSBI | number | string;

/**
 * A wrapper around amounts with units.
 * Over the network, amounts are sent as raw bytes.
 * In the client, they are exposed as BigInts, but also compatible with plain strings or numbers (if smaller than 2^31-1)
 * Uses 'aergo' as default unit when passing strings or numbers.
 * Uses 'aer' as default unit when passing BigInts, buffers or byte arrays.
 * Whenever you pass amounts to other functions, they will try to coerce them to BigInt using this class.
 */
export default class Amount {
    value: Readonly<JSBI>; // value in base unit
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

    constructor(value: AmountArg|Buffer|Uint8Array, unit = '', newUnit?: string) {
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

        // Freeze value. Otherwise some libraries mess this up since it is actually an Array subclass with a custom propery
        this.value = Object.freeze(this.value);
    }
    /**
     * Returns value as byte buffer
     */
    asBytes(): Buffer {
        return Buffer.from(fromHexString(this.value.toString(16)));
    }
    toJSON(): string {
        return this.value.toString();
    }
    /**
     * Returns formatted string including unit
     */
    toString(): string {
        if (this.unit) {
            return `${this.formatNumber()} ${this.unit}`;
        }
        return `${this.formatNumber()}`;
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
    formatNumber(unit: string = ''): string {
        if (unit === '') unit = this.unit;
        if (unit === '') return this.value.toString();
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
        return new Amount(this.value as JSBI, '', unit);
    }

    /**
     * Convert arg into JSBI value
     * Can optionally provide a defaultUnit that is used if arg does not contain a unit.
     */
    static toJSBI(arg: AmountArg, defaultUnit = ''): JSBI {
        if (!(arg instanceof Amount)) {
            let [amount, _unit] = `${arg}`.split(' ', 2);
            const unit = _unit || defaultUnit;
            arg = new Amount(amount, unit);
        }
        return JSBI.BigInt(arg.value);
    }

    /**
     * Compare this amount with other amount.
     * If otherAmount has no unit, assumes unit of this amount.
     * this >  other -> +1
     * this  < other -> -1
     * this == other -> 0
     * @param otherAmount 
     */
    compare(otherAmount: AmountArg): number {
        const a = this.value as JSBI;
        const b = Amount.toJSBI(otherAmount, this.unit);
        return JSBI.equal(a, b) ? 0 : JSBI.lessThan(a, b) ? -1 : 1;
    }

    /**
     * Return true if otherAmount is equal to this amount.
     * @param otherAmount 
     */
    equal(otherAmount: AmountArg): boolean {
        return this.compare(otherAmount) === 0;
    }

    /**
     * Add another amount to amount.
     * If otherAmount has no unit, assumes unit of this amount.
     * 10 aergo + 10 = 20 aergo
     * 10 aer + 10 = 20 aer
     * 10 aergo + 10 aer = 10.00000000000000001 aergo
     * @param otherAmount 
     */
    add(otherAmount: AmountArg): Amount {
        const sum = JSBI.add(this.value as JSBI, Amount.toJSBI(otherAmount, this.unit));
        return new Amount(sum, this.unit);
    }

    /**
     * Subtract another amount from amount.
     * If otherAmount has no unit, assumes unit of this amount.
     * 10 aergo - 5 = 5 aergo
     * 10 aer - 5 = 5 aer
     * 1 aer - 1 aergo = -999999999999999999 aer
     * @param otherAmount 
     */
    sub(otherAmount: AmountArg): Amount {
        const sum = JSBI.subtract(this.value as JSBI, Amount.toJSBI(otherAmount, this.unit));
        return new Amount(sum, this.unit);
    }

    /**
     * Divide amount by another amount.
     * Warning: double check your units. The division is based on the aer value, so
     * if your otherAmount has a unit, it will be converted to aer.
     * This function tries to do the right thing in regards to dividing units:
     * 10 aergo / 10 = 1 aergo  (keep unit)
     * 10 aergo / 10 aergo = 1  (unit-less)
     * 1 aer / 2 aer = 0  (truncation of sub 1 aer amount)
     * @param otherAmount 
     */
    div(otherAmount: AmountArg): Amount {
        let newUnit;
        const sum = JSBI.divide(this.value as JSBI, Amount.toJSBI(otherAmount, 'aer'));
        // if both amounts had units, the result should be unit-less
        let otherHasUnit = (otherAmount instanceof Amount) && Boolean(otherAmount.unit);
        if (!otherHasUnit && typeof otherAmount === 'string') {
            let [, _unit] = `${otherAmount}`.split(' ', 2);
            otherHasUnit = Boolean(_unit);
        }
        if (otherHasUnit) {
            newUnit = '';
        }
        return new Amount(sum, this.unit, newUnit);
    }

    /**
     * Multiply amount by another amount.
     * Warning: double check your units. The multiplication is based on the aer value, so
     * if your otherAmount has a unit, it will be converted to aer.
     * However, while the value is correct, there's no way to display unit^2.
     * 10 aergo * 10 aergo = 10 * 10^18 aer * 10 * 10^18 aer = 100 * 10^36 aer = 100 * 10^18 aergo
     * 10 aergo * 10 = 10 * 10^18 aer * 10 = 100 * 10^18 aer = 100 aergo
     * @param otherAmount 
     */
    mul(otherAmount: AmountArg): Amount {
        const sum = JSBI.multiply(this.value as JSBI, Amount.toJSBI(otherAmount, 'aer'));
        return new Amount(sum, this.unit);
    }
}