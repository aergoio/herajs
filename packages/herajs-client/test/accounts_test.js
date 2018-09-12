import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import Aergo from '../src';


describe('Aergo.Accounts', () => {
    const aergo = new Aergo(); //default connect to 127.0.0.1:7845
    const transactionHashLength = 44;
    let testAddress = 'INVALIDADDRESS';
    beforeEach(async ()=>{
        const created = await aergo.accounts.create('testpass');
        const unlocked = await aergo.accounts.unlock(created, 'testpass');
        assert.equal(created, unlocked);
        testAddress = unlocked;
    });

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
                    assert.typeOf(result.sign, 'string');
                    assert.equal(result.sign.length, 88); //raw byte length 65
                    done();
                });
        });
    });

    describe('sendTransaction()', () => {
        it('should sign, commit, and retrieve transaction', async () => {
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
            // Tx is signed and submitted correctly
            const tx = await aergo.accounts.signTransaction(testtx);
            const txhash = await aergo.sendTransaction(tx);
            assert.typeOf(txhash, 'string');
            assert.equal(txhash.length, transactionHashLength);

            // Tx can be retrieved again from mempool
            const tx2 = await aergo.getTransaction(tx.hash);
            assert.equal(tx2.tx.hash, tx.hash);
            assert.equal(tx2.tx.amount, tx.amount);

            // Submitting same tx again should error
            return assert.isRejected(aergo.sendTransaction(tx));
        });
    });

    describe('signTX(),sendTX()Multiple', () => {
        it('should not timeout', async () => {
            const createdAddress = await aergo.accounts.create('testpass');
            const address = await aergo.accounts.unlock(createdAddress, 'testpass');
            const promises = [];
            for (let i = 1; i <= 20; i++) {
                const testtx = {
                    nonce: i,
                    from: address,
                    to: address,
                    amount: i,
                    payload: null,
                };
                promises.push(new Promise((resolve, reject) => {
                    aergo.accounts.signTransaction(testtx).then((signedtx) => {
                        aergo.sendTransaction(signedtx).then((txhash) => {
                            assert.equal(txhash.length, transactionHashLength);
                            resolve();
                        }).catch(reject);
                    }).catch(reject);
                }));
            }
            await Promise.all(promises);
        }).timeout(10000);
    });
});