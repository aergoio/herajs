import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AergoClient from '../src';
import Address from '../src/models/address';
import GrpcProvider from '../src/providers/grpc';

import { createIdentity, signTransaction, hashTransaction } from '@herajs/crypto';
import { commitTestTransaction } from './utils';

describe('Aergo invalid config', () => {
    const invalidUrl = 'invalid';
    const invalidAergo = new AergoClient({}, new GrpcProvider({ url: invalidUrl }));
    describe('isConnected()', () => {
        it('should return false when disconnected', () => {
            assert.equal(invalidAergo.isConnected(), false);
        });
    });

    describe('blockchain()', () => {
        it('should return disconnected error', async () => {
            return assert.isRejected(invalidAergo.blockchain(), Error, '14 UNAVAILABLE: DNS resolution failed');
        });
    });

    describe('getInvalidConfig()', () => {
        it('should return default config', () => {
            assert.equal(invalidAergo.client.config.url, invalidUrl);
        });
    });

    describe('GrpcProvider', () => {
        it('should throw error when protocol is included', () => {
            assert.throws(() => {
                new GrpcProvider({ url: 'http://foo.bar' });
            }, Error, 'URL for GrpcProvider should be provided without scheme (not http)');
            assert.throws(() => {
                new GrpcProvider({ url: 'https://foo.bar' });
            }, Error, 'URL for GrpcProvider should be provided without scheme (not https)');
        });
    });
});

describe('Aergo', () => {
    const aergo = new AergoClient();
    let bestBlockHash: string;
    let bestBlockNumber: number;

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

    describe('getChainInfo()', () => {
        it('should return basic chain information', async () => {
            const info = await aergo.getChainInfo();
            assert.equal(info.chainid.magic, 'dev.chain');
        });
    });

    describe('getServerInfo()', () => {
        it('should return server information', async () => {
            const info = await aergo.getServerInfo();
            // @ts-ignore
            assert.equal(info.configMap.get('base').get('personal'), 'true');
            // @ts-ignore
            assert.equal(info.configMap.get('account').get('unlocktimeout'), '60');
            // @ts-ignore
            assert.equal(info.statusMap.get('addr'), '127.0.0.1');
        });
    });

    describe('getNodeState()', () => {
        it('should return node state for all components', async () => {
            const info = await aergo.getNodeState();
            assert.equal(info.AccountsSvc.status, 'started');
            assert.isTrue(Object.keys(info).length > 1);
        }).timeout(10000);
        it('should return node state for single components', async () => {
            const info = await aergo.getNodeState('RPCSvc');
            assert.equal(info.RPCSvc.status, 'started');
            assert.equal(Object.keys(info).length, 1);
        });
    });

    describe('getConsensusInfo()', () => {
        it('should return consensus information', async () => {
            const info = await aergo.getConsensusInfo();
            assert.equal(info.type, 'sbp');
        });
    });

    describe('getPeers()', () => {
        it('should get a list of peers', async () => {
            const peers = await aergo.getPeers();
            assert.instanceOf(peers, Array);
            assert.equal(peers[0].acceptedrole, 1);
            assert.equal(peers[0].acceptedroleLabel, 'PRODUCER');
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
            return assert.isRejected(
                aergo.getBlock('111'),
                Error,
                'Invalid block hash. Must be 32 byte encoded in bs58. Did you mean to pass a block number?'
            );
        });
        it('should throw error when argument is missing', () => {
            return assert.isRejected(
                // @ts-ignore
                aergo.getBlock(),
                Error,
                'Missing argument block hash or number'
            );
        });
        it('should throw error when block not found by number', async () => {
            return assert.isRejected(
                aergo.getBlock(0xFFFFFFFFFFFFFFF), // eslint-disable-line
                Error,
                '13 INTERNAL: block not found: blockNo=1152921504606846976'
            );
        });
        it('should throw error when block not found by hash', async () => {
            return assert.isRejected(
                aergo.getBlock('3ntLyinxwZ3W51AWms4UPjjBHW4CDQHqmrP5NmgmmEZ4'),
                Error,
                'block not found'
            );
        });
        it('should throw error when number out of range', () => {
            return assert.isRejected(
                aergo.getBlock(0xFFFFFFFFFFFFFFFF), // eslint-disable-line
                Error,
                'Number exeeds range'
            );
        });
    });

    describe('getBlock() and getMetadata()', () => {
        it('should return block info by hash', async () => {
            const block = await aergo.getBlock(bestBlockHash);
            const blockMetadata = await aergo.getBlockMetadata(bestBlockHash);
            assert.equal(block.body.txsList.length, blockMetadata.txcount);
            assert.equal(block.header.prevblockhash, blockMetadata.header.prevblockhash);
        });
    });

    describe('getBlockStream()', () => {
        it('should stream new blocks', (done) => {
            const stream = aergo.getBlockStream();
            try {
                let countBlocks = 3;
                stream.on('data', (blockHeader) => {
                    countBlocks -= 1;
                    assert.isTrue(Object.prototype.hasOwnProperty.call(blockHeader, 'hash'));
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

    describe('getBlockMetadataStream()', () => {
        it('should stream new block metadata', (done) => {
            const stream = aergo.getBlockMetadataStream();
            try {
                let countBlocks = 3;
                stream.on('data', (blockMetadata) => {
                    countBlocks -= 1;
                    assert.isTrue(Object.prototype.hasOwnProperty.call(blockMetadata, 'hash'));
                    assert.isTrue(Object.prototype.hasOwnProperty.call(blockMetadata.header, 'blockno'));
                    assert.typeOf(blockMetadata.txcount, 'number');
                    assert.typeOf(blockMetadata.size, 'number');
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
        let testaddress: Address;
        beforeEach(async ()=>{
            testaddress = await aergo.accounts.create('testpass');
        });

        it('should return state info by account address', async () => {
            const state = await aergo.getState(testaddress);
            assert.equal(state.nonce, 0);
            assert.equal(state.balance.toUnit('aergo').toString(), '20000 aergo');
        });

        it('should return error for invalid address', () => {
            assert.throws(() => {
                aergo.getState('invalidinvalidinvalid');
            }, Error, 'Non-base58 character');
        });

        /*
        it('should return error for not found name', async () => {
            const result = await aergo.getState('notregister');
            console.log(result);
        });
        */
    });
    
    describe('getNonce()', () => {
        let testaddress: Address;
        let txhash: string;
        let blockhash: string;

        it('should return nonce of account address', async () => {
            testaddress = await aergo.accounts.create('testpass');
            const nonce = await aergo.getNonce(testaddress);
            assert.equal(nonce, 0);
        });

        it('should update nonce after submitting transaction', async () => {
            await aergo.accounts.unlock(testaddress, 'testpass');
            const tx = {
                from: testaddress,
                to: testaddress,
                amount: '1337 aer',
                chainIdHash: await aergo.getChainIdHash()
            };
            txhash = await aergo.accounts.sendTransaction(tx);
            const receipt = await aergo.waitForTransactionReceipt(txhash);
            blockhash = receipt.blockhash;
            return aergo.getNonce(testaddress).then((nonce) => {
                assert.equal(nonce, 1);
            });
        }).timeout(6500);

        it('should return transaction hash in block', async() => {
            const result = await aergo.getBlock(blockhash);
            const txs = result.body.txsList.filter(tx => tx.hash === txhash);
            assert.equal(txs.length, 1);
            assert.equal(txs[0].amount.toString(), '1337 aer');
        });
    });

    describe('getTransaction()', () => {
        let testtx: any;
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
                chainIdHash: await aergo.getChainIdHash()
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
                amount: '100 aer',
                chainIdHash: await aergo.getChainIdHash(),
                sign: null,
                hash: null,
            } as any;
            tx.sign = await signTransaction(tx, identity.keyPair);
            tx.hash = await hashTransaction(tx, 'bytes');
            const txhash = await aergo.sendSignedTransaction(tx);
            assert.typeOf(txhash, 'string');
            const commitedTx = await aergo.getTransaction(txhash);
            assert.equal(commitedTx.tx.amount.toString(), tx.amount.toString());
        });
        it('should send multiple tx succesfully', async () => {
            const identity = createIdentity();
            const tx1 = {
                nonce: 1,
                from: identity.address,
                to: identity.address,
                amount: '100 aer',
                chainIdHash: await aergo.getChainIdHash(),
                sign: null,
                hash: null,
            } as any;
            const tx2 = { ...tx1, nonce: 2 };
            const txs = [tx1, tx2];
            for (const tx of txs) {
                tx.sign = await signTransaction(tx, identity.keyPair);
                tx.hash = await hashTransaction(tx, 'base58');
            }
            const results = await aergo.sendSignedTransaction(txs);
            assert.equal(results.length, 2);
            assert.isFalse(results.some(res => res.error), 'there should be no errors');
            assert.isTrue(results.every(res => res.hash), 'there should be hashes in the result');
            for (const [index, res] of results.entries()) {
                assert.equal(txs[index].hash, res.hash);
            }
        });
        it('should send multiple tx with some error', async () => {
            const identity = createIdentity();
            const tx1 = {
                nonce: 1,
                from: identity.address,
                to: identity.address,
                amount: '100 aer',
                chainIdHash: await aergo.getChainIdHash(),
                sign: null,
                hash: null,
            } as any;
            const tx2 = { ...tx1 }; // Error: duplicate nonce
            const txs = [tx1, tx2];
            for (const tx of txs) {
                tx.sign = await signTransaction(tx, identity.keyPair);
                tx.hash = await hashTransaction(tx, 'base58');
            }
            const results = await aergo.sendSignedTransaction(txs);
            assert.equal(results.length, 2);
            const failedTx = results.find(res => res.error);
            assert.match(failedTx.error, /already in mempool/);
            const successTx = results.find(res => res.hash);
            const commitedTx = await aergo.getTransaction(successTx.hash);
            assert.equal(commitedTx.tx.amount.toString(), txs[0].amount.toString());
        });
    });

    describe('getBlockMetadata and getBlockBody', () => {
        it('should retrieve metadata and body separately', async () => {
            const commitedTx = await commitTestTransaction(aergo);

            const metadata = await aergo.getBlockMetadata(commitedTx.block.hash);
            const body = await aergo.getBlockBody(commitedTx.block.hash);

            assert.isAtLeast(metadata.txcount, 1);
            assert.equal(metadata.txcount, body.body.txsList.length);
            assert.equal(metadata.txcount, body.total);
            assert.equal(metadata.hash, commitedTx.block.hash);
            const tx = body.body.txsList.find(tx => tx.hash === commitedTx.tx.hash);
            if (!tx) throw new Error('could not find tx');
            assert.equal(tx.from.toString(), commitedTx.tx.from.toString());
        });
        it('should page getBlockBody', async () => {
            const commitedTx = await commitTestTransaction(aergo);

            const body = await aergo.getBlockBody(commitedTx.block.hash, 0, 1);
            assert.isAtLeast(body.total, 1);
            assert.equal(body.body.txsList.length, 1);
            
            const body2 = await aergo.getBlockBody(commitedTx.block.hash, 1, 1);
            assert.equal(body2.total, body.total);
            assert.isBelow(body2.body.txsList.length, body2.total);
        });
    });

    
    describe.skip('getVotingResult()', () => {
        it('should return given number of voting result', async () => {
            const voteList = await aergo.getTopVotes(10);
            assert.typeOf(voteList, 'Array');
        });
    });
});
