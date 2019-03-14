import { Middleware, MiddlewareMethod, MiddlewareFunc } from '../middleware';
import { CompleteAccountSpec } from '../models/account';
import { Wallet } from '../wallet';
import { Address } from '@herajs/client';

interface NodeTransactionScannerMiddleware {
    getAccountTransactions: MiddlewareMethod<CompleteAccountSpec, Promise<any[]>, Wallet>;
}

/**
 * This is a data source for transactionManager.getAccountTransactions.
 * It is a very inefficient way, but the only one generallt available.
 * Please only use with local fullnodes as this can consume considerable bandwidth.
 * What it does is go backwards in time to scan the whole blockchain until it finds the
 * first transaction of an account. This uses the account's nonce to be smart about that:
 * When we reached nonce 1 and balance 0, we assume to have all txs.
 */
export class NodeTransactionScanner extends Middleware<Wallet> implements NodeTransactionScannerMiddleware {
    getAccountTransactions(wallet: Wallet): MiddlewareFunc<CompleteAccountSpec, Promise<any[]>> {
        return () => async (accountSpec: CompleteAccountSpec) => {
            const client = wallet.getClient(accountSpec.chainId);
            const address = new Address(accountSpec.address);
            let { nonce, balance } = await client.getState(address);
            // Check for unused account
            // Note: on dev chain, balance can be non-0, so this check always fails
            if (nonce === 0 && balance.compare(0) === 0) {
                return []; 
            }
            const { bestHeight } = await wallet.getClient(accountSpec.chainId).blockchain();
            let blockNumber = bestHeight;
            const results = [];
            // Traverse back blockchain until reaching block 0 or nonce 0 and balance 0
            // Note: on dev chain, final balance can be less than 0
            while (blockNumber > 0 && (nonce > 1 || balance.compare(0) > 0)) {
                const block = await client.getBlock(blockNumber--);
                if (!block.body || !block.body.txsList.length) continue;
                //console.log(`[scan] block ${blockNumber}`);
                const ownTxs = block.body.txsList.filter(
                    tx => address.equal(tx.from) || address.equal(tx.to)
                );
                for (const tx of ownTxs) {
                    results.push(tx);
                    if (address.equal(tx.from)) {
                        balance = balance.add(tx.amount);
                        nonce = tx.nonce;
                    } else {
                        balance = balance.sub(tx.amount);
                    }
                }
                //if (ownTxs.length) console.log(`[scan] new state ${nonce}, ${balance}`);
            }
            return results;
        };
    }
}