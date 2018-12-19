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
    });
    it('should encode account names', () => {
        const a1 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 115, 121, 115, 116, 101, 109]));
        assert.equal(a1.toString(), 'aergo.system');
        const a2 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 115, 121, 115, 116, 101, 109, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        assert.equal(a2.toString(), 'aergo.system');
        const a3 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 110, 97, 109, 101]));
        assert.equal(a3.toString(), 'aergo.name');     
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
});