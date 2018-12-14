import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AergoClient from '../src';
import GrpcProvider from '../src/providers/grpc';

import JSBI from 'jsbi';

//import AergoClient, { GrpcProvider } from '../dist/herajs.esm';

import {createIdentity, signTransaction, hashTransaction} from '@herajs/crypto';
import { longPolling } from '../src/utils';

describe('Aergo invalid config', () => {
    const invalidUrl = 'invalid';
    const invalidAergo = new AergoClient({}, new GrpcProvider({url: invalidUrl}));
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
    const aergo = new AergoClient();
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

    describe('getPeers()', () => {
        it('should get a list of peers', async () => {
            const peers = await aergo.getPeers();
            assert.instanceOf(peers, Array);
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
            }, Error, 'Invalid block hash. Must be 32 byte encoded in bs58. Did you mean to pass a block number?');
        });
        it('should throw error when argument is missing', () => {
            assert.throws(() => {
                aergo.getBlock();
            }, Error, 'Missing argument block hash or number');
        });
        it('should throw error when block not found by number', async () => {
            return assert.isRejected(
                aergo.getBlock(0xFFFFFFFFFFFFFFF),
                Error, '13 INTERNAL: block not found: blockNo=1152921504606846976'
            );
        });
        /*
        it('should throw error when block not found by hash', async () => {
            return assert.isRejected(
                aergo.getBlock('3ntLyinxwZ3W51AWms4UPjjBHW4CDQHqmrP5NmgmmEZ4'),
                Error, 'block not found'
            );
        });
        */
        it('should throw error when number out of range', () => {
            assert.throws(() => {
                aergo.getBlock(0xFFFFFFFFFFFFFFFF);
            }, Error, 'Number exeeds range');
        });
    });

    describe('getBlockStream()', () => {
        it('should stream new blocks', (done) => {
            const stream = aergo.getBlockStream();
            try {
                let countBlocks = 3;
                stream.on('data', (blockHeader) => {
                    countBlocks -= 1;
                    assert.isTrue(blockHeader.hasOwnProperty('hash'));
                    if (countBlocks == 0) {
                        stream.cancel();
                        done();
                    }
                });
            } catch(e) {
                stream.cancel();
                done(e);
            }
        }).timeout(5000);
    });

    describe('getBlockHeaders()', () => {
        it('should get list of last block headers by block height', async () => {
            const blockchainState = await aergo.blockchain();
            const height = blockchainState.bestHeight;
            const list = await aergo.getBlockHeaders(height);
            assert.equal(list[0].hash, blockchainState.bestBlockHash);
            const listAsc = await aergo.getBlockHeaders(height, 10, 0, false);
            assert.equal(listAsc[listAsc.length - 1].hash, blockchainState.bestBlockHash);
        });
        it('should get list of last block headers by block hash', async () => {
            const blockchainState = await aergo.blockchain();
            const hash = blockchainState.bestBlockHash;
            const list = await aergo.getBlockHeaders(hash);
            assert.equal(list[0].header.blockno, blockchainState.bestHeight);
        });
    });

    describe('getState()', () => {
        let testaddress;
        beforeEach(async ()=>{
            testaddress = await aergo.accounts.create('testpass');
        });

        it('should return state info by account address', async () => {
            const state = await aergo.getState(testaddress);
            assert.equal(state.nonce, 0);
            assert.equal(state.balance.toUnit('aergo').toString(), '10 aergo');
        });

        it('should return error for invalid address', () => {
            assert.throws(() => {
                aergo.getState('invalid');
            }, Error, 'Non-base58 character');
        });
    });
    
    describe('getNonce()', () => {
        let testaddress;
        let txhash;
        let blockhash;
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
            const unsignedtx = {
                nonce: 1,
                from: testaddress,
                to: testaddress,
                amount: '13371337 aer',
                payload: null,
            };
            const signedtx = await aergo.accounts.signTransaction(unsignedtx);
            txhash = await aergo.sendSignedTransaction(signedtx);
            const tx = await longPolling(async () => {
                return await aergo.getTransaction(txhash);
            }, result => 'block' in result, 5000);
            assert.equal(tx.tx.hash, txhash);
            blockhash = tx.block.hash;
            return aergo.getNonce(testaddress).then((nonce) => {
                assert.equal(nonce, 1);
            });
        }).timeout(5500);

        it('should return transaction hash in block', async() => {
            const result = await aergo.getBlock(blockhash);
            const txs = result.body.txsList.filter(tx => tx.hash === txhash);
            assert.equal(txs.length, 1);
            assert.equal(txs[0].amount, '13371337 aer');
        });
    });

    describe('getTransaction()', () => {
        let testtx;
        beforeEach(async ()=>{
            const created = await aergo.accounts.create('testpass');
            const unlocked = await aergo.accounts.unlock(created, 'testpass');
            assert.deepEqual(created.value, unlocked.value);
            const address = unlocked;
            const unsignedtx = {
                nonce: 1,
                from: address,
                to: address,
                amount: '123 aer',
                payload: '',
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

    describe('sendLocallySignedTransaction()', () => {
        it('should return hash for comitted tx', async () => {
            const identity = createIdentity();
            const tx = {
                nonce: 1,
                from: identity.address,
                to: identity.address,
                amount: 100,
                payload: '',
            };
            tx.sign = await signTransaction(tx, identity.keyPair);
            tx.hash = await hashTransaction(tx, 'bytes');
            // TODO: signTransaction only understands unitless number, string, or BigInt for amount
            // but sendSignedTransaction assumes aergo if no unit given
            tx.amount = '100 aer';

            return aergo.sendSignedTransaction(tx)
                .then(async (txhash) => {
                    assert.typeOf(txhash, 'string');
                    const commitedTx = await aergo.getTransaction(txhash);
                    assert.equal(commitedTx.tx.amount, tx.amount);
                });
        });
    });

    
    describe.skip('getVotingResult()', () => {
        it('should return given number of voting result', async () => {
            const voteList = await aergo.getVoteResult(10);
            assert.typeOf(voteList, 'Array');
        });
    });
});
