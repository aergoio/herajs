import { MiddlewareConsumer } from './middleware';
import KeyManager from './managers/key-manager';
import AccountManager from './managers/account-manager';
import { TransactionTracker, TransactionManager } from './managers/transaction-manager';
import { AergoClient } from '@herajs/client';
import { HashMap, isConstructor, Constructor } from './utils';
import { Account, AccountSpec } from './models/account';
import { TxBody, SignedTransaction } from './models/transaction';
import { DEFAULT_CHAIN } from './defaults';
import { Storage } from './storages/storage';

const DB_VERSION = 1;

interface ChainConfig {
    chainId: string;
    nodeUrl?: string;
    provider?: any;
};

interface WalletConfig {
    appName: string;
    appVersion: number;
    instanceId: string;
}

export class Wallet extends MiddlewareConsumer {
    defaultChainId: string = DEFAULT_CHAIN;
    chainConfigs: HashMap<string, ChainConfig> = new HashMap();
    keyManager: KeyManager;
    transactionManager: TransactionManager;
    accountManager: AccountManager;
    config: WalletConfig = { appName: 'herajs-wallet', appVersion: 1, instanceId: '' };
    datastore?: Storage;
    keystore?: Storage;

    private clients: Map<string, AergoClient> = new Map();

    constructor(config?: Partial<WalletConfig>) {
        super();
        this.keyManager = new KeyManager(this);
        this.transactionManager = new TransactionManager(this);
        this.accountManager = new AccountManager(this);
        this.config = {...this.config, ...config};
    }

    set(configKey: keyof WalletConfig, value: WalletConfig[keyof WalletConfig]): void {
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
     * Get AergoClient for chainId.
     * If called the first time, create AergoClient instance.
     * @param chainId optional chainId, use default chainId when undefined
     */
    getClient(chainId?: string): AergoClient {
        if (typeof chainId === 'undefined') {
            chainId = this.defaultChainId;
        }
        if (!this.chainConfigs.has(chainId)) {
            throw new Error(`trying to use not configured chainId ${chainId}`);
        }
        const chainConfig = this.chainConfigs.get(chainId) as ChainConfig;

        if (!this.clients.has(chainId)) {
            let provider = chainConfig.provider;
            if (typeof provider === 'function') {
                provider = new provider({url: chainConfig.nodeUrl});
            }
            const client = new AergoClient({}, provider);
            this.clients.set(chainId, client);
            return client;
        }

        return this.clients.get(chainId) as AergoClient;
    }

    /**
     * Prepare a transaction from given account specified by simple TxBody.
     * @param account 
     * @param transaction 
     */
    async prepareTransaction(account: Account | AccountSpec, transaction: Partial<TxBody>): Promise<SignedTransaction> {
        if (!(<Account>account).data) account = await this.accountManager.getOrAddAccount(<AccountSpec>account);
        const preparedTx = await this.accountManager.prepareTransaction(<Account>account, transaction);
        const signedTx = await this.keyManager.signTransaction(<Account>account, preparedTx);
        return signedTx;
    }

    /**
     * Send a transaction to the network using the specified account.
     * Prepares TxBody if not already prepared.
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

    useStorage<T extends Storage>(classOrInstance: T | Constructor<T>): Promise<[Storage, Storage]> {
        return Promise.all([
            this.useKeyStorage(classOrInstance),
            this.useDataStorage(classOrInstance)
        ]);
    }

    useKeyStorage<T extends Storage>(classOrInstance: T | Constructor<T>): Promise<Storage> {
        if (isConstructor<T>(classOrInstance)) {
            this.keystore = new classOrInstance('keystore', DB_VERSION);
        } else {
            this.keystore = classOrInstance;
        }
        return this.keystore.open();
    }

    useDataStorage<T extends Storage>(classOrInstance: T | Constructor<T>): Promise<Storage> {
        if (isConstructor<T>(classOrInstance)) {
            this.datastore = new classOrInstance('datastore', DB_VERSION);
        } else {
            this.datastore = classOrInstance;
        }
        return this.datastore.open();
    }

    async close(): Promise<void> {
        this.datastore && await this.datastore.close();
        this.keystore && await this.keystore.close();
    }

    async unlock (passphrase: string): Promise<void> {
        return this.keyManager.unlock(passphrase);
    }

    async setupAndUnlock (passphrase: string): Promise<void> {
        return this.keyManager.setupAndUnlock(`id-${this.config.instanceId}`, passphrase);
    }

    lock () {
        this.keyManager.lock();
    }

    get unlocked () {
        return this.keyManager.unlocked;
    }

    async deleteAllData(): Promise<void> {
        await this.accountManager.clearAccounts();
        await this.keyManager.clearKeys();
        if (this.datastore) {
            await this.datastore.getIndex('transactions').clear();
            await this.datastore.getIndex('settings').clear();
        }
    }
}

/*

wallet.accountManager -> tracks balances and nonces
wallet.transactionManager -> tracks txs
wallet.keyManager -> signs/verifies, keeps keys


const key = await this.keystore.get(account);
//tx.hash -> getter that calculates hash when necessary
//tx.unsignedHash
const signedTx = key.signTransaction(tx);

this.keystore.put(account);

this.datastore.transactions.get(hash)
this.datastore.transactions.put(tx);
this.datastore.transactions.filterIndex(['from', 'to'], address)

wallet.transactionManager.trackAccount(account)
-> Error: no data source for account transactions. Please configure a data source such as AergoNodeSource.

// maybe add this inefficient data source?
wallet.use(new AergoNodeSource(chainId => wallet.getClient(chainId)));
wallet.transactionManager.trackAccount(account)
-> tracking transactions for account by reading blockchain. inefficient.

wallet.use(new AergoscanIndexSource((chainId) => `https://api.aergoscan.io/${chainId}`));
wallet.transactionManager.trackAccount(account)
-> tracking transactions for account by reading API. more efficient

*/