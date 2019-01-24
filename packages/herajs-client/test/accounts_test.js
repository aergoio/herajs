import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AergoClient from '../src';

import { longPolling } from '../src/utils';

import JSBI from 'jsbi';

describe('Aergo.Accounts', () => {
    const aergo = new AergoClient(); //default connect to 127.0.0.1:7845
    let testAddress = 'INVALIDADDRESS';
    beforeEach(async ()=>{
        const created = await aergo.accounts.create('testpass');
        const unlocked = await aergo.accounts.unlock(created, 'testpass');
        assert.deepEqual(created.value, unlocked.value);
        testAddress = unlocked;
    });

    describe('create()', () => {
        it('should return created base58 encoded address', async () => {
            testAddress = await aergo.accounts.create('testpass');
            assert.isString(testAddress.toString());
        });
    });

    describe('get()', () => {
        it('should return address list in the aerge node', (done) => {
            aergo.accounts.get().then((accounts) => {
                assert.isArray(accounts);
                done();
            });
        });
    });

    describe('unlock()', () => {
        it('should return unlocked address', (done) => {
            aergo.accounts.unlock(testAddress, 'testpass').then((address) => {
                assert.isString(address.toString());
                done();
            });
        });
    });

    describe('lock()', () => {
        it('should return locked address', (done) => {
            aergo.accounts.lock(testAddress, 'testpass').then((address) => {
                assert.isString(address.toString());
                done();
            });
        });
    });

    describe('sendTransaction()', () => {
        it('should return hash for signed and comitted tx', async () => {
            await aergo.accounts.unlock(testAddress, 'testpass');
            const testtx = {
                from: testAddress,
                to: testAddress,
                amount: '123 aer'
            };
            return aergo.accounts.sendTransaction(testtx)
                .then((txhash) => {
                    assert.typeOf(txhash, 'string');
                });
        });
    });

    describe('signTX()', () => {
        it('should return tx which has a unlocked account sign', (done) => {
            const testtx = {
                nonce: 1,
                from: testAddress,
                to: testAddress,
                amount: '123 aer',
                payload: null,
            };
            aergo.accounts.signTransaction(testtx)
                .then((result) => {
                    assert.equal(testtx.nonce, result.nonce);
                    assert.deepEqual(testtx.from.value, result.from.value);
                    assert.typeOf(result.sign, 'string');
                    assert.equal(result.sign.length, 96);
                    done();
                });
        });
    });

    describe('sendSignedTransaction()', () => {
        it('should sign, commit, and retrieve transaction', async () => {
            const createdAddress = await aergo.accounts.create('testpass');
            const address = await aergo.accounts.unlock(createdAddress, 'testpass');
            assert.deepEqual(address.value, createdAddress.value);
            const testtx = {
                nonce: 1,
                from: address,
                to: address,
                amount: '123 aer',
                payload: null,
            };
            // Tx is signed and submitted correctly
            const tx = await aergo.accounts.signTransaction(testtx);
            const txhash = await aergo.sendSignedTransaction(tx);
            assert.typeOf(txhash, 'string');

            // Tx can be retrieved again from mempool
            const tx2 = await aergo.getTransaction(tx.hash);
            assert.equal(tx2.tx.hash, tx.hash);
            assert.isTrue(JSBI.equal(tx2.tx.amount.value, tx.amount.value));

            // Submitting same tx again should error
            return assert.isRejected(aergo.sendSignedTransaction(tx));
        });
    });

    describe('signTX(),sendSignedTransaction()Multiple', () => {
        it('should not timeout', async () => {
            const createdAddress = await aergo.accounts.create('testpass');
            const address = await aergo.accounts.unlock(createdAddress, 'testpass');
            for (let i = 1; i <= 20; i++) {
                const testtx = {
                    nonce: i,
                    from: address,
                    to: createdAddress,
                    amount: `${i} aer`,
                };
                const signedtx = await aergo.accounts.signTransaction(testtx);
                const txhash = await aergo.sendSignedTransaction(signedtx);
                assert.typeOf(txhash, 'string');
            }
        }).timeout(10000);
    });

    describe('getNameInfo()', () => {
        it('should return account information for name', async () => {
            const name = '' + (Math.random() * 99999999999 + 100000000000).toFixed(0);
            await aergo.accounts.unlock(testAddress, 'testpass');
            const testtx = {
                from: testAddress,
                to: 'aergo.name',
                amount: '1 aergo',
                payload: 'c' + name,
                type: 1
            };
            const txhash = await aergo.accounts.sendTransaction(testtx);
            await longPolling(async () => {
                return await aergo.getTransaction(txhash);
            }, result => 'block' in result, 2000);

            const info = await aergo.getNameInfo(name);
            assert.equal(info.owner.toString(), testAddress);
        });
    });

    describe('staking', () => {
        let testaddress;

        it('should stake', async () => {
            testaddress = await aergo.accounts.create('testpass');
            await aergo.accounts.unlock(testaddress, 'testpass');
            const testtx = {
                from: testaddress,
                to: 'aergo.system',
                amount: '1 aergo',
                payload: 's',
                type: 1
            };
            const txhash = await aergo.accounts.sendTransaction(testtx);
            await longPolling(async () => {
                return await aergo.getTransaction(txhash);
            }, result => 'block' in result, 2000);
        }).timeout(2500);

        it('should return staking info', async () => {
            const state = await aergo.getStaking(testaddress);
            assert.equal(state.amount.toUnit('aergo').toString(), '1 aergo');
            assert.isTrue(state.when > 0);
        });
    });
});