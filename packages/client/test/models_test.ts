import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AergoClient from '../src';
import Address from '../src/models/address';

describe('Address', () => {
    const aergo = new AergoClient();

    it('should return created base58 encoded address', async () => {
        const addr = await aergo.accounts.create('testpass');
        assert(addr instanceof Address, 'address should be instance of Address');
        assert.equal(addr.length, 33);
    });
});
