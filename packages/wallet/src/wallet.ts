import { MiddlewareConsumer } from './middleware';
import KeyManager from './managers/key-manager';
import AccountManager from './managers/account-manager';
import { TransactionTracker, TransactionManager } from './managers/transaction-manager';
import NameManager from './managers/name-manager';
import { AergoClient } from '@herajs/client';
import { HashMap, isConstructor, Constructor } from './utils';
import { Account, AccountSpec } from './models/account';
import { TxBody, SignedTransaction } from './models/transaction';
import { DEFAULT_CHAIN } from './defaults';
import { Storage } from './storages/storage';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';

const DB_VERSION = 1;

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

/**
 * Wallet is the central object that keeps configuration and references to the different managers.
 */
export class Wallet extends MiddlewareConsumer {
    public defaultChainId: string = DEFAULT_CHAIN;
    private chainConfigs: HashMap<string, ChainConfig> = new HashMap();
    public keyManager: KeyManager;
    public transactionManager: TransactionManager;
    public accountManager: AccountManager;
    public nameManager: NameManager;
    private config: WalletConfig = { appName: 'herajs-wallet', appVersion: 1, instanceId: '' };
    public datastore?: Storage;
    public keystore?: Storage;
    private clients: Map<string, AergoClient> = new Map();
    public defaultLimit?: number;
    public ledger?: LedgerAppAergo;

    constructor(config?: Partial<WalletConfig>) {
        super();
        this.keyManager = new KeyManager(this);
        this.transactionManager = new TransactionManager(this);
        this.accountManager = new AccountManager(this);
        this.nameManager = new NameManager(this);
        this.config = { ...this.config, ...config };
    }

    /**
     * Sets a configuration value
     * @param configKey
     * @param value 
     */
    set(configKey: keyof WalletConfig, value: WalletConfig[keyof WalletConfig]): void {
        // @ts-ignore
        this.config[configKey] = value;
    }

    /**
     * Add a chain configuration.
     * Sets new chain as default if first to be added and default chain was unchanged.
     * @param chainConfig 
     */
    useChain(chainConfig: ChainConfig): void {
        if (typeof chainConfig.provider === 'undefined') {
            chainConfig.provider = AergoClient.defaultProviderClass;
        }

        if (typeof chainConfig.provider === 'function' && typeof chainConfig.nodeUrl === 'undefined') {
            throw new Error('supply nodeUrl in chain config or instantiate provider manually');
        }

        this.chainConfigs.set(chainConfig.chainId, chainConfig);
        if (
            this.chainConfigs.size === 1 &&
            this.defaultChainId === DEFAULT_CHAIN &&
            chainConfig.chainId !== DEFAULT_CHAIN
        ) {
            this.setDefaultChain(chainConfig.chainId);
        }
    }

    /**
     * Set the default chain for subsequent actions.
     * @param chainId 
     */
    setDefaultChain(chainId: string): void {
        if (!this.chainConfigs.has(chainId)) {
            throw new Error(`configure chain ${chainId} using useChain() before setting it as default`);
        }
        this.defaultChainId = chainId;
    }

    /**
     * Set the default gas limit for subsequent transactions.
     * @param limit 
     */
    setDefaultLimit(limit: number): void {
        this.defaultLimit = limit;
    }

    /**
     * Get AergoClient for chainId.
     * If called the first time, create AergoClient instance.
     * @param chainId optional, uses default chainId when undefined
     */
    getClient(chainId?: string): AergoClient {
        if (typeof chainId === 'undefined') {
            chainId = this.defaultChainId;
        }
        if (!this.chainConfigs.has(chainId)) {
            throw new Error(`trying to use not configured chainId ${chainId}`);
        }
        const chainConfig = this.chainConfigs.get(chainId) as ChainConfig;
        let client: AergoClient;

        if (!this.clients.has(chainId)) {
            let provider = chainConfig.provider;
            if (typeof provider === 'function') {
                provider = new provider({ url: chainConfig.nodeUrl });
            }
            client = new AergoClient({}, provider);
            this.clients.set(chainId, client);
        } else {
            client = this.clients.get(chainId) as AergoClient;
        }
        if (this.defaultLimit) {
            client.setDefaultLimit(this.defaultLimit);
        }
        return client;
    }

    /**
     * Prepare a transaction from given account specified by simple TxBody.
     * Completes missing information (chainIdHash, nonce) and signs tx using key of account.
     * @param account account object or specification
     * @param transaction
     * @returns prepared and signed transaction
     */
    async prepareTransaction(account: Account | AccountSpec, transaction: Partial<TxBody>): Promise<SignedTransaction> {
        if (!(account as Account).data) account = await this.accountManager.getOrAddAccount(account as AccountSpec);
        const preparedTx = await this.accountManager.prepareTransaction(account as Account, transaction);
        const signedTx = await this.keyManager.signTransaction(account as Account, preparedTx);
        return signedTx;
    }

    /**
     * Send a transaction to the network using the specified account.
     * Calls prepareTransaction() if not already prepared.
     * @param account 
     * @param transaction
     */
    async sendTransaction(account: Account | AccountSpec, transaction: Partial<TxBody> | SignedTransaction): Promise<TransactionTracker> {
        let signedTransaction: SignedTransaction;
        if (transaction instanceof SignedTransaction) {
            signedTransaction = transaction;
        } else {
            signedTransaction = await this.prepareTransaction(account, transaction);
        }
        return this.transactionManager.sendTransaction(signedTransaction);
    }

    /**
     * Sets storage to use for both keystore and datastore
     * @param classOrInstance
     */
    useStorage<T extends Storage>(classOrInstance: T | Constructor<T>): Promise<[Storage, Storage]> {
        return Promise.all([
            this.useKeyStorage(classOrInstance),
            this.useDataStorage(classOrInstance)
        ]);
    }

    /**
     * Sets storage to use for keystore
     * @param classOrInstance
     */
    useKeyStorage<T extends Storage>(classOrInstance: T | Constructor<T>): Promise<Storage> {
        if (isConstructor<T>(classOrInstance)) {
            this.keystore = new classOrInstance('keystore', DB_VERSION);
        } else {
            this.keystore = classOrInstance;
        }
        return this.keystore.open();
    }

    /**
     * Sets storage to use for datastore
     * @param classOrInstance
     */
    useDataStorage<T extends Storage>(classOrInstance: T | Constructor<T>): Promise<Storage> {
        if (isConstructor<T>(classOrInstance)) {
            this.datastore = new classOrInstance('datastore', DB_VERSION);
        } else {
            this.datastore = classOrInstance;
        }
        return this.datastore.open();
    }

    /**
     * Closes storages.
     */
    async close(): Promise<void> {
        this.datastore && await this.datastore.close();
        this.keystore && await this.keystore.close();
    }

    /**
     * Shortcut for keyManager.unlock()
     * @param passphrase
     */
    async unlock (passphrase: string): Promise<void> {
        return this.keyManager.unlock(passphrase);
    }

    /**
     * Shortcut for keyManager.setupAndUnlock()
     * @param passphrase
     */
    setupAndUnlock (passphrase: string): Promise<void> {
        return this.keyManager.setupAndUnlock(`id-${this.config.instanceId}`, passphrase);
    }

    /**
     * Shortcut for keyManager.isSetup()
     */
    isSetup(): Promise<boolean> {
        return this.keyManager.isSetup();
    }

    /**
     * Shortcut for keyManager.lock()
     */
    lock(): void {
        this.keyManager.lock();
    }

    get unlocked(): boolean {
        return this.keyManager.unlocked;
    }

    /**
     * Clears all storages
     */
    async deleteAllData(): Promise<void> {
        await this.accountManager.clearAccounts();
        await this.keyManager.clearKeys();
        if (this.datastore) {
            await this.datastore.getIndex('transactions').clear();
            await this.datastore.getIndex('settings').clear();
        }
    }

    connectLedger(transport: any): void {
        this.ledger = new LedgerAppAergo(transport);
    }
}
