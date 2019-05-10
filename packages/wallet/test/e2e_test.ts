import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import 'regenerator-runtime/runtime';

import { Wallet } from '../src/wallet';
import { Contract } from '@herajs/client';
import { createIdentity, encryptPrivateKey, encodePrivateKey } from '@herajs/crypto';
import { NodeTransactionScanner } from '../src/datasources/node-tx-scanner';
//import MemoryStorage from '../src/storages/memory';

import fs from 'fs';
import { resolve } from 'path';
const contractCode = fs.readFileSync(resolve(__dirname, 'fixtures/contract.txt')).toString().trim();
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
            wallet.accountManager.addAccount(testAccountSpec);
            const accountTracker = await wallet.accountManager.trackAccount(testAccountSpec);
            accountTracker.once('update', account => {
                assert.deepEqual(account.data.spec, testAccountSpec);
                assert.equal(account.balance.toUnit('aergo').toString(), '20000 aergo');
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

        // Set up account and key
        await wallet.setupAndUnlock('password');

        await wallet.lock();
        await assert.isRejected(
            wallet.accountManager.createAccount(),
            Error, 'unlock wallet before adding key'
        );
        await wallet.unlock('password');
        const account = await wallet.accountManager.createAccount();
        await wallet.lock();

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
        console.log('contract deployed at', receipt.contractaddress.toString());
        assert.equal(receipt.status, 'CREATED');
        contract.setAddress(receipt.contractaddress);

        // Call contract
        // @ts-ignore
        const callTx = contract.returnValue().asTransaction({
            from: address
        });
        const callTxTracker = await wallet.sendTransaction(account, callTx);
        const callTxReceipt = await callTxTracker.getReceipt();
        assert.equal(callTxReceipt.status, 'SUCCESS');
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
        assert.equal(receipt.status, 'CREATED');
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

    it('get account transactions', async () => {
        // Config
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
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
        console.log(`Waiting for tx hash ${txhash} to be confirmed and tracked...`);
        await txTracker.getReceipt();
        return p;
    }).timeout(30000);
});