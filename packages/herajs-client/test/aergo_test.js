import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import Aergo from '../src';
import GrpcProvider from '../src/providers/grpc';

describe('Aergo invalid config', () => {
    const invalidUrl = 'invalid';
    const invalidAergo = new Aergo({}, new GrpcProvider({url: invalidUrl}));
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

    describe('getInvalidConfig()', () => {
        it('should return default config', () => {
            assert.equal(invalidAergo.client.config.url, invalidUrl);
        });
    });
});

describe('Aergo', () => {
    const aergo = new Aergo();
    let bestBlockHash;
    let bestBlockNumber;

    describe('getDefaultConfig()', () => {
        it('should return default config', () => {
            assert.equal(aergo.client.config.url, 'localhost:7845');
        });
    });

    describe('blockchain()', () => {
        it('should return best block hash and number', (done) => {
            aergo.blockchain().then((response) => {
                bestBlockHash = response.bestBlockHash;
                bestBlockNumber = response.bestHeight;
                assert.isString(bestBlockHash);
                assert.isNumber(bestBlockNumber);
                done();
            });
        });
    });

    describe('getBlock()', () => {
        it('should return block info by hash', (done) => {
            aergo.getBlock(bestBlockHash).then((response) => {
                assert.equal(response.header.blockno, bestBlockNumber);
                done();
            });
        });
        it('should return block info by number', (done) => {
            aergo.getBlock(bestBlockNumber).then((response) => {
                assert.deepEqual(response.hash, bestBlockHash);
                done();
            });
        });
        it('should throw error when hash invalid', () => {
            assert.throws(() => {
                aergo.getBlock('111');
            }, Error, 'Invalid block hash. Must be 32 byte encoded in hex. Did you mean to pass a block number?');
        });
        it('should throw error when block not found', async () => {
            return assert.isRejected(
                aergo.getBlock(0xFFFFFFFFFFFFFFF),
                Error, '13 INTERNAL: block not found: blockNo=1152921504606846976'
            );
        });
        it('should throw error when number out of range', () => {
            assert.throws(() => {
                aergo.getBlock(0xFFFFFFFFFFFFFFFF);
            }, Error, 'Number exeeds uint64 range');
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

        it('should return error for invalid address', () => {
            assert.throws(() => {
                aergo.getState('invalid');
            }, Error, 'Non-base58 character');
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
            const txhash = await aergo.sendSignedTransaction(signedtx);
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
            await aergo.sendSignedTransaction(testtx);
        });
        it('should return transaction info by hash', async() => {
            const result = await aergo.getTransaction(testtx.hash);
            assert.equal(result.tx.hash, testtx.hash);
        });
    });
});
