import { Wallet } from '../wallet';
import { Account, AccountSpec, AccountData, CompleteAccountSpec } from '../models/account';
import { Transaction, TxBody } from '../models/transaction';
import { serializeAccountSpec, HashMap } from '../utils';
import { Amount, Address } from '@herajs/client';
import { ACCOUNT_UPDATE_INTERVAL } from '../defaults';
import { PausableTypedEventEmitter } from '../utils';
import { createIdentity } from '@herajs/crypto';

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
        this.manager.wallet.datastore && this.manager.wallet.datastore.getIndex('accounts').put(this.account);
        return this.account;
    }

    resume(): void {
        this.load();
        this.pause();
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
    private loadedFromStore: boolean = false;

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
        const accountPromise = this.loadAccount(completeAccountSpec);
        this.accounts.set(completeAccountSpec, accountPromise);
        accountPromise.then(account => {
            this.wallet.datastore && this.wallet.datastore.getIndex('accounts').put(account);
        });
        return accountPromise;
    }

    async createAccount(chainId?: string): Promise<Account> {
        const identity = createIdentity();
        const address = identity.address;
        const account = await this.addAccount({ address, chainId });
        await this.wallet.keyManager.importKey({
            account: account,
            privateKey: identity.privateKey
        });
        return account;
    }

    async getAccounts(): Promise<Account[]> {
        if (!this.loadedFromStore && this.wallet.datastore) {
            const records = Array.from(await this.wallet.datastore.getIndex('accounts').getAll());
            const accounts = records.map(record => new Account(record.key, record.data as AccountData));
            for (const account of accounts) {
                this.accounts.set(this.getCompleteAccountSpec(account.data.spec), Promise.resolve(account));
            }
            this.loadedFromStore = true;
            return accounts;
        }
        const promises = await this.accounts.values();
        return Promise.all(promises);
    }

    async getOrAddAccount(accountSpec: CompleteAccountSpec | AccountSpec): Promise<Account> {
        const completeAccountSpec = this.getCompleteAccountSpec(accountSpec);
        let account: Account;
        if (!this.accounts.has(completeAccountSpec)) {
            account = await this.addAccount(completeAccountSpec);
        } else {
            account = await this.accounts.get(completeAccountSpec) as Account;
        }
        return account;
    }

    async trackAccount(accountOrSpec: AccountSpec | Account): Promise<AccountTracker> {  
        let account: Account;
        if (!(accountOrSpec as Account).data) {
            account = await this.getOrAddAccount(accountOrSpec as AccountSpec);
        } else {
            account = accountOrSpec as Account;
        }
        this.resume();
        if (this.trackers.has(account.data.spec)) {
            return this.trackers.get(account.data.spec) as AccountTracker;
        }
        //console.log('[accountManager] track account', account.data.spec);
        const tracker = new AccountTracker(this, account);
        tracker.resume();
        this.trackers.set(account.data.spec, tracker);
        return tracker;
    }

    async loadAccount(accountSpec: CompleteAccountSpec): Promise<Account> {
        if (this.wallet.datastore) {
            try {
                const record = await this.wallet.datastore.getIndex('accounts').get(serializeAccountSpec(accountSpec));
                return new Account(record.key, record.data as AccountData);
            } catch (e) {
                // not found
            }
        }
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
        // TODO: smart caching of last used nonce
        const client = this.wallet.getClient(account.data.spec.chainId);
        return 1 + await client.getNonce(account.data.spec.address);
    }

    async getChainIdHashForAccount(account: Account): Promise<string> {
        return await this.wallet.getClient(account.data.spec.chainId).getChainIdHash('base58') as string;
    }

    /**
     * Calculates nonce and converts transaction body into tx ready for signing
     * @param account 
     * @param tx 
     */
    async prepareTransaction(account: Account, tx: Partial<TxBody>): Promise<Transaction> {
        if (!tx.from) throw new Error('missing required transaction parameter `from` (address or name)');
        if (!new Address(account.data.spec.address).equal(tx.from)) throw new Error('transaction parameter `from` does not match account address');
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
        if (typeof tx.chainIdHash === 'undefined') {
            tx.chainIdHash = await this.getChainIdHashForAccount(account);
        }
        return new Transaction('', {
            chainId: account.data.spec.chainId,
            from: tx.from.toString(),
            to: tx.to ? tx.to.toString() : '',
            hash: '',
            ts: new Date().toISOString(),
            blockhash: null,
            blockno: null,
            amount: new Amount(tx.amount).toString(),
            type: 0,
            status: Transaction.Status.Pending
        }, tx as TxBody);
    }
}
