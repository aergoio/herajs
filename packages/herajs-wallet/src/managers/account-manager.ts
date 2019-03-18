import { Wallet } from '../wallet';
import { Account, AccountSpec, CompleteAccountSpec } from '../models/account';
import { Transaction, TxBody } from '../models/transaction';
import { serializeAccountSpec, HashMap } from '../utils';
import { Amount } from '@herajs/client';
import { ACCOUNT_UPDATE_INTERVAL } from '../defaults';
import { PausableTypedEventEmitter } from '../utils';

export interface Events {
    'add': Account;
    'update': Account;
    'change': Account[];
}

export interface TrackerEvents {
    'update': Account;
}

class AccountTracker extends PausableTypedEventEmitter<TrackerEvents> {
    private manager: AccountManager;
    private intervalId?: NodeJS.Timeout;
    private account: Account;

    constructor(manager: AccountManager, account: Account) {
        super();
        this.manager = manager;
        this.account = account;
    }

    async load(): Promise<Account> {
        const client = this.manager.wallet.getClient(this.account.data.spec.chainId);
        const state = await client.getState(this.account.data.spec.address);
        this.account.data.balance = state.balance.toString();
        this.account.data.nonce = state.nonce;
        this.emit('update', this.account);
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
 * AccountManager manages and tracks single accounts
 */
export default class AccountManager extends PausableTypedEventEmitter<Events> {
    wallet: Wallet;
    accounts: HashMap<CompleteAccountSpec, Promise<Account>> = new HashMap();
    trackers: HashMap<CompleteAccountSpec, AccountTracker> = new HashMap();

    constructor(wallet: Wallet) {
        super();
        this.wallet = wallet;
    }

    resume(): void {
        if (!this.paused) return;
        this.paused = false;
        for (const tracker of this.trackers.values()) {
            tracker.resume();
        }
    }

    pause(): void {
        if (this.paused) return;
        this.paused = true;
        for (const tracker of this.trackers.values()) {
            tracker.pause();
        }
    }

    getCompleteAccountSpec(accountSpec: AccountSpec): CompleteAccountSpec {
        const chainId = typeof accountSpec.chainId !== 'undefined' ? accountSpec.chainId : this.wallet.defaultChainId;
        return {
            address: accountSpec.address,
            chainId
        };
    }

    addAccount(accountSpec: AccountSpec): Promise<Account> {
        const completeAccountSpec = this.getCompleteAccountSpec(accountSpec);
        if (this.accounts.has(completeAccountSpec)) {
            throw new Error('Account has already been added.');
        }
        // console.log('addAccount', completeAccountSpec);
        const account = this.loadAccount(completeAccountSpec);
        this.accounts.set(completeAccountSpec, account);
        return account;
    }

    async getOrAddAccount(accountSpec: CompleteAccountSpec | AccountSpec): Promise<Account> {
        const completeAccountSpec = accountSpec.chainId && accountSpec.address ? accountSpec as CompleteAccountSpec : this.getCompleteAccountSpec(accountSpec);
        let account: Account;
        if (!this.accounts.has(completeAccountSpec)) {
            account = await this.addAccount(completeAccountSpec);
        } else {
            account = await this.accounts.get(completeAccountSpec) as Account;
        }
        return account;
    }

    async trackAccount(accountSpec: AccountSpec): Promise<AccountTracker> {
        this.resume();
        const completeAccountSpec = this.getCompleteAccountSpec(accountSpec);
        const account = await this.getOrAddAccount(completeAccountSpec);
        
        if (this.trackers.has(completeAccountSpec)) {
            return this.trackers.get(completeAccountSpec) as AccountTracker;
        }
        const tracker = new AccountTracker(this, account);
        tracker.resume();
        this.trackers.set(completeAccountSpec, tracker);
        return tracker;
    }

    async loadAccount(accountSpec: CompleteAccountSpec): Promise<Account> {
        //return await this.wallet.datastore.index('account').get(serializeAccountSpec(accountSpec));
        return new Account(serializeAccountSpec(accountSpec),
            {
                spec: {
                    chainId: accountSpec.chainId,
                    address: accountSpec.address.toString()
                },
                privateKey: [],
                publicKey: [],
                balance: '',
                nonce: 0,
                name: '',
                lastSync: null
            }
        );
    }

    async getNonceForAccount(account: Account): Promise<number> {
        // TODO: smart caching
        const client = this.wallet.getClient(account.data.spec.chainId);
        return 1 + await client.getNonce(account.data.spec.address);
    }

    /**
     * Calculates nonce and converts transaction body into tx ready for signing
     * @param account 
     * @param tx 
     */
    async prepareTransaction(account: Account, tx: Partial<TxBody>): Promise<Transaction> {
        if (!tx.from) throw new Error('missing required transaction parameter `from` (address or name)');
        if (typeof tx.to === 'undefined') throw new Error('missing required transaction parameter `to` (address, name, or explicit null)');
        if (typeof tx.amount === 'undefined') throw new Error('missing required transaction parameter amount');
        tx.amount = new Amount(tx.amount).toUnit('aer').toString();
        if (typeof tx.payload === 'string') {
            tx.payload = Uint8Array.from(Buffer.from(tx.payload));
        } else {
            tx.payload = Uint8Array.from(tx.payload || []);
        }
        if (typeof tx.nonce === 'undefined') {
            tx.nonce = await this.getNonceForAccount(account);
        }
        return new Transaction('', {
            chainId: account.data.spec.chainId,
            from: tx.from.toString(),
            to: tx.to ? tx.to.toString() : '',
            hash: '',
            ts: '',
            blockhash: null,
            blockno: null,
            amount: new Amount(tx.amount).toString(),
            type: 0,
            status: Transaction.Status.Pending
        }, tx as TxBody);
    }
}
