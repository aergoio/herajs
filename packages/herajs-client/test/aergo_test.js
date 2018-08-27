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
    
    describe('getTransaction()', () => {
        it('should return transaction info by hash', async() => {
            const testtx = {
                'hash':'AtVRaJ1rXJgRIi4kphMxedI5OtYHm9B4cF+2mKf2zUI=',
                'nonce':1,
                'from':'3MAzNsu49uafhpq8rrNJWTTkvStD',
                'to':'2pFvu7PWU2jRFMCKv5zcgrX6NqKb',
                'amount':25000,
                'payload':null,
                'limit':100,
                'price':1,
                'sign':'IElAcPQEPbCMhVUSoRtCQIcdMIckkE4A2OvofhR61D6XRvAAyp1tUWWGWXFdtmwkrVI4kF1epexkvD0o1kDM7g4=',
                'type':10
            };
            //send transaction to get
            //const txhash = await aergo.sendTransaction(testtx);
            //get transaction
            /*
            aergo.getTransaction(testtx.hash)
                .then((result) => {
                    assert.equal(result.tx.hash, testtx.hash);
                    done();
                });
            */
            const result = await aergo.getTransaction(testtx.hash);
            assert.equal(result.tx.hash, testtx.hash);
        });
    });
});
