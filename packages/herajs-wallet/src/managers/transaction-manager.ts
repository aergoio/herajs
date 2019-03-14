/*

Manager -> Trackers -> Events
Manager -> Events

*/

import { Transaction, SignedTransaction, TxBody } from '../models/transaction';
import { Account, CompleteAccountSpec } from '../models/account';
import { Wallet } from '../wallet';
import { PausableTypedEventEmitter, backoffIntervalStep } from '../utils';
import { Address } from '@herajs/client';

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

    private retryLoad() {
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
        const client = this.manager.wallet.getClient(this.transaction.data.chainId);
        const result = await client.getTransaction(this.transaction.data.hash) as GetTxResult;
        if (typeof result.block !== 'undefined') {
            this.transaction.data.status = Transaction.Status.Confirmed;
            this.transaction.data.blockhash = result.block.hash;
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
}

/**
 * TransactionManager manages and tracks single transactions
 */
export class TransactionManager extends PausableTypedEventEmitter<Events> {
    wallet: Wallet;

    constructor(wallet: Wallet) {
        super();
        this.wallet = wallet;
    }

    addTransaction() {

    }

    trackTransaction() {

    }

    /**
     * Track transactions for account.
     * There is no default implementation for this. The only generally available
     * method would be to scan the entire blockchain which is highly inefficient.
     * If you want that, use your own full node and add the data source using
     * wallet.use(NodeTransactionScanner);
     * @param account 
     */
    trackAccount(account: Account) {
        console.log(account);
    }

    async getAccountTransactions(account: Account): Promise<TxBody[]> {
        const accountSpec = this.wallet.accountManager.getCompleteAccountSpec(account.data.spec);
        return await this.wallet.applyMiddlewares<CompleteAccountSpec, Promise<TxBody[]>>('getAccountTransactions')(
            () => {
                throw new Error('no data source for account transactions. Please configure a data source such as NodeTransactionScanner.');
            }
        )(accountSpec);
    }

    async sendTransaction(transaction: SignedTransaction): Promise<TransactionTracker> { // implicit send, add, and track
        const client = this.wallet.getClient(transaction.data.chainId);
        const txhash = await client.sendSignedTransaction(transaction.txBody) as string;
        transaction.key = txhash;
        transaction.data.hash = txhash;
        // TODO add() and track()
        return new TransactionTracker(this, transaction);
    }
}