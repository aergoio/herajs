import { Wallet } from '../wallet';
import { Account, AccountSpec, AccountData, CompleteAccountSpec } from '../models/account';
import { Transaction, TxBody, CompleteTxBody } from '../models/transaction';
import { serializeAccountSpec, HashMap } from '../utils';
import { Amount, Address } from '@herajs/common';
import { ACCOUNT_UPDATE_INTERVAL } from '../defaults';
import { PausableTypedEventEmitter } from '../utils';
import { createIdentity, identifyFromPrivateKey } from '@herajs/crypto';
import { Identity } from '@herajs/crypto/dist/types/keys';

export interface Events {
    'add': Account;
    'update': Account;
    'remove': AccountSpec;
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
        if (this.account.data.balance !== state.balance.toString() || this.account.data.nonce !== state.nonce) {
            this.account.data.balance = state.balance.toString();
            this.account.data.nonce = state.nonce;
            this.emit('update', this.account);
            this.manager.wallet.datastore && this.manager.wallet.datastore.getIndex('accounts').put(this.account);
        }
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
    public wallet: Wallet;
    private accounts: HashMap<CompleteAccountSpec, Promise<Account>> = new HashMap();
    private trackers: HashMap<CompleteAccountSpec, AccountTracker> = new HashMap();
    private loadedFromStore = false;

    constructor(wallet: Wallet) {
        super();
        this.wallet = wallet;
    }

    /**
     * Resume all existing account trackers.
     */
    resume(): void {
        if (!this.paused) return;
        this.paused = false;
        for (const tracker of this.trackers.values()) {
            tracker.resume();
        }
    }

    /**
     * Pause all existing account trackers.
     */
    pause(): void {
        if (this.paused) return;
        this.paused = true;
        for (const tracker of this.trackers.values()) {
            tracker.pause();
        }
    }

    /**
     * Completes accountSpec with chainId in case chainId is undefined.
     * @param accountSpec completed account spec
     */
    getCompleteAccountSpec(accountSpec: AccountSpec): CompleteAccountSpec {
        const chainId = typeof accountSpec.chainId !== 'undefined' ? accountSpec.chainId : this.wallet.defaultChainId;
        return {
            address: accountSpec.address,
            chainId
        };
    }

    /**
     * Adds account to manager and datastore.
     */
    addAccount(accountSpec: AccountSpec, extraData?: Partial<AccountData>): Promise<Account> {
        const completeAccountSpec = this.getCompleteAccountSpec(accountSpec);
        if (this.accounts.has(completeAccountSpec)) {
            throw new Error('Account has already been added.');
        }
        // console.log('addAccount', completeAccountSpec);
        const accountPromise = this.loadAccount(completeAccountSpec, extraData);
        this.accounts.set(completeAccountSpec, accountPromise);
        accountPromise.then(account => {
            this.emit('add', account);
            this.wallet.datastore && this.wallet.datastore.getIndex('accounts').put(account);
        });
        return accountPromise;
    }

    /**
     * Removes account from manager and datastore.
     * Also removes account's key from keystore if no other account uses it.
     */
    async removeAccount(accountSpec: AccountSpec): Promise<void> {
        const completeAccountSpec = this.getCompleteAccountSpec(accountSpec);
        if (this.accounts.has(completeAccountSpec)) {
            // Remove account from local cache
            this.accounts.delete(completeAccountSpec);
        }
        if (this.wallet.datastore) {
            // Remove account from store
            const index = this.wallet.datastore.getIndex('accounts');
            await index.delete(serializeAccountSpec(completeAccountSpec));
            if (this.wallet.keystore) {
                // Also remove key if there's no other account with this address
                const remainingAccounts = Array.from(await index.getAll(completeAccountSpec.address.toString(), 'spec.address'));
                if (remainingAccounts.length === 0) {
                    await this.wallet.keyManager.removeKey(completeAccountSpec.address.toString());
                }
            }
        }
        this.emit('remove', completeAccountSpec);
    }

    /**
     * Remove all accounts from manager and datastore.
     * Does not delete keys, call keyManager.clearKeys() for that.
     */
    async clearAccounts(): Promise<void> {
        this.accounts.clear();
        if (this.wallet.datastore) {
            await this.wallet.datastore.getIndex('accounts').clear();
        }
    }

    /**
     * Generates a new account and private key.
     * @param chainId optional, uses default chainId if undefined
     * @param extraData optional, extra data to be saved with account
     */
    async createAccount(chainId?: string, extraData?: Partial<AccountData>): Promise<Account> {
        const identity = createIdentity();
        return this.importAndAddIdentity(identity, chainId, extraData);
    }

    /**
     * Import an account by private key.
     * @param chainId optional, uses default chainId if undefined
     * @param extraData optional, extra data to be saved with account
     */
    async importAccount(privateKey: Buffer|Uint8Array, chainId?: string, extraData?: Partial<AccountData>): Promise<Account> {
        const identity = identifyFromPrivateKey(privateKey);
        return this.importAndAddIdentity(identity, chainId, extraData);
    }

    private async importAndAddIdentity(identity: Identity, chainId?: string, extraData?: Partial<AccountData>): Promise<Account> {
        const address = identity.address;
        const account = await this.addAccount({ address, chainId }, extraData);
        try {
            await this.wallet.keyManager.importKey({
                account: account,
                privateKey: identity.privateKey,
            });
        } catch (e) {
            // Rollback
            await this.removeAccount({ address, chainId });
            throw e;
        }
        return account;
    }

    /**
     * Returns list of all accounts. Loads data persisted in datastore.
     */
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

    /**
     * Gets an account and adds it to the manager if not existing.
     * @param accountSpec 
     */
    async getOrAddAccount(accountSpec: CompleteAccountSpec | AccountSpec, extraData?: Partial<AccountData>): Promise<Account> {
        const completeAccountSpec = this.getCompleteAccountSpec(accountSpec);
        let account: Account;
        if (!this.accounts.has(completeAccountSpec)) {
            account = await this.addAccount(completeAccountSpec, extraData);
        } else {
            account = await this.accounts.get(completeAccountSpec) as Account;
        }
        return account;
    }

    /**
     * Returns an account tracker.
     */
    async trackAccount(accountOrSpec: AccountSpec | Account, extraData?: Partial<AccountData>): Promise<AccountTracker> {  
        let account: Account;
        if (!(accountOrSpec as Account).data) {
            account = await this.getOrAddAccount(accountOrSpec as AccountSpec, extraData);
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

    /**
     * Initializes account from datastore or with initial values.
     */
    async loadAccount(accountSpec: CompleteAccountSpec, extraData?: Partial<AccountData>): Promise<Account> {
        if (this.wallet.datastore) {
            try {
                const record = await this.wallet.datastore.getIndex('accounts').get(serializeAccountSpec(accountSpec));
                return new Account(record.key, record.data as AccountData);
            } catch (e) {
                // not found
            }
        }
        return new Account(serializeAccountSpec(accountSpec), Account.getDefaultData({
            spec: {
                chainId: accountSpec.chainId,
                address: accountSpec.address.toString()
            },
            ...extraData,
        }));
    }

    /**
     * Returns next usable nonce for account.
     * This uses the Aergo client to determine the nonce from the server.
     * @param account 
     */
    async getNonceForAccount(account: Account): Promise<number> {
        // TODO: smart caching of last used nonce so we can create multiple transactions at once
        const client = this.wallet.getClient(account.data.spec.chainId);
        return 1 + await client.getNonce(account.data.spec.address);
    }

    private async getChainIdHashForAccount(account: Account): Promise<string> {
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
            // eslint-disable-next-line require-atomic-updates
            tx.nonce = await this.getNonceForAccount(account);
        }
        if (typeof tx.chainIdHash === 'undefined') {
            // eslint-disable-next-line require-atomic-updates
            tx.chainIdHash = await this.getChainIdHashForAccount(account);
        }
        if (typeof tx.limit === 'undefined' && this.wallet.defaultLimit) {
            // eslint-disable-next-line require-atomic-updates
            tx.limit = this.wallet.defaultLimit;
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
            type: tx.type || 0,
            status: Transaction.Status.Pending,
        }, tx as CompleteTxBody);
    }

    /**
     * Obtain an address from a connected Ledger harware wallet
     * @param derivationPath BIP39 derivation path, e.g. m/44'/441'/0'/0/1
     */
    async getAddressFromLedger(derivationPath: string): Promise<string> {
        if (!this.wallet.ledger) throw new Error('call wallet.connectLedger before requesting address');
        const address = await this.wallet.ledger.getWalletAddress(derivationPath);
        return `${address}`;
    }
}
