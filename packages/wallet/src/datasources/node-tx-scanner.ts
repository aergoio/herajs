import { Middleware, MiddlewareFunc } from '../middleware';
import { Account } from '../models/account';
import { SignedTransaction } from '../models/transaction';
import { Wallet } from '../wallet';
import { Address, Tx } from '@herajs/client';
import { AccountTransactionsDatasource, GetAccountTxParams } from './types';


/**
 * This is a data source for transactionManager.getAccountTransactions.
 * It is a very inefficient way, but the only one generally available.
 * Please only use with local fullnodes as this can consume considerable bandwidth.
 * What it does is go backwards in time to scan the whole blockchain until it finds the
 * all transactions of an account. This uses the account's nonce to be smart about that:
 * When we reached nonce 1 and balance 0, we assume to have all txs.
 */
export class NodeTransactionScanner extends Middleware<Wallet> implements AccountTransactionsDatasource {
    fetchAccountTransactionsBefore(wallet: Wallet): MiddlewareFunc<GetAccountTxParams, Promise<SignedTransaction[]>> {
        return () => async ({ account, blockno, limit }: GetAccountTxParams) => {
            const accountSpec = wallet.accountManager.getCompleteAccountSpec(account.data.spec);
            const client = wallet.getClient(accountSpec.chainId);
            const address = new Address(accountSpec.address);
            let { nonce, balance } = await client.getState(address);
            // Check for unused account
            // Note: on dev chain, balance can be non-0, so this check always fails
            if (nonce === 0 && balance.compare(0) === 0) {
                return []; 
            }
            if (!limit) {
                limit = 0;
            }
            let blockNumber = blockno;
            const results = [];
            // Traverse back blockchain until reaching block 0 or nonce 0 and balance 0
            // Note: on dev chain, final balance can be less than 0
            while (blockNumber > limit && (nonce > 1 || balance.compare(0) > 0)) {
                const block = await client.getBlock(blockNumber--);
                if (!block.body || !block.body.txsList.length) continue;
                //console.log(`[scan] block ${blockNumber}`);
                const ownTxs = block.body.txsList.filter(
                    (tx: Tx) => address.equal(tx.from) || address.equal(tx.to)
                );
                for (const tx of ownTxs) {
                    const txObj = SignedTransaction.fromTxBody(tx, accountSpec.chainId);
                    txObj.data.blockhash = block.hash;
                    txObj.data.blockno = block.header ? block.header.blockno : null;
                    results.push(txObj);
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

    fetchAccountTransactionsAfter(wallet: Wallet): MiddlewareFunc<GetAccountTxParams, Promise<any[]>> {
        return () => async ({ account, blockno, limit }: GetAccountTxParams) => {
            const accountSpec = wallet.accountManager.getCompleteAccountSpec(account.data.spec);
            const client = wallet.getClient(accountSpec.chainId);
            if (!limit) {
                const { bestHeight } = await client.blockchain();
                limit = bestHeight;
            }
            const maxBlockNo = limit;
            const address = new Address(accountSpec.address);
            const { nonce, balance } = await client.getState(address);
            // Check for unused account
            // Note: on dev chain, balance can be non-0, so this check always fails
            if (nonce === 0 && balance.compare(0) === 0) {
                return []; 
            }
            let blockNumber = blockno;
            const results = [];
            // Traverse forward blockchain until reaching current block
            while (blockNumber <= maxBlockNo) {
                const block = await client.getBlock(blockNumber++);
                if (!block.body || !block.body.txsList.length) continue;
                //console.log(`[scan] block ${blockNumber}`);
                const ownTxs = block.body.txsList.filter(
                    (tx: Tx) => address.equal(tx.from) || address.equal(tx.to)
                );
                for (const tx of ownTxs) {
                    const txObj = SignedTransaction.fromTxBody(tx, accountSpec.chainId);
                    txObj.data.blockhash = block.hash;
                    txObj.data.blockno = block.header ? block.header.blockno : null;
                    results.push(txObj);
                }
            }
            return results;
        };
    }

    fetchAccountTransactions(wallet: Wallet): MiddlewareFunc<Account, Promise<any[]>> {
        return () => async (account: Account) => {
            const accountSpec = wallet.accountManager.getCompleteAccountSpec(account.data.spec);
            const { bestHeight } = await wallet.getClient(accountSpec.chainId).blockchain();
            return this.fetchAccountTransactionsBefore(wallet)(async () => [])({ account, blockno: bestHeight });
        };
    }
}