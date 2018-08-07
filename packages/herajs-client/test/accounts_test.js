import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import Aergo from '../src';


describe('Aergo.Accounts', () => {
    const aergo = new Aergo(); //default connect to 127.0.0.1:7845
    let testAddress = '2a4b7eNT4nX5d76RbT6tq9u4PvNx';
    describe('create()', () => {
        it('should return created base58 encoded address', (done) => {
            aergo.accounts.create('testpass').then((address) => {
                assert.isString(address);
                testAddress = address;
                done();
            });
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
                assert.isString(address);
                done();
            });
        });
    });

    describe('lock()', () => {
        it('should return locked address', (done) => {
            aergo.accounts.lock(testAddress, 'testpass').then((address) => {
                assert.isString(address);
                done();
            });
        });
    });

    describe('signTX()', () => {
        it('unlocked account for sign', (done) => {
            aergo.accounts.unlock(testAddress, 'testpass').then((address) => {
                assert.isString(address);
                done();
            });
        });

        it('should return tx which has a unlocked account sign', (done) => {
            const testtx = {
                nonce: 1,
                from: testAddress,
                to: testAddress,
                amount: 123,
                payload: null,
            };
            aergo.accounts.signTransaction(testtx)
                .then((result) => {
                    assert.equal(testtx.nonce, result.nonce);
                    assert.equal(testtx.from, result.from);
                    assert.typeOf(result.sign, 'Uint8Array');
                    assert.equal(result.sign.length, 65);
                    done();
                });
        });
    });

    describe('sendTransaction()', () => {
        it('should send signed transaction', async () => {
            const createdAddress = await aergo.accounts.create('testpass');
            const address = await aergo.accounts.unlock(createdAddress, 'testpass');
            assert.equal(address, createdAddress);
            const testtx = {
                nonce: 1,
                from: address,
                to: address,
                amount: 123,
                payload: null,
            };
            const tx = await aergo.accounts.signTransaction(testtx);
            const txhash = await aergo.sendTransaction(tx);
            // Tx is submitted correctly
            assert.typeOf(txhash, 'Uint8Array');
            assert.equal(txhash.length, 32);
            // Submitting same tx again should error
            return assert.isRejected(aergo.sendTransaction(tx));
        });
    });

    describe('signTX(),sendTX()Perf', () => {
        it('should not timeout, synchronous sign-send', async () => {
            const createdAddress = await aergo.accounts.create('testpass');
            const address = await aergo.accounts.unlock(createdAddress, 'testpass');
            for (let i = 1; i <= 1000; i++) {
                const testtx = {
                    nonce: i,
                    from: address,
                    to: address,
                    amount: i,
                    payload: null,
                };
                const signedtx = await aergo.accounts.signTransaction(testtx);
                assert.equal(signedtx.sign.length, 65);
                const txhash = await aergo.sendTransaction(signedtx);
                assert.typeOf(txhash, 'Uint8Array');
                assert.equal(txhash.length, 32);
            }
        }).timeout(10000);
    });
});