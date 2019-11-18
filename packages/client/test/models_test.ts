import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AergoClient from '../src';
import Address from '../src/models/address';
import Amount from '../src/models/amount';
//import AergoClient, { Address } from '../dist/herajs.esm';

describe('Address', () => {
    const aergo = new AergoClient();

    it('should return created base58 encoded address', async () => {
        const addr = await aergo.accounts.create('testpass');
        assert(addr instanceof Address, 'address should be instance of Address');
    });
    it('should encode raw bytes to string', () => {
        const bytes = Buffer.from([3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73]);
        const addr = new Address(bytes);
        assert.equal(addr.toString(), 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX');
        assert.equal(''+addr, 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX');
    });
    it('should decode string to raw bytes', () => {
        const encoded = 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX';
        const bytes = Buffer.from([3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73]);
        const addr = new Address(encoded);
        assert.deepEqual(addr.asBytes(), bytes);
    });
    it('should encode a null address to an empty string', () => {
        const bytes = Buffer.from([]);
        const addr = new Address(bytes);
        assert.equal(addr.toString(), '');
    });
    it('should throw with invalid address', () => {
        assert.throws(() => new Address('InvalidInvalidInvalidInvalid'), Error, 'Non-base58 character');
        assert.throws(() => new Address('abcabcabcabcabcabc'), Error, 'Invalid checksum');
        assert.throws(() => new Address('2DEMLvmHGwDgSSjYAgDS57YLM6YnrSbjswrnzXXXQD6Wa9nuUT63AcY1MV3DqyANrd2T4CEGF'), Error, 'invalid address length (48)');
    });
    it('should encode account names from bytes', () => {
        const a1 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 115, 121, 115, 116, 101, 109]));
        assert.equal(a1.toString(), 'aergo.system');
        const a2 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 115, 121, 115, 116, 101, 109, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        assert.equal(a2.toString(), 'aergo.system');
        const a3 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 110, 97, 109, 101]));
        assert.equal(a3.toString(), 'aergo.name');
        const a4 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 101, 110, 116, 101, 114, 112, 114, 105, 115, 101]));
        assert.equal(a4.toString(), 'aergo.enterprise');
    });
    it('should recognize system addresses', () => {
        const systemAddresses = ['aergo.system', 'aergo.enterprise', 'aergo.name'];
        const nonSystemAddresses = ['aergosystem', 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX'];
        const invalidAddresses = ['aergo.something', 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HXABC'];
        for (const addr of systemAddresses) {
            const obj = new Address(addr);
            assert.equal(obj.toString(), addr);
            assert.isTrue(obj.isSystemAddress(), `Expected ${addr} to be parsed as system address`);
        }
        for (const addr of nonSystemAddresses) {
            const obj = new Address(addr);
            assert.equal(obj.toString(), addr);
            assert.isFalse(obj.isSystemAddress(), `Expected ${addr} to not be parsed as system address`);
        }
        for (const addr of invalidAddresses) {
            assert.throws(() => {
                new Address(addr);
            });
        }
    });
    it('should be able to set custom system addresses', () => {
        Address.setSystemAddresses(['foo.bar']);
        assert.isTrue(new Address('foo.bar').isSystemAddress());
        assert.isFalse(new Address('aergo.system').isSystemAddress());
    });
    it('should return isEmpty', () => {
        assert.isTrue(new Address('').isEmpty());
        assert.isTrue(new Address(Buffer.from([])).isEmpty());
        assert.isFalse(new Address('foo.bar').isEmpty());
        assert.isFalse(new Address('AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX').isEmpty());
        assert.isFalse(new Address(Buffer.from([97, 101, 114, 103, 111, 46, 101, 110, 116, 101, 114, 112, 114, 105, 115, 101])).isEmpty());
    });
});

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
        // 10 aergo / 20 = 0.5 aergo
        assert.equal(a.div(20).toString(), '0.5 aergo');
        // 10 aergo / 5 aergo = 2
        assert.equal(a.div('5 aergo').toString(), '2');
        // 1 aer / 2 aer = 0
        assert.equal(new Amount('1 aer').div('2 aer').toString(), '0');
        // 100000000000 aer / 0.00000001 aergo = 10
        assert.equal(new Amount('100000000000 aer').div('0.00000001 aergo').toString(), '10');
    });
});