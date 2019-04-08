import { Middleware, MiddlewareFunc } from '../middleware';
import { Account } from '../models/account';
import { SignedTransaction } from '../models/transaction';
import { Wallet } from '../wallet';
import { AccountTransactionsDatasource, GetAccountTxParams } from './types';
/**
 * This is a data source for transactionManager.getAccountTransactions.
 * It is a very inefficient way, but the only one generally available.
 * Please only use with local fullnodes as this can consume considerable bandwidth.
 * What it does is go backwards in time to scan the whole blockchain until it finds the
 * all transactions of an account. This uses the account's nonce to be smart about that:
 * When we reached nonce 1 and balance 0, we assume to have all txs.
 */
export declare class NodeTransactionScanner extends Middleware<Wallet> implements AccountTransactionsDatasource {
    fetchAccountTransactionsBefore(wallet: Wallet): MiddlewareFunc<GetAccountTxParams, Promise<SignedTransaction[]>>;
    fetchAccountTransactionsAfter(wallet: Wallet): MiddlewareFunc<GetAccountTxParams, Promise<any[]>>;
    fetchAccountTransactions(wallet: Wallet): MiddlewareFunc<Account, Promise<any[]>>;
}
