import { MiddlewareMethod } from '../middleware';
import { Account } from '../models/account';
import { SignedTransaction } from '../models/transaction';
import { Wallet } from '../wallet';

export interface GetAccountTxParams {
    account: Account;
    blockno: number;
    limit?: number;
}

export interface AccountTransactionsDatasource {
    getAccountTransactions: MiddlewareMethod<Account, Promise<SignedTransaction[]>, Wallet>;
    getAccountTransactionsBefore: MiddlewareMethod<GetAccountTxParams, Promise<SignedTransaction[]>, Wallet>;
    getAccountTransactionsAfter: MiddlewareMethod<GetAccountTxParams, Promise<SignedTransaction[]>, Wallet>;
}