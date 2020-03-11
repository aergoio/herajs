import chai from 'chai';
const assert = chai.assert;

import { toHexString, fromHexString, encodeByteArray, decodeToBytes } from '../src/utils';

describe('toHexString', () => {
    it('should convert byte arrays to plain hex string', () => {
        assert.equal(toHexString([123, 123]), '7b7b');
        assert.equal(toHexString(Uint8Array.from([123, 123])), '7b7b');
        assert.equal(toHexString(Buffer.from([123, 123])), '7b7b');
        assert.equal(toHexString([0]), '00');
        assert.equal(toHexString([]), '');
    });
    it('should convert byte arrays to formatted hex string', () => {
        assert.equal(toHexString([123, 123], true), '0x7b7b');
        assert.equal(toHexString([0], true), '0x0');
        assert.equal(toHexString([], true), '0x0');
    });
});
describe('fromHexString', () => {
    it('should convert hex strings to byte arrays', () => {
        assert.deepEqual(fromHexString('7b7b'), Uint8Array.from([123, 123]));
        assert.deepEqual(fromHexString('101'), Uint8Array.from([1, 1]));
        assert.deepEqual(fromHexString('0'), Uint8Array.from([0]));
        assert.deepEqual(fromHexString(''), Uint8Array.from([]));
    });
});
describe('encodeByteArray', () => {
    it('should encode byte arrays', () => {
        assert.equal(encodeByteArray(Uint8Array.from([0, 0])), '11');
        assert.equal(encodeByteArray(Uint8Array.from([0, 0]), 'hex'), '0000');
        assert.equal(encodeByteArray(Uint8Array.from([0, 0]), 'base64'), 'AAA=');
        assert.equal(encodeByteArray(Buffer.from([0, 0]), 'base64'), 'AAA=');
    });
});
describe('decodeToBytes', () => {
    it('should decode to byte array', () => {
        assert.isTrue(decodeToBytes('11').equals(Buffer.from([0, 0])));
        assert.isTrue(decodeToBytes('0000', 'hex').equals(Buffer.from([0, 0])));
        assert.isTrue(decodeToBytes('AAA=', 'base64').equals(Buffer.from([0, 0])));
    });
});