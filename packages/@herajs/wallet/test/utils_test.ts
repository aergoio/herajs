import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { serializeAccountSpec, deserializeAccountSpec, propPath } from '../src/utils';

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

describe('propPath', () => {
    it('accesses root elements', async () => {
        const obj = {
            key: 'value'
        };
        assert.equal(propPath(obj, 'key'), 'value');
    });
    it('accesses nested elements', async () => {
        const obj = {
            child: {
                key: 'value'
            }
        };
        assert.equal(propPath(obj, 'child.key'), 'value');
    });
    it('returns undefined for non-existing paths', async () => {
        const obj = {
            child: {
                key: 'value'
            }
        };
        assert.isUndefined(propPath(obj, 'not-existing'));
        assert.isUndefined(propPath(obj, 'child.not-existing'));
        assert.isUndefined(propPath(obj, 'child.key.not-existing'));
    });
});
