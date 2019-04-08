import { Wallet } from '../wallet';
import { Account, AccountSpec, CompleteAccountSpec } from '../models/account';
import { Transaction, TxBody } from '../models/transaction';
import { HashMap } from '../utils';
import { PausableTypedEventEmitter } from '../utils';
export interface Events {
    'add': Account;
    'update': Account;
    'change': Account[];
}
export interface TrackerEvents {
    'update': Account;
}
declare class AccountTracker extends PausableTypedEventEmitter<TrackerEvents> {
    private manager;
    private intervalId?;
    private account;
    constructor(manager: AccountManager, account: Account);
    load(): Promise<Account>;
    resume(): void;
    pause(): void;
}
/**
 * AccountManager manages and tracks single accounts
 */
export default class AccountManager extends PausableTypedEventEmitter<Events> {
    wallet: Wallet;
    accounts: HashMap<CompleteAccountSpec, Promise<Account>>;
    trackers: HashMap<CompleteAccountSpec, AccountTracker>;
    private loadedFromStore;
    constructor(wallet: Wallet);
    resume(): void;
    pause(): void;
    getCompleteAccountSpec(accountSpec: AccountSpec): CompleteAccountSpec;
    addAccount(accountSpec: AccountSpec): Promise<Account>;
    createAccount(chainId?: string): Promise<Account>;
    getAccounts(): Promise<Account[]>;
    getOrAddAccount(accountSpec: CompleteAccountSpec | AccountSpec): Promise<Account>;
    trackAccount(accountOrSpec: AccountSpec | Account): Promise<AccountTracker>;
    loadAccount(accountSpec: CompleteAccountSpec): Promise<Account>;
    getNonceForAccount(account: Account): Promise<number>;
    getChainIdHashForAccount(account: Account): Promise<string>;
    /**
     * Calculates nonce and converts transaction body into tx ready for signing
     * @param account
     * @param tx
     */
    prepareTransaction(account: Account, tx: Partial<TxBody>): Promise<Transaction>;
}
export {};
