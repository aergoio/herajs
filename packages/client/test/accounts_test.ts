import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AergoClient from '../src';
import Address from '../src/models/address';

import { longPolling } from '../src/utils';

import JSBI from 'jsbi';
import { Amount } from '@herajs/common';

describe('Aergo.Accounts', () => {
    const aergo = new AergoClient(); //default connect to 127.0.0.1:7845
    let testAddress: string | Address = 'INVALIDADDRESS';
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
                amount: '123 aer',
                chainIdHash: await aergo.getChainIdHash()
            };
            const txhash = await aergo.accounts.sendTransaction(testtx);
            assert.typeOf(txhash, 'string');
        });
        it('should send to a name', async () => {
            const name = '' + (Math.random() * 99999999999 + 100000000000).toFixed(0);
            await aergo.accounts.unlock(testAddress, 'testpass');
            const testtx = {
                from: testAddress,
                to: 'aergo.name',
                amount: '1 aergo',
                payload: `{"Name":"v1createName","Args":["${name}"]}`,
                type: 1,
                chainIdHash: await aergo.getChainIdHash(),
            };
            const txhash = await aergo.accounts.sendTransaction(testtx);
            await aergo.waitForTransactionReceipt(txhash, 2000);

            const testtx2 = {
                from: testAddress,
                to: name,
                chainIdHash: await aergo.getChainIdHash()
            };
            await aergo.accounts.sendTransaction(testtx2);
        }).timeout(3000);
        it('should error when sending to unregistered name', async () => {
            const name = '' + (Math.random() * 99999999999 + 100000000000).toFixed(0);
            await aergo.accounts.unlock(testAddress, 'testpass');
            const testtx = {
                from: testAddress,
                to: name,
                chainIdHash: await aergo.getChainIdHash()
            };
            return assert.isRejected(aergo.accounts.sendTransaction(testtx), 'UNDEFINED_ERROR: tx invalid recipient');
        });
    });

    describe('signTX()', () => {
        it('should return tx which has a unlocked account sign', async () => {
            const testtx = {
                nonce: 1,
                from: testAddress,
                to: testAddress,
                amount: '123 aer',
                payload: null,
                chainIdHash: await aergo.getChainIdHash()
            };
            return aergo.accounts.signTransaction(testtx)
                .then((result) => {
                    assert.equal(testtx.nonce, result.nonce);
                    assert.deepEqual(testtx.from.toString(), result.from.toString());
                    assert.typeOf(result.sign, 'string');
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
                chainIdHash: await aergo.getChainIdHash()
            };
            // Tx is signed and submitted correctly
            const tx = await aergo.accounts.signTransaction(testtx);
            const txhash = await aergo.sendSignedTransaction(tx);
            assert.typeOf(txhash, 'string');

            // Tx has receipt
            const txReceipt = await aergo.waitForTransactionReceipt(txhash);
            assert.isTrue(txReceipt.fee.equal(new Amount('5000000000000000 aer')), `Wrong fee: ${txReceipt.fee}`);
            assert.isTrue(txReceipt.cumulativefee.equal(0), `Wrong cumulativefee: ${txReceipt.cumulativefee}`);
            
            // Tx can be retrieved again
            const tx2 = await aergo.getTransaction(txhash);
            assert.equal(tx2.tx.hash, tx.hash);
            assert.isTrue(tx2.tx.amount.equal(tx.amount.value as JSBI));
            // @ts-ignore
            assert.equal(txReceipt.blockhash, tx2.block.hash);

            // Submitting same tx again should error
            return assert.isRejected(aergo.sendSignedTransaction(tx));
        }).timeout(5000);
        it('should catch a max payload error', async () => {
            const createdAddress = await aergo.accounts.create('testpass');
            const address = await aergo.accounts.unlock(createdAddress, 'testpass');
            assert.deepEqual(address.value, createdAddress.value);
            const testtx = {
                nonce: 1,
                from: address,
                to: address,
                amount: '123 aer',
                payload: Buffer.allocUnsafe(250000).fill(1),
                chainIdHash: await aergo.getChainIdHash()
            };
            const tx = await aergo.accounts.signTransaction(testtx);
            return assert.isRejected(
                aergo.sendSignedTransaction(tx),
                Error, 'UNDEFINED_ERROR: size of tx exceeds max length'
            );
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
                    chainIdHash: await aergo.getChainIdHash()
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
                payload: `{"Name":"v1createName","Args":["${name}"]}`,
                type: 1,
                chainIdHash: await aergo.getChainIdHash()
            };
            const txhash = await aergo.accounts.sendTransaction(testtx);
            await longPolling(async () => {
                return await aergo.getTransaction(txhash);
            }, result => 'block' in result, 2000);

            const info = await aergo.getNameInfo(name);
            assert.equal(info.owner.toString(), testAddress);
            assert.equal(info.destination.toString(), testAddress);
        });
    });
});