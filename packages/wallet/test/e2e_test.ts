import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import 'regenerator-runtime/runtime';

import { Wallet } from '../src/wallet';
import { Contract } from '@herajs/client';
import {
    createIdentity, encryptPrivateKey, encodePrivateKey, privateKeyFromMnemonic, identityFromPrivateKey,
    signTransaction, hashTransaction,
} from '@herajs/crypto';
import { NodeTransactionScanner } from '../src/datasources/node-tx-scanner';
//import MemoryStorage from '../src/storages/memory';

import fs from 'fs';
import { resolve } from 'path';
const contractCode = fs.readFileSync(resolve(__dirname, 'fixtures/contract.txt')).toString().trim();
// @ts-ignore
import contractAbi from './fixtures/contract.abi.json';
import { SignedTransaction } from '../src/models/transaction';
import MemoryStorage from '../src/storages/memory';

describe('Wallet scenarios', async () => {
    const ids = [createIdentity(), createIdentity()];
    const address = ids[0].address;
    const encprivkey = encodePrivateKey(await encryptPrivateKey(ids[0].privateKey, ''));

    const address2 = ids[1].address;
    const encprivkey2 = encodePrivateKey(await encryptPrivateKey(ids[1].privateKey, ''));

    it('reads balance (loads address, gets balance, tracks updates)', (done) => {
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });

        (async () => {
            const testAccountSpec = { chainId: 'testnet.localhost', address: 'AmQLSEi7oeW9LztxGa8pXKQDrenzK2JdDrXsJoCAh6PXyzdBtnVJ' };
            await wallet.accountManager.addAccount(testAccountSpec);
            const accounts = await wallet.accountManager.getAccounts();
            assert.equal(accounts[0].data.spec.address, testAccountSpec.address);
            const accountTracker = await wallet.accountManager.trackAccount({ address: testAccountSpec.address });
            accountTracker.once('update', account => {
                assert.deepEqual(account.data.spec, testAccountSpec);
                assert.equal(account.balance.toUnit('aergo').toString(), '20000 aergo');
                assert.isNotNull(account.data.added);
                assert.isTrue(+ new Date(account.data.added) - + new Date() < 1000);
                wallet.accountManager.pause();
                done();
            });
        })();
    });

    it('sends tx (loads key, builds and commits tx, gets status updates)', async () => {
        // Config
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });

        // Set up account and key
        const account = await wallet.accountManager.createAccount();

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            // Build tx
            const tx = {
                from: account.address,
                to: account.address,
                amount: '1 aergo'
            };
            let txTracker;
            try {
                txTracker = await wallet.sendTransaction(account, tx);
            } catch (e) {
                return reject(e);
            }
            txTracker.on('block', resolve);
            txTracker.on('error', reject);
            txTracker.on('timeout', reject);
        });
    });

    it('sends tx (loads key, uses keystore, requires unlock, sends tx)', async () => {
        // Config
        const wallet = new Wallet();
        wallet.useStorage(MemoryStorage);
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });

        assert.isFalse(await wallet.isSetup());

        // Set up account and key
        await wallet.setupAndUnlock('password');

        assert.isTrue(await wallet.isSetup());

        await wallet.lock();
        await assert.isRejected(
            wallet.accountManager.createAccount(),
            Error, 'unlock wallet before adding key'
        );
        await wallet.unlock('password');
        const account = await wallet.accountManager.createAccount();
        await wallet.lock();

        const accounts = await wallet.accountManager.getAccounts();
        assert.equal(accounts[0].data.spec.address, account.data.spec.address);

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            // Build tx
            const tx = {
                from: account.address,
                to: account.address,
                amount: '1 aergo'
            };
            let txTracker;
            try {
                await assert.isRejected(
                    wallet.sendTransaction(account, tx),
                    Error, 'unlock wallet before using key'
                );
                await wallet.unlock('password');
                txTracker = await wallet.sendTransaction(account, tx);
            } catch (e) {
                return reject(e);
            }
            txTracker.on('block', resolve);
            txTracker.on('error', reject);
            txTracker.on('timeout', reject);
        });
    });

    it('uses external signer for tx', async () => {
        // Setup a fake Ledger-like account
        const opts = { hdpath: 'm/44\'/441\'/0\'/0/1' };
        const mnemonic = 'raccoon agent nest round belt cloud first fancy awkward quantum valley scheme';
        const privateKey = await privateKeyFromMnemonic(mnemonic, opts);
        const identity = identityFromPrivateKey(privateKey);
        const wallet = new Wallet();
        wallet.useStorage(MemoryStorage);
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });
        const accountSpec = { address: identity.address };
        const account = await wallet.accountManager.getOrAddAccount(accountSpec, { type: 'ledger', derivationPath: opts.hdpath });
        const tx = {
            from: account.address,
            to: account.address,
            amount: '1 aergo',
        };
        // This should throw because we can't sign a ledger-type account without connecting a device
        await assert.isRejected(wallet.prepareTransaction(account, tx), 'call wallet.connectLedger before signing transaction');
        // But with this workaround, we'll make it work by returning an empty signature
        wallet.keyManager.useExternalLedger = true;
        const prepared = await wallet.prepareTransaction(account, tx);
        assert.equal(prepared.signature, '');
        assert.equal(prepared.hash, '');
        // sendTransaction should throw
        await assert.isRejected(wallet.sendTransaction(account, prepared), 'missing signature');
        // Now let's sign and hash it manually and send it
        prepared.txBody.sign = await signTransaction(prepared.txBody, identity.keyPair);
        prepared.txBody.hash = await hashTransaction(prepared.txBody, 'base58');
        const txTracker = await wallet.sendTransaction(account, prepared);
        const receipt = await txTracker.getReceipt();
        assert.equal(receipt.status, 'SUCCESS');
    });

    it('adds account and keys and removes them again', async () => {
        // Config
        const wallet = new Wallet();
        wallet.useStorage(MemoryStorage);
        wallet.useChain({
            chainId: 'testnet1',
            nodeUrl: '127.0.0.1:7845'
        });
        wallet.useChain({
            chainId: 'testnet2',
            nodeUrl: '127.0.0.1:7845'
        });
        await wallet.setupAndUnlock('password');
        // Add 2 different accounts using same address/key
        const account1 = await wallet.accountManager.createAccount();
        const account2 = await wallet.accountManager.addAccount({
            address: account1.address,
            chainId: 'testnet2'
        });
        assert.equal(account1.data.spec.chainId, 'testnet1');
        assert.equal(account2.data.spec.chainId, 'testnet2');
        // Should have same key
        assert.deepEqual(await wallet.keyManager.getKey(account1), await wallet.keyManager.getKey(account2));
        // Remove one account
        await wallet.accountManager.removeAccount(account1.data.spec);
        // Key2 should still be here
        const key2 = await wallet.keyManager.getKey(account2);
        assert.equal(key2.key, account2.data.spec.address);
        await wallet.accountManager.removeAccount(account2.data.spec);
        return assert.isRejected(
            wallet.keyManager.getKey(account2),
            Error, `missing key for account ${account2.address}`
        );
    });

    it('deploys and calls contract resulting in success', async () => {
        // Config
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });
        
        // Set up account and key
        const account = await wallet.accountManager.addAccount({ address });
        await wallet.keyManager.importKey({
            account: account,
            b58encrypted: encprivkey,
            password: ''
        });

        // Deploy contract
        const contract = Contract.fromCode(contractCode);
        contract.loadAbi(contractAbi);
        const testtx = {
            from: address,
            to: null,
            amount: 0,
            payload: contract.asPayload([10]),
        };
        const txTracker = await wallet.sendTransaction(account, testtx);
        const receipt = await txTracker.getReceipt();
        // eslint-disable-next-line no-console
        console.log('contract deployed at', receipt.contractaddress.toString());
        assert.equal(receipt.status, 'CREATED', `failed with error: ${receipt.result}`);
        contract.setAddress(receipt.contractaddress);

        // Call contract
        // @ts-ignore
        const callTx = contract.returnValue().asTransaction({
            from: address
        });
        const callTxTracker = await wallet.sendTransaction(account, callTx);
        const callTxReceipt = await callTxTracker.getReceipt();
        assert.equal(callTxReceipt.status, 'SUCCESS', `failed with error: ${callTxReceipt.result}`);
        assert.equal(JSON.parse(callTxReceipt.result), 10);
    }).timeout(5000);

    it('deploys and calls contract resulting in failure', async () => {
        // Config
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });
        
        // Set up account and key
        const account = await wallet.accountManager.addAccount({ address });
        await wallet.keyManager.importKey({
            account: account,
            b58encrypted: encprivkey,
            password: ''
        });

        // Deploy contract
        const contract = Contract.fromCode(contractCode);
        contract.loadAbi(contractAbi);
        const testtx = {
            from: address,
            to: null,
            amount: 0,
            payload: contract.asPayload([10]),
        };
        const txTracker = await wallet.sendTransaction(account, testtx);
        const receipt = await txTracker.getReceipt();
        
        console.log('contract deployed at', receipt.contractaddress.toString());
        assert.equal(receipt.status, 'CREATED', `failed with error: ${receipt.result}`);
        contract.setAddress(receipt.contractaddress);
        const contractId = receipt.contractaddress.value.toString('hex');
        
        // Call contract
        // @ts-ignore
        const callTx = contract.alwaysFail().asTransaction({
            from: address
        });
        const callTxTracker = await wallet.sendTransaction(account, callTx);
        const callTxReceipt = await callTxTracker.getReceipt();
        assert.equal(callTxReceipt.status, 'ERROR');
        assert.equal(callTxReceipt.result, `[string "${contractId}"]:0: failed as expected`);
    }).timeout(5000);

    it.skip('get account transactions', async () => {
        // Config
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });

        // Send a tx from another account
        const account2 = await wallet.accountManager.importAccount(ids[1].privateKey);
        const txTracker = await wallet.sendTransaction(account2, { 
            from: address2,
            to: address,
            amount: '123 aer'
        });
        await txTracker.getReceipt();
        //const receipt = 
        //console.log('receipt', receipt);
        
        // Set up readonly account
        const account = await wallet.accountManager.addAccount({ address });
        await assert.isRejected(
            wallet.transactionManager.fetchAccountTransactions(account),
            Error, 'no data source for account transactions. Please configure a data source such as NodeTransactionScanner.'
        );
        wallet.use(NodeTransactionScanner);
        const txs = await wallet.transactionManager.fetchAccountTransactions(account);
        for (const tx of txs) {
            console.log(`${tx.data.from}  [${tx.data.blockno}]  ->  ${tx.data.to}  ${tx.hash}  ${tx.amount}`);
        }
        assert.equal(txs[0].data.from, address2);
    }).timeout(30000);

    it('tracks account transactions', async () => {
        // Config
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });

        let txhash = '';

        // Set up readonly account
        const account = await wallet.accountManager.addAccount({ address });
        // Manually set last sync to save some time
        const { bestHeight } = await wallet.getClient().blockchain();
        account.data.lastSync = {
            blockno: bestHeight,
            timestamp: + new Date()
        };
        wallet.use(NodeTransactionScanner);
        const accountTxTracker = wallet.transactionManager.trackAccount(account);
        const p = new Promise(resolve => {
            accountTxTracker.on('transaction', (tx: SignedTransaction) => {
                console.log(`${tx.data.from}  [${tx.data.blockno}]  ->  ${tx.data.to}  ${tx.hash}  ${tx.amount}`);
                if (tx.hash === txhash) {
                    accountTxTracker.pause();
                    resolve();
                }
            });
        });

        // Send a tx from another account
        const account2 = await wallet.accountManager.addAccount({ address: address2 });
        await wallet.keyManager.importKey({
            account: account2,
            b58encrypted: encprivkey2,
            password: ''
        });
        const txTracker = await wallet.sendTransaction(account2, { 
            from: address2,
            to: address,
            amount: '123 aer'
        });
        txhash = txTracker.transaction.hash;
        await txTracker.getReceipt();
        return p;
    }).timeout(30000);

    it('saves names (send create name tx, send update name tx, loads name info)', async () => {
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });
        const account = await wallet.accountManager.createAccount();
        // Create random name. When you keep running this test on the same test chain, there's a small chance this can produce a conflict
        const nameName = '' + (Math.random() * 99999999999 + 100000000000).toFixed(0);

        // Create name
        const tx = await wallet.nameManager.getCreateNameTransaction(account.data.spec, nameName);
        const txTracker = await wallet.sendTransaction(account, tx);
        await txTracker.getReceipt();
        await wallet.nameManager.addName(account.data.spec, nameName);
        const name = await wallet.nameManager.updateName(account.data.spec, nameName);
        assert.equal(name.data.destination, `${account.address}`);

        // Update name
        const account2 = await wallet.accountManager.createAccount();
        const tx2 = await wallet.nameManager.getUpdateNameTransaction(account.data.spec, nameName, account2.address);
        const txTracker2 = await wallet.sendTransaction(account, tx2);
        await txTracker2.getReceipt();
        const name2 = await wallet.nameManager.updateName(account.data.spec, nameName);
        assert.equal(name2.data.destination, `${account2.address}`);

        // Get list of names of first account (should be empty now)
        const names = await wallet.nameManager.getNames(account.data.spec);
        assert.equal(names.length, 0);

        // Get list of names of second account
        const names2 = await wallet.nameManager.getNames(account2.data.spec);
        assert.equal(names2[0].data.spec.name, nameName);
        assert.equal(names2[0].data.owner, name2.data.owner);
    }).timeout(10000);
});