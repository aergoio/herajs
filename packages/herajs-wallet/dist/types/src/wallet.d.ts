import { MiddlewareConsumer } from './middleware';
import KeyManager from './managers/key-manager';
import AccountManager from './managers/account-manager';
import { TransactionTracker, TransactionManager } from './managers/transaction-manager';
import { AergoClient } from '@herajs/client';
import { HashMap, Constructor } from './utils';
import { Account, AccountSpec } from './models/account';
import { TxBody, SignedTransaction } from './models/transaction';
import { Storage } from './storages/storage';
interface ChainConfig {
    chainId: string;
    nodeUrl?: string;
    provider?: any;
}
interface WalletConfig {
    appName: string;
    appVersion: number;
    instanceId: string;
}
export declare class Wallet extends MiddlewareConsumer {
    defaultChainId: string;
    chainConfigs: HashMap<string, ChainConfig>;
    keyManager: KeyManager;
    transactionManager: TransactionManager;
    accountManager: AccountManager;
    config: WalletConfig;
    datastore?: Storage;
    keystore?: Storage;
    private clients;
    constructor(config?: Partial<WalletConfig>);
    set(configKey: keyof WalletConfig, value: WalletConfig[keyof WalletConfig]): void;
    /**
     * Add a chain configuration.
     * Sets new chain as default if first to be added and default chain was unchanged.
     * @param chainConfig
     */
    useChain(chainConfig: ChainConfig): void;
    /**
     * Set the default chain for subsequent actions.
     * @param chainId
     */
    setDefaultChain(chainId: string): void;
    /**
     * Get AergoClient for chainId.
     * If called the first time, create AergoClient instance.
     * @param chainId optional chainId, use default chainId when undefined
     */
    getClient(chainId?: string): AergoClient;
    /**
     * Prepare a transaction from given account specified by simple TxBody.
     * @param account
     * @param transaction
     */
    prepareTransaction(account: Account | AccountSpec, transaction: Partial<TxBody>): Promise<SignedTransaction>;
    /**
     * Send a transaction to the network using the specified account.
     * Prepares TxBody if not already prepared.
     * @param account
     * @param transaction
     */
    sendTransaction(account: Account | AccountSpec, transaction: Partial<TxBody> | SignedTransaction): Promise<TransactionTracker>;
    useStorage<T extends Storage>(classOrInstance: T | Constructor<T>): Promise<[Storage, Storage]>;
    useKeyStorage<T extends Storage>(classOrInstance: T | Constructor<T>): Promise<Storage>;
    useDataStorage<T extends Storage>(classOrInstance: T | Constructor<T>): Promise<Storage>;
    close(): Promise<void>;
    unlock(passphrase: string): Promise<void>;
    setupAndUnlock(passphrase: string): Promise<void>;
    lock(): void;
    readonly unlocked: boolean;
}
export {};
