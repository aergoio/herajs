/*
Run this with
./node_modules/.bin/babel-node test/perf/transactions.js
*/

import Aergo from '../../src';
import {toHexString} from '../../src/utils';
import { performance, PerformanceObserver } from 'perf_hooks';

const obs = new PerformanceObserver((items) => {
    const entry = items.getEntries()[0];
    console.log(`${entry.name}: ${entry.duration}ms`);
});
obs.observe({ entryTypes: ['measure'] });

const aergo = new Aergo();

async function main() {
    const createdAddress = await aergo.accounts.create('testpass');
    const address = await aergo.accounts.unlock(createdAddress, 'testpass');

    const numberOfTx = 500;

    // Create transactions
    const transactions = Array.from({length: numberOfTx}).map((u, i) => ({
        nonce: i + 1,
        from: address,
        to: address,
        amount: i + 1,
        payload: null,
    }));

    performance.mark('A');

    // Sign transactions
    const signedTransactions = [];
    await Promise.all(transactions.map(tx => (
        aergo.accounts.signTransaction(tx).then((signedtx) => {
            signedTransactions.push(signedtx);
        })
    )));

    performance.mark('B');

    // Commit transactions
    await Promise.all(signedTransactions.map(signedtx => (
        aergo.sendTransaction(signedtx).then((txid) => {
            signedtx.id = toHexString(txid);
        })
    )));

    performance.mark('C');
    
    // Print tx ids
    for (let tx of signedTransactions) {
        console.log(tx.nonce, tx.id);
    }

    performance.measure('Transaction sign', 'A', 'B');
    performance.measure('Transaction commit', 'B', 'C');
    console.log(`${numberOfTx} tx`);
}

main();