import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import Address from '../src/classes/address';

describe('Address', () => {
    it('should encode raw bytes to string', () => {
        const bytes = Buffer.from([3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73]);
        const addr = new Address(bytes);
        assert.equal(addr.toString(), 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX');
        assert.equal(''+addr, 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX');
        assert.equal(JSON.stringify(addr), '"AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX"');
    });
    it('should decode string to raw bytes', () => {
        const encoded = 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX';
        const bytes = Buffer.from([3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73]);
        const addr = new Address(encoded);
        assert.deepEqual(addr.asBytes(), bytes);
        assert.deepEqual(addr.bytes, bytes);
    });
    it('should encode a null address to an empty string', () => {
        const bytes = Buffer.from([]);
        const addr = new Address(bytes);
        assert.equal(addr.toString(), '');
        assert.equal(Address.encode(bytes), '');
    });
    it('should throw with invalid address', () => {
        assert.throws(() => new Address('InvalidInvalidInvalidInvalid'), Error, 'Non-base58 character');
        assert.throws(() => new Address('abcabcabcabcabcabc'), Error, 'Invalid checksum');
        assert.throws(() => new Address('2DEMLvmHGwDgSSjYAgDS57YLM6YnrSbjswrnzXXXQD6Wa9nuUT63AcY1MV3DqyANrd2T4CEGF'), Error, 'invalid address length (48)');
        assert.throws(() => new Address('eiy7GRPj22w84J6H4XGfmeivxsKGouFBCgYnDL5wYTkwnAy1KqAK'), Error, 'invalid address prefix (255)');
    });
    it('should encode account names from bytes', () => {
        const a1 = new Address(Uint8Array.from([97, 101, 114, 103, 111, 46, 115, 121, 115, 116, 101, 109]));
        assert.equal(a1.toString(), 'aergo.system');
        const a2 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 115, 121, 115, 116, 101, 109, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        assert.equal(a2.toString(), 'aergo.system');
        const a3 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 110, 97, 109, 101]));
        assert.equal(a3.toString(), 'aergo.name');
        const a4 = new Address(Buffer.from([97, 101, 114, 103, 111, 46, 101, 110, 116, 101, 114, 112, 114, 105, 115, 101]));
        assert.equal(a4.toString(), 'aergo.enterprise');
    });
    it('should return length of raw address', () => {
        const a1 = new Address(Uint8Array.from([97, 101, 114, 103, 111, 46, 115, 121, 115, 116, 101, 109])); // aergo.system
        assert.equal(a1.length, 12);
        const bytes = Buffer.from([3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73]);
        const a2 = new Address(bytes);
        assert.equal(a2.length, 33);
        const a3 = new Address('');
        assert.equal(a3.length, 0);
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
    it('should check equality', () => {
        assert.isTrue(new Address('foo.bar').equal(new Address('foo.bar')));
        assert.isTrue(new Address('foo.bar').equal('foo.bar'));
        assert.isTrue(new Address(Buffer.from([])).equal(new Address('')));
        assert.isFalse(new Address('foo.bar').equal(new Address('bar.foo')));
    });
    it('should be idempotent', () => {
        const a = new Address('AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX');
        assert.equal(a.toString(), new Address(a).toString());
    });
    it('should throw with invalid argument', () => {
        class Invalid {
            toString(): string {
                return 'Foo';
            }
        }
        const invalidInput = new Invalid();
        assert.throws(() => {
            new Address(invalidInput as any);
        }, 'Instantiate Address with raw bytes, a string in base58-check encoding, or a valid name, not Foo');
    });
});
