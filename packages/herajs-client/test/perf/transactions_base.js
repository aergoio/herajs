
/*
Run this with
./node_modules/.bin/babel-node test/perf/transactions_node.js
*/
/* eslint no-console: 0 */
import { performance, PerformanceObserver } from 'perf_hooks';

const numberOfTx = 1000;

const waitForTx = true; // wait for tx to complete after sending

const obs = new PerformanceObserver((items) => {
    const entry = items.getEntries()[0];
    const tps = Math.round(numberOfTx / entry.duration * 1000);
    console.log(`${entry.name}: ${entry.duration}ms (${tps} tps)`);
});
obs.observe({ entryTypes: ['measure'] });

export async function main(aergo) {
    function pollTxStatus(hash) {
        return aergo.getTransaction(hash).then((result) => {
            if ('block' in result) {
                return result.block.getBlockhash_asB64();
            } else {
                return pollTxStatus(hash);
            }
        });
    }

    const createdAddress = await aergo.accounts.create('testpass');
    const address = await aergo.accounts.unlock(createdAddress, 'testpass');

    // Create transactions
    const transactions = Array.from({length: numberOfTx}).map((u, i) => ({
        nonce: i + 1,
        from: address,
        to: address,
        amount: i + 1,
        payload: null
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
        aergo.sendSignedTransaction(signedtx).then((txid) => {
            signedtx.id = txid;
        })
    )));

    performance.mark('C');

    if (waitForTx) {
        let errorred = 0;

        // Wait for transactions to be included in blocks
        await Promise.all(signedTransactions.map(tx => (
            pollTxStatus(tx.id).then(blockhash => {
                tx.blockhash = blockhash;
                console.log(tx.nonce, tx.id, tx.blockhash);
            }).catch(e => {
                console.log(tx.nonce, tx.id, 'not found');
                errorred += 1;
            })
        )));
        console.log(`(${errorred} tx not found)`);
    } else {
        // Just print tx ids without waiting for confirmation
        for (const tx of signedTransactions) {
            console.log(tx.nonce, tx.id);
        }
    }

    performance.mark('D');

    performance.measure('Transaction sign', 'A', 'B');
    performance.measure('Transaction commit', 'B', 'C');
    if (waitForTx) performance.measure('Transaction confirm', 'C', 'D');
    console.log(`${numberOfTx} tx`);
}

