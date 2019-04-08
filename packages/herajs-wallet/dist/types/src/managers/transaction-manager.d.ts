import { Transaction, SignedTransaction } from '../models/transaction';
import { Account, AccountSpec, CompleteAccountSpec } from '../models/account';
import { Wallet } from '../wallet';
import { PausableTypedEventEmitter, HashMap } from '../utils';
import { Address } from '@herajs/client';
export interface Events {
    'add': Transaction;
    'update': Transaction;
    'error': Error;
}
export interface TrackerEvents {
    'block': Transaction;
    'receipt': GetReceiptResult;
    'error': Error;
    'timeout': Error;
}
export interface AccountTrackerEvents {
    'transaction': SignedTransaction;
    'transactions': SignedTransaction[];
}
interface GetReceiptResult {
    contractaddress: Address;
    result: string;
    status: string;
}
export declare class TransactionTracker extends PausableTypedEventEmitter<TrackerEvents> {
    transaction: SignedTransaction;
    private manager;
    private timeoutId?;
    private retryCount;
    private maxRetryCount;
    private started;
    constructor(manager: TransactionManager, transaction: SignedTransaction);
    private retryLoad;
    /**
     * Attempt to retrieve transaction data from node.
     * Emits events according to changed status.
     */
    load(): Promise<void>;
    getReceipt(): Promise<GetReceiptResult>;
    cancel(): void;
    readonly hash: string;
}
declare class AccountTransactionTracker extends PausableTypedEventEmitter<AccountTrackerEvents> {
    private manager;
    private intervalId?;
    private account;
    constructor(manager: TransactionManager, account: Account);
    load(): Promise<Account>;
    resume(): void;
    pause(): void;
}
/**
 * TransactionManager manages and tracks single transactions
 */
export declare class TransactionManager extends PausableTypedEventEmitter<Events> {
    wallet: Wallet;
    accountTxTrackers: HashMap<CompleteAccountSpec, AccountTransactionTracker>;
    constructor(wallet: Wallet);
    addTransaction(transaction: SignedTransaction): Promise<void>;
    trackTransaction(transaction: SignedTransaction): Promise<TransactionTracker>;
    resume(): void;
    pause(): void;
    /**
     * Track transactions for account.
     * There is no default implementation for this. The only generally available
     * method would be to scan the entire blockchain which is highly inefficient.
     * If you want that, use your own full node and add the data source using
     * wallet.use(NodeTransactionScanner);
     * @param account
     */
    trackAccount(account: Account): AccountTransactionTracker;
    fetchAccountTransactions(account: Account): Promise<SignedTransaction[]>;
    fetchAccountTransactionsAfter(account: Account, blockno: number, limit?: number): Promise<SignedTransaction[]>;
    fetchAccountTransactionsBefore(account: Account, blockno: number, limit?: number): Promise<SignedTransaction[]>;
    /**
     * Returns transactions stored for an account
     * @param account
     */
    getAccountTransactions(accountOrSpec: AccountSpec | Account): Promise<Transaction[]>;
    sendTransaction(transaction: SignedTransaction): Promise<TransactionTracker>;
}
export {};
