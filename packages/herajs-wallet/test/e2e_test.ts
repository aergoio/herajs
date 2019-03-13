import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import 'regenerator-runtime/runtime';

import { Wallet } from '../src/wallet';
import { Contract } from '@herajs/client';
//import MemoryStorage from '../src/storages/memory';

import fs from 'fs';
import { resolve } from 'path';
const contractCode = fs.readFileSync(resolve(__dirname, 'fixtures/contract.txt')).toString().trim();
import contractAbi from './fixtures/contract.abi.json';

const address = 'AmPEBfW7rRrLXV497236nAbv4zUs7wWF5uBqEPMA9sVF98Yc2NyH';
const encprivkey = 'MPFZ86x9ZBQG1pHM7Ws5qdvqruXcDsHTuHYKjK28BNgzqGg59qdyJ1nq8TkbmzcP9jUHz43aDMbMZJ';

describe('Wallet scenarios', () => {
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
            accountTracker.on('update', account => {
                assert.deepEqual(account.data.spec, testAccountSpec);
                assert.equal(account.balance.toUnit('aergo').toString(), '10 aergo');
                console.log(account.balance.toUnit('aergo').toString(), account.nonce);
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
        //wallet.use(MemoryStorage);

        // Set up account and key
        const account = await wallet.accountManager.addAccount({ address });
        await wallet.keyManager.importKey({
            account: account,
            b58encrypted: encprivkey,
            password: ''
        });

        return new Promise(async (resolve, reject) => {
            // Build tx
            const tx = {
                from: address,
                to: address,
                amount: '1 aergo'
            };
            const txTracker = await wallet.sendTransaction(account, tx);
            console.log(txTracker.transaction.hash);
            txTracker.on('block', (transaction) => {
                console.log('confirmed in block', transaction.data.blockhash, transaction);
                resolve();
            });
            txTracker.on('error', (error) => {
                console.log('sendTx had an execution error', error);
                reject(error);
            });
            txTracker.on('timeout', (error) => {
                console.log('sendTx timed out', error);
                reject(error);
            });
        });
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

        // Call contract
        // @ts-ignore
        const callTx = contract.alwaysFail().asTransaction({
            from: address
        });
        const callTxTracker = await wallet.sendTransaction(account, callTx);
        const callTxReceipt = await callTxTracker.getReceipt();
        assert.equal(callTxReceipt.status, '[string "lua contract"]:0: failed as expected');
    }).timeout(5000);
});