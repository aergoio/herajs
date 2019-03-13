import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import 'regenerator-runtime/runtime';

import { serializeAccountSpec, deserializeAccountSpec } from '../src/utils';


describe('serializeAccountSpec', () => {
    it('should work', async () => {
        assert.equal(serializeAccountSpec({
            address: 'foo'
        }), '/foo');
        assert.equal(serializeAccountSpec({
            address: 'foo',
            chainId: 'testnet'
        }), 'testnet/foo');
    });
});

describe('deserializeAccountSpec', () => {
    it('should work', async () => {
        assert.deepEqual(deserializeAccountSpec('/address'), {
            address: 'address'
        });
        assert.deepEqual(deserializeAccountSpec('address'), {
            address: 'address'
        });
        assert.deepEqual(deserializeAccountSpec('chainId/address'), {
            chainId: 'chainId',
            address: 'address'
        });
    });
});
