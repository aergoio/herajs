import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import Aergo from '../src';


describe('Aergo invalid config', () => {
    const invalidUrl = 'invalid';
    const invalidAergo = new Aergo({url: invalidUrl});
    describe('isConnected()', () => {
        it('should return false when disconnected', () => {
            assert.equal(invalidAergo.isConnected(), false);
        });
    });

    describe('blockchain()', () => {
        it('should return disconnected error', async () => {
            return assert.isRejected(invalidAergo.blockchain(), Error, '14 UNAVAILABLE: Name resolution failure');
        });
    });

    describe('getConfig()', () => {
        it('should return invalid config', () => {
            assert.equal(invalidAergo.getConfig().url, invalidUrl);
        });
    });

});

describe('Aergo', () => {
    const aergo = new Aergo(); //default connect to 127.0.0.1:7844
    let bestBlockHash;
    let bestBlockNumber;

    describe('getDefaultConfig()', () => {
        it('should return default config', () => {
            assert.equal(aergo.getConfig().url, '127.0.0.1:7845');
        });
    });

    describe('blockchain()', () => {
        it('should return best block hash and number', (done) => {
            aergo.blockchain().then((response) => {
                bestBlockHash = response.getBestBlockHash();
                bestBlockNumber = response.getBestHeight();
                assert.typeOf(bestBlockHash, 'Uint8Array');
                assert.equal(bestBlockHash.length, 32);
                assert.isNumber(response.getBestHeight());
                done();
            });
        });
    });

    describe('getBlock()', () => {
        it('should return block info by hash', (done) => {
            aergo.getBlock(bestBlockHash).then((response) => {
                assert.equal(response.getHeader().getBlockno(), bestBlockNumber);
                done();
            });
        });
        it('should return block info by number', (done) => {
            aergo.getBlock(bestBlockNumber).then((response) => {
                assert.deepEqual(response.getHash(), bestBlockHash);
                done();
            });
        });
    });
});
