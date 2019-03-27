/*

Manager -> Trackers -> Events
Manager -> Events

*/

import { Transaction, SignedTransaction } from '../models/transaction';
import { Account, AccountSpec, CompleteAccountSpec } from '../models/account';
import { Wallet } from '../wallet';
import { PausableTypedEventEmitter, backoffIntervalStep, HashMap } from '../utils';
import { Address } from '@herajs/client';
import { ACCOUNT_UPDATE_INTERVAL } from '../defaults';
import { GetAccountTxParams } from '../datasources/types';

export interface Events {
    'add': Transaction;
    'update': Transaction;
    'error': Transaction;
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

// TODO: remove
interface GetTxResult {
    block?: {
        hash: string;
        idx: number;
    };
    tx: any;
}
interface GetReceiptResult {
    contractaddress: Address;
    result: string;
    status: string;
}



export class TransactionTracker extends PausableTypedEventEmitter<TrackerEvents> {
    transaction: SignedTransaction;
    private manager: TransactionManager;
    private timeoutId?: NodeJS.Timeout;
    private retryCount: number = 0;
    private maxRetryCount: number = 10;
    private started: Date;

    constructor(manager: TransactionManager, transaction: SignedTransaction) {
        super();
        this.manager = manager;
        this.transaction = transaction;
        this.started = new Date();
        this.retryLoad();
    }

    private retryLoad(): void {
        if (this.retryCount >= this.maxRetryCount) {
            this.transaction.data.status = Transaction.Status.Timeout;
            const elapsed = Math.round((+new Date() - (+this.started))/1000);
            this.emit('timeout', new Error(`timeout after ${elapsed}s`));
            return;
        }
        const interval = backoffIntervalStep(this.retryCount++);
        this.timeoutId = setTimeout(() => {
            this.load();
        }, interval);
    }

    /**
     * Attempt to retrieve transaction data from node.
     * Emits events according to changed status.
     */
    async load(): Promise<void> {
        console.log('[transactionManager] load', this.transaction.data.chainId, this.transaction.data.hash);
        const client = this.manager.wallet.getClient(this.transaction.data.chainId);
        const result = await client.getTransaction(this.transaction.data.hash) as GetTxResult;
        if (typeof result.block !== 'undefined') {
            this.transaction.data.status = Transaction.Status.Confirmed;
            this.transaction.data.blockhash = result.block.hash;
            this.manager.addTransaction(this.transaction);
            this.emit('block', this.transaction);
            if (this.listeners('receipt').length) {
                client.getTransactionReceipt(this.transaction.data.hash).then((receipt: GetReceiptResult) => {
                    this.emit('receipt', receipt);
                });
            }
            this.cancel();
            return;
        }
        
        this.retryLoad();
    }

    async getReceipt(): Promise<GetReceiptResult> {
        return new Promise((resolve, reject) => {
            this.once('receipt', resolve);
            this.once('error', reject);
            this.once('timeout', reject);
        });
    }

    cancel(): void {
        if (typeof this.timeoutId === 'undefined') return;
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
    }

    get hash(): string {
        return this.transaction.hash;
    }
}


class AccountTransactionTracker extends PausableTypedEventEmitter<AccountTrackerEvents> {
    private manager: TransactionManager;
    private intervalId?: NodeJS.Timeout;
    private account: Account;

    constructor(manager: TransactionManager, account: Account) {
        super();
        this.manager = manager;
        this.account = account;
    }

    async load(): Promise<Account> {
        const client = this.manager.wallet.getClient(this.account.data.spec.chainId);
        const lastSyncBlockno = this.account.data.lastSync ? this.account.data.lastSync.blockno + 1 : 0;
        const { bestHeight } = await client.blockchain();
        if (lastSyncBlockno >= bestHeight) return this.account;
        // console.log(`[track] sync from block ${lastSyncBlockno} .. ${bestHeight}`);
        const transactions = await this.manager.fetchAccountTransactionsAfter(this.account, lastSyncBlockno, bestHeight);
        for (const tx of transactions) {
            this.emit('transaction', tx);
            this.manager.addTransaction(tx);
        }
        if (transactions.length) {
            this.emit('transactions', transactions);
        }
        this.account.data.lastSync = {
            blockno: bestHeight,
            timestamp: +new Date()
        };
        return this.account;
    }

    resume(): void {
        this.load();
        this.intervalId = setInterval(() => {
            this.load();
        }, ACCOUNT_UPDATE_INTERVAL);
    }

    pause(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}


/**
 * TransactionManager manages and tracks single transactions
 */
export class TransactionManager extends PausableTypedEventEmitter<Events> {
    wallet: Wallet;
    accountTxTrackers: HashMap<CompleteAccountSpec, AccountTransactionTracker> = new HashMap();

    constructor(wallet: Wallet) {
        super();
        this.wallet = wallet;
    }

    async addTransaction(transaction: SignedTransaction): Promise<void> {
        if (this.wallet.datastore) {
            await this.wallet.datastore.getIndex('transactions').put(transaction);
        }
    }

    async trackTransaction(transaction: SignedTransaction): Promise<TransactionTracker> {
        return new TransactionTracker(this, transaction);
    }

    resume(): void {
        if (!this.paused) return;
        this.paused = false;
        for (const tracker of this.accountTxTrackers.values()) {
            tracker.resume();
        }
    }

    pause(): void {
        if (this.paused) return;
        this.paused = true;
        for (const tracker of this.accountTxTrackers.values()) {
            tracker.pause();
        }
    }


    /**
     * Track transactions for account.
     * There is no default implementation for this. The only generally available
     * method would be to scan the entire blockchain which is highly inefficient.
     * If you want that, use your own full node and add the data source using
     * wallet.use(NodeTransactionScanner);
     * @param account 
     */
    trackAccount(account: Account): AccountTransactionTracker {
        this.resume();
        if (this.accountTxTrackers.has(account.data.spec)) {
            return this.accountTxTrackers.get(account.data.spec) as AccountTransactionTracker;
        }
        const tracker = new AccountTransactionTracker(this, account);
        tracker.resume();
        this.accountTxTrackers.set(account.data.spec, tracker);
        return tracker;
    }

    async fetchAccountTransactions(account: Account): Promise<SignedTransaction[]> {
        return await this.wallet.applyMiddlewares<Account, Promise<SignedTransaction[]>>('fetchAccountTransactions')(
            () => {
                throw new Error('no data source for account transactions. Please configure a data source such as NodeTransactionScanner.');
            }
        )(account);
    }

    async fetchAccountTransactionsAfter(account: Account, blockno: number, limit?: number): Promise<SignedTransaction[]> {
        return await this.wallet.applyMiddlewares<GetAccountTxParams, Promise<SignedTransaction[]>>('fetchAccountTransactionsAfter')(
            () => {
                throw new Error('no data source for account transactions. Please configure a data source such as NodeTransactionScanner.');
            }
        )({ account, blockno, limit });
    }

    async fetchAccountTransactionsBefore(account: Account, blockno: number, limit?: number): Promise<SignedTransaction[]> {
        return await this.wallet.applyMiddlewares<GetAccountTxParams, Promise<SignedTransaction[]>>('fetchAccountTransactionsBefore')(
            () => {
                throw new Error('no data source for account transactions. Please configure a data source such as NodeTransactionScanner.');
            }
        )({ account, blockno, limit });
    }

    

    /**
     * Returns transactions stored for an account
     * @param account 
     */
    async getAccountTransactions(accountOrSpec: AccountSpec | Account): Promise<Transaction[]> {
        if (!this.wallet.datastore) throw new Error('configure storage before accessing transactions');
        let account: Account;
        if (!(accountOrSpec as Account).data) {
            account = await this.wallet.accountManager.getOrAddAccount(accountOrSpec as AccountSpec);
        } else {
            account = accountOrSpec as Account;
        }
        console.log('txManager.getAccountTransactions', account);
        const index = this.wallet.datastore.getIndex('transactions');
        const txsFrom = Array.from(await index.getAll(account.address.toString(), 'from')) as Transaction[];
        const txsTo = Array.from(await index.getAll(account.address.toString(), 'to')) as Transaction[];
        // unique txs by hash
        const hashSet = new Set() as Set<string>;
        const allTxs = txsFrom.concat(txsTo);
        const txs = allTxs.filter((o: Transaction): boolean => {
            return hashSet.has(o.data.hash as string) ? false : !!hashSet.add(o.data.hash as string);
        });
        return txs;
    }

    async sendTransaction(transaction: SignedTransaction): Promise<TransactionTracker> { // implicit send, add, and track
        const client = this.wallet.getClient(transaction.data.chainId);
        const txhash = await client.sendSignedTransaction(transaction.txBody) as string;
        transaction.key = txhash;
        transaction.data.hash = txhash;
        this.addTransaction(transaction);
        return this.trackTransaction(transaction);
    }
}