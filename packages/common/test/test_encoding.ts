import chai from 'chai';
const assert = chai.assert;

import { toHexString, fromHexString, encodeBuffer, decodeToBytes, base58, base58check } from '../src/encoding';

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
describe('encodeBuffer', () => {
    it('should encode byte arrays', () => {
        assert.equal(encodeBuffer(Uint8Array.from([0, 0])), '11');
        assert.equal(encodeBuffer(Uint8Array.from([0, 0]), 'hex'), '0000');
        assert.equal(encodeBuffer(Uint8Array.from([0, 0]), 'base64'), 'AAA=');
        assert.equal(encodeBuffer(Buffer.from([0, 0]), 'base64'), 'AAA=');
    });
});
describe('decodeToBytes', () => {
    it('should decode to byte array', () => {
        assert.isTrue(decodeToBytes('11').equals(Buffer.from([0, 0])));
        assert.isTrue(decodeToBytes('0000', 'hex').equals(Buffer.from([0, 0])));
        assert.isTrue(decodeToBytes('AAA=', 'base64').equals(Buffer.from([0, 0])));
        assert.isTrue(decodeToBytes(Buffer.from([0])).equals(Buffer.from([0])));
    });
});
describe('base58', () => {
    it('should decode to byte array', () => {
        assert.deepEqual(
            base58.decode('7GupW6a49hjMUDjeP6ZxKbAPN5RrefdQ8cP8e6tvAx4w'),
            Buffer.from([93,57,142,107,17,101,180,44,184,123,6,159,234,76,128,202,142,14,211,14,45,224,106,103,142,116,98,134,142,10,220,248])
        );
    });
    it('should encode to string', () => {
        assert.equal(base58.encode(Buffer.from([1, 2, 3])), 'Ldp');
    });
    it('should throw with invalid input', () => {
        assert.throws(() => {
            base58.decode('+==');
        }, Error, 'Non-base58 character');
    });
});
describe('base58check', () => {
    it('should decode to byte array', () => {
        const bytes = Buffer.from([0x42,3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73]);
        const encoded = 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX';
        assert.deepEqual(
            base58check.decode(encoded),
            bytes,
        );
    });
    it('should encode to string', () => {
        const bytes = Buffer.from([0x42,3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73]);
        const encoded = 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX';
        assert.deepEqual(
            base58check.encode(bytes),
            encoded,
        );

        const bytes2 = Buffer.from([0xFF,3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73]);
        const encoded2 = 'eiy7GRPj22w84J6H4XGfmeivxsKGouFBCgYnDL5wYTkwnAy1KqAK';
        assert.deepEqual(
            base58check.encode(bytes2),
            encoded2,
        );
    });
});
