import chai from 'chai';
const assert = chai.assert;

import Amount from '../src/amount';

describe('Amount', () => {
    it('should move decimal point', () => {
        assert.equal(Amount.moveDecimalPoint('1', 4), '10000');
        assert.equal(Amount.moveDecimalPoint('1', -4), '0.0001');
        assert.equal(Amount.moveDecimalPoint('0.0001', 4), '1');
        assert.equal(Amount.moveDecimalPoint('0.0001', -4), '0.00000001');
        assert.equal(Amount.moveDecimalPoint('10000', -4), '1');
        assert.equal(Amount.moveDecimalPoint('10000.1', 4), '100001000');
    });
    it('should parse amounts from number with default unit', () => {
        const a = new Amount(100);
        assert.equal(a.toString(), '100 aergo');
        assert.equal(a.value.toString(), '100000000000000000000');
    });
    it('should be idempotent', () => {
        const a = new Amount(100);
        assert.equal(new Amount(a), a);
    });
    it('should throw with invalid argument', () => {
        class Invalid {
            toString(): string {
                return 'Foo';
            }
        }
        const invalidInput = new Invalid();
        assert.throws(() => {
            new Amount(invalidInput as any);
        }, 'Instantiate Amount with JSBI|number|string|Buffer|Uint8Array, not Foo (object)');
    });
    it('should parse amounts from string with unit', () => {
        const a = new Amount('100 aer');
        assert.equal(a.toString(), '100 aer');
        assert.equal(a.value.toString(), '100');

        const b = new Amount('100 aergo');
        assert.equal(b.toString(), '100 aergo');
        assert.equal(b.value.toString(), '100000000000000000000');
        assert.deepEqual(Array.from(b.asBytes()), [ 5, 107, 199, 94, 45, 99, 16, 0, 0 ]);

        const c = new Amount('10000 gaer');
        assert.equal(c.toString(), '10000 gaer');
        assert.equal(c.value.toString(), '10000000000000');
        assert.equal(c.toUnit('aergo').toString(), '0.00001 aergo');
    });
    it('should convert between units', () => {
        const a = new Amount('10000 gaer');
        assert.equal(a.toString(), '10000 gaer');
        assert.equal(a.toUnit('aergo').toString(), '0.00001 aergo');
        assert.equal(a.toUnit('gaer').toString(), '10000 gaer');
        assert.equal(a.toUnit('aer').toString(), '10000000000000 aer');
        assert.equal(a.formatNumber('gaer'), '10000');
    });
    it('should handle floating point numbers', () => {
        const a = new Amount('0.1 aergo');
        assert.equal(a.toUnit('aer').toString(), '100000000000000000 aer');

        const b = new Amount(0.1);
        assert.equal(b.toUnit('aer').toString(), '100000000000000000 aer');

        assert.throws(() => new Amount(0.1, 'aer'), SyntaxError, 'Cannot convert 0.1 to a BigInt');
    });
    it('should parse amounts from buffers', () => {
        const a = new Amount(Buffer.from([ 5, 107, 199, 94, 45, 99, 16, 0, 0 ]));
        assert.equal(a.value.toString(), '100000000000000000000');
        assert.equal(a.toString(), '100000000000000000000 aer');
        assert.equal(a.toUnit('aergo').toString(), '100 aergo');
        const b = new Amount(Buffer.from([ 5, 107, 199, 94, 45, 99, 16, 0, 0 ]), 'aergo');
        assert.equal(b.toString(), '100 aergo');
    });
    it('should throw error for unrecognized unit', () => {
        assert.throws(() => new Amount('100 foo'), TypeError, 'unrecognized unit: foo');
    });
    it('should format 0 nicely', () => {
        const a = new Amount('0 aer');
        assert.equal(a.toString(), '0 aer');
        assert.equal(a.toUnit('aergo').toString(), '0 aergo');
        assert.equal(a.toUnit('gaer').toString(), '0 gaer');
        assert.equal(a.toUnit('aer').toString(), '0 aer');
    });
    it('toJSBI', () => {
        // Use default unit
        assert.equal(Amount.toJSBI(new Amount('10 aer')).toString(), '10');
        // Set explicit unit
        assert.equal(Amount.toJSBI('10 aergo').toString(), '10000000000000000000');
        assert.equal(Amount.toJSBI('10', 'aergo').toString(), '10000000000000000000');
    });
    it('compares amounts', () => {
        const a = new Amount('10 aer');
        // 10 aer == 10
        assert.equal(a.compare(10), 0);
        // 10 aer == 10 aer
        assert.equal(a.compare('10 aer'), 0);
        // 10 aer < 10 aergo
        assert.equal(a.compare('10 aergo'), -1);
        // 10 aer > 1
        assert.equal(a.compare(1), 1);
        // 10 aer < 1 aergo (since b is unit-less, the other value will be parsed in the default unit)
        const b = new Amount('10 aer', '', '');
        assert.equal(b.compare(1), -1);
        // 10 aer > 1 aer (b is unit-less, but the other amount has an explicit unit)
        assert.equal(b.compare('1 aer'), 1);
    });
    it('adds amounts', () => {
        const a = new Amount('10 aer');
        // 10 aer + 10 = 20 aer
        assert.equal(a.add(10).toString(), '20 aer');
        // 10 aer + 10 aergo = 10000000000000000010 aer
        assert.equal(a.add('10 aergo').toString(), '10000000000000000010 aer');
        // 10 aer + 10 aergo, as aergo = 10.00000000000000001 aergo
        assert.equal(a.add('10 aergo').toUnit('aergo').toString(), '10.00000000000000001 aergo');

        const b = new Amount('10 aergo');
        // 10 aergo + 10 = 20 aergo
        assert.equal(b.add(10).toString(), '20 aergo');
        // 10 aergo + 10 aer = 10.00000000000000001 aergo
        assert.equal(b.add('10 aer').toString(), '10.00000000000000001 aergo');
        // 10 aergo + 10 aer, as aer = 10000000000000000010 aer
        assert.equal(b.add('10 aer').toUnit('aer').toString(), '10000000000000000010 aer');
    });
    it('substracts amounts', () => {
        const a = new Amount('10 aergo');
        // 10 aergo - 5 = 5 aergo
        assert.equal(a.sub(5).toString(), '5 aergo');
        // 10 aergo - 100 aer = 9.9999999999999999 aergo
        const b = a.sub('100 aer');
        assert.equal(b.toString(), '9.9999999999999999 aergo');
        // 9.9999999999999999 aergo + 100 aer = 10 aergo
        assert.equal(b.add('100 aer').toString(), '10 aergo');
        // 1 aer - 1 aergo = -999999999999999999 aer
        assert.equal(new Amount('1 aer').sub('1 aergo').toString(), '-999999999999999999 aer');
    });
    it('multiplies amounts', () => {
        const a = new Amount('10 aergo');
        // 10 aergo * 10 = 100 aergo
        assert.equal(a.mul(10).toString(), '100 aergo');
        // 10 aergo * 10000, as aer = 100000 aergo
        assert.equal(a.mul(10000).toUnit('aer').toString(), '100000000000000000000000 aer');
        // 10 aergo * 10 aergo, as aergo = 100000000000000000000 aergo
        assert.equal(a.mul('10 aergo').toString(), '100000000000000000000 aergo');
    });
    it('divides amounts', () => {
        const a = new Amount('10 aergo');
        // 10 aergo / 10 = 1 aergo
        assert.equal(a.div(10).toString(), '1 aergo');
        assert.equal(a.div(new Amount(10, 'aer', '')).toString(), '1 aergo');
        // 10 aergo / 20 = 0.5 aergo
        assert.equal(a.div(20).toString(), '0.5 aergo');
        // 10 aergo / 5 aergo = 2
        assert.equal(a.div('5 aergo').toString(), '2');
        // 1 aer / 2 aer = 0
        assert.equal(new Amount('1 aer').div('2 aer').toString(), '0');
        // 100000000000 aer / 0.00000001 aergo = 10
        assert.equal(new Amount('100000000000 aer').div('0.00000001 aergo').toString(), '10');
    });
    it('should jsonify to a string with unit aer', () => {
        const amount = new Amount('1234 aergo');
        const json = JSON.stringify({ amount });
        assert.equal(json, '{"amount":"1234000000000000000000 aer"}');
        // Parse it back to check it's the same value
        const amount2 = new Amount(JSON.parse(json).amount);
        assert.isTrue(amount.equal(amount2));
    });
});