import { assert } from 'chai';

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
        it('should return disconnected error', (done) => {
            invalidAergo.blockchain().catch((err) => {
                assert.equal(err.code, 14);
                done();
            });
        });
    });

    describe('getConfig()', () => {
        it('should return invalid config', () => {
            assert.equal(invalidAergo.getConfig().url, invalidUrl);
        });
    });

});

describe('Aergo', () => {
    const aergo = new Aergo(); //default connect to 127.0.0.1:7845
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
                assert.isString(bestBlockHash);
                assert.equal(bestBlockHash.length, 64);
                assert.isNumber(response.getBestHeight());
                done();
            });
        });
    });

    describe('getBlock()', () => {
        it('should return block info by hash', (done) => {
            aergo.getBlock(bestBlockHash).then((response) => { // eslint-disable-line no-unused-vars
                done();
            });
        });
        it('should return block info by number', (done) => {
            // TODO
            done();
            /*aergo.getBlock(bestBlockNumber).then((response) => {
                done();
            }).catch(done);*/
        });
    });
});
