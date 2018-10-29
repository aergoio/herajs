import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import Address from '../src/models/address';
import AergoClient from '../src';

describe('Address', () => {
    const aergo = new AergoClient();

    it('should return created base58 encoded address', async () => {
        const addr = await aergo.accounts.create('testpass');
        assert(addr instanceof Address, 'address should be instance of Address');
    });
    it('should encode raw bytes to string', () => {
        const bytes = [3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73];
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
});