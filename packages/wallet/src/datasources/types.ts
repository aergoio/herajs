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
    fetchAccountTransactions: MiddlewareMethod<Account, Promise<SignedTransaction[]>, Wallet>;
    fetchAccountTransactionsBefore: MiddlewareMethod<GetAccountTxParams, Promise<SignedTransaction[]>, Wallet>;
    fetchAccountTransactionsAfter: MiddlewareMethod<GetAccountTxParams, Promise<SignedTransaction[]>, Wallet>;
}