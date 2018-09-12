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

    describe('getState()', () => {
        let testaddress;
        beforeEach(async ()=>{
            testaddress = await aergo.accounts.create('testpass');
        });

        it('should return state info by account address', (done) => {
            aergo.getState(testaddress).then((response) => {
                assert.equal(response.getNonce(), 0);
                assert.equal(response.getBalance(), 0);
                done();
            });
        });
    });
    
    describe('getNonce()', () => {
        let testaddress;
        beforeEach(async ()=>{
            testaddress = await aergo.accounts.create('testpass');
        });

        it('should return nonce of account address', (done) => {
            aergo.getNonce(testaddress).then((response) => {
                assert.equal(response, 0);
                done();
            });
        });

        it('should update nonce after submitting transaction', async () => {
            await aergo.accounts.unlock(testaddress, 'testpass');
            //console.log(`address: ${testaddress}`);
            const unsignedtx = {
                nonce: 1,
                from: testaddress,
                to: testaddress,
                amount: 123,
                payload: null,
            };
            const signedtx = await aergo.accounts.signTransaction(unsignedtx);
            const txhash = await aergo.sendTransaction(signedtx);
            //console.log(`txhash: ${txhash}, pending...`);
            for(;;) {
                const result = await aergo.getTransaction(txhash);
                //console.log(`tx ${result.tx.hash} still pending...`);
                if ('block' in result) {
                    //console.log(`included in block #${result.block.getIdx()} (${result.block.getBlockhash_asB64()})`);
                    break;
                }
            }
            return aergo.getNonce(testaddress).then((nonce) => {
                assert.equal(nonce, 1);
            });
        }).timeout(5000);
    });

    describe('getTransaction()', () => {
        let testtx;
        beforeEach(async ()=>{
            const created = await aergo.accounts.create('testpass');
            const unlocked = await aergo.accounts.unlock(created, 'testpass');
            assert.equal(created, unlocked);
            const address = unlocked;
            const unsignedtx = {
                nonce: 1,
                from: address,
                to: address,
                amount: 123,
                payload: null,
            };
            // Tx is signed and submitted correctly
            testtx = await aergo.accounts.signTransaction(unsignedtx);
            const txhash = await aergo.sendTransaction(testtx);
        });
        it('should return transaction info by hash', async() => {
            const result = await aergo.getTransaction(testtx.hash);
            assert.equal(result.tx.hash, testtx.hash);
        });
    });
});
