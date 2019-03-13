import { MiddlewareConsumer } from './middleware';
import KeyManager from './managers/key-manager';
import AccountManager from './managers/account-manager';
import { TransactionTracker, TransactionManager } from './managers/transaction-manager';
import { AergoClient, GrpcProvider } from '@herajs/client';
import { HashMap } from './utils';
import { Account, AccountSpec } from './models/account';
import { TxBody, SignedTransaction } from './models/transaction';
import { DEFAULT_CHAIN } from './defaults';


interface ChainConfig {
    chainId: string;
    nodeUrl: string;
};

export class Wallet extends MiddlewareConsumer {
    defaultChainId: string = DEFAULT_CHAIN;
    chains: HashMap<string, ChainConfig> = new HashMap();
    keyManager: KeyManager;
    transactionManager: TransactionManager;
    accountManager: AccountManager;

    private clients: Map<string, AergoClient> = new Map();

    constructor() {
        super();
        this.keyManager = new KeyManager(this);
        this.transactionManager = new TransactionManager(this);
        this.accountManager = new AccountManager(this);
    }

    useChain(chainConfig: ChainConfig): void {
        this.chains.set(chainConfig.chainId, chainConfig);
        // Set as default chain if it is the first one to be added and default chain was unchanged
        if (
            this.chains.size === 1 &&
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
        if (!this.chains.has(chainId)) {
            throw new Error(`configure chain ${chainId} using useChain() before setting it as default`);
        }
        this.defaultChainId = chainId;
    }

    getChainClient(chainId: string): AergoClient {
        if (!this.chains.has(chainId)) {
            throw new Error(`trying to use not configured chainId ${chainId}`);
        }
        const chainConfig = this.chains.get(chainId) as ChainConfig;

        if (!this.clients.has(chainId)) {
            const client = new AergoClient({}, new GrpcProvider({url: chainConfig.nodeUrl}));
            this.clients.set(chainId, client);
            return client;
        }

        return this.clients.get(chainId) as AergoClient;
    }

    async prepareTransaction(account: Account | AccountSpec, transaction: Partial<TxBody>): Promise<SignedTransaction> {
        if (!(<Account>account).data) account = await this.accountManager.addAccount(<AccountSpec>account);
        const preparedTx = await this.accountManager.prepareTransaction(<Account>account, transaction);
        const signedTx = await this.keyManager.signTransaction(<Account>account, preparedTx);
        return signedTx;
    }

    async sendTransaction(account: Account | AccountSpec, transaction: Partial<TxBody> | SignedTransaction): Promise<TransactionTracker> {
        let signedTransaction: SignedTransaction;
        if (transaction instanceof SignedTransaction) {
            signedTransaction = transaction;
        } else {
            signedTransaction = await this.prepareTransaction(account, transaction);
        }
        return this.transactionManager.sendTransaction(signedTransaction);
    }

    get keystore() {
        return {};
    }

    get datastore() {
        return {};
    }

}

/*

wallet.accountManager -> tracks balances and nonces
wallet.transactionManager -> tracks txs
wallet.keyManager -> signs/verifies, keeps keys

wallet.setDefaultChain('testnet.aergo.io');

always define chain in parmaters (can default to defaultChain, testnet.aergo.io)

const key = await this.keystore.get(account);
//tx.hash -> getter that calculates hash when necessary
//tx.unsignedHash

const signedTx = key.signTransaction(tx);

this.keystore.put(account);

this.datastore.transactions.get(hash)
this.datastore.transactions.put(tx);
this.datastore.transactions.filterIndex(['from', 'to'], address)

const wallet = new Wallet();
wallet.useChain({
    chainId: 'testnet.aergo.io',
    nodeUrl: 'testnet.aergo.io'
});
//wallet.use(new GrpcWebProvider('testnet.aergo.io'));
wallet.use(LocalKeyManager);
const account = wallet.accountManager.getOrAddAccount({ chainId: 'testnet.aergo.io', address: 'Amvmfmf' });
// can do const account = wallet.accountManager.getOrAddAccount({ chainId: 'testnet.aergo.io', address: 'Amvmfmf' }); if set default chain
wallet.keyManager.addKey({
    account: account,
    key: ...
});
const key = wallet.keyManager.get(account);
const tx = new Transaction({
    account,
    recipient: account,
    amount: "1 aergo",
    nonce: wallet.accountManager.getNextNonce(account) // Max(remote, local) + 1
});
const signedTx = key.signTransaction(tx);
const txTracker = wallet.sendTransaction(signedTx);
txTracker.hash
txTracker.on('block', (block) => {

});
txTracker.on('receipt', (receipt) => {

});
txTracker.on('error', (error) => {

});
// exponential back off for polling

wallet.accountManager.trackAccount(account); // implicit add and resume()
wallet.accountManager.on('added', (account) => {

});
wallet.accountManager.on('changed', (accounts) => {

});
wallet.accountManager.on('update', (account) => {

});
wallet.accountManager.pause()
wallet.accountManager.resume()

wallet.transactionManager.getOrAddTransaction('hash'); // 
wallet.transactionManager.addTransaction(signedTx)

wallet.transactionManager.on('update', (transaction) => {

})

wallet.transactionManager.trackAccount(account)
-> Error: No data source for account transactions. E.g.

// maybe add this inefficient data source?
wallet.use(new AergoNodeSource(chainId => ..))
wallet.transactionManager.trackAccount(account)
-> tracking transactions for account by reading blockchain. inefficient.

wallet.use(new AergoscanIndexSource((chainId) => `https://api.aergoscan.io/${chainId}`));
wallet.transactionManager.trackAccount(account)
-> tracking transactions for account by reading API. more efficient

*/