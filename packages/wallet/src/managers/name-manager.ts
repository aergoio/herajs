import { Wallet } from '../wallet';
import { Name, NameSpec, NameData, CompleteNameSpec } from '../models/name';
import { serializeNameSpec, HashMap } from '../utils';
import { PausableTypedEventEmitter } from '../utils';
import { TxTypes, Address, Amount } from '@herajs/common';
import { TxBody } from '../models/transaction';

export interface Events {
    'add': Name;
    'update': Name;
    'remove': NameSpec;
}

/**
 * AccountManager manages and tracks single accounts
 */
export default class NameManager extends PausableTypedEventEmitter<Events> {
    public wallet: Wallet;
    private names: HashMap<CompleteNameSpec, Promise<Name>> = new HashMap();
    private loadedFromStore = false;
    private namePriceByChainId: HashMap<string, Amount> = new HashMap();

    constructor(wallet: Wallet) {
        super();
        this.wallet = wallet;
    }

    /**
     * Get name price (uses cache if noCache is not true)
     */
    async getNamePrice(chainId: string, noCache = false): Promise<Amount> {
        if (!this.namePriceByChainId.has(chainId) || noCache) {
            const client = this.wallet.getClient(chainId);
            const chainInfo = await client.getChainInfo();
            this.namePriceByChainId.set(chainId, chainInfo.nameprice);
        }
        return this.namePriceByChainId.get(chainId) as Amount;
    }

    /**
     * Completes nameSpec with chainId in case chainId is undefined.
     * @param nameSpec possibly incomplete spec
     */
    getCompleteNameSpec(nameSpec: NameSpec): CompleteNameSpec {
        const chainId = typeof nameSpec.chainId !== 'undefined' ? nameSpec.chainId : this.wallet.defaultChainId;
        return {
            name: nameSpec.name,
            chainId
        };
    }

    /**
     * Adds name to manager and datastore.
     */
    addName(nameSpec: NameSpec, extraData?: Partial<NameData>): Promise<Name> {
        const completeNameSpec = this.getCompleteNameSpec(nameSpec);
        if (this.names.has(completeNameSpec)) {
            throw new Error('Name has already been added.');
        }
        const namePromise = this.loadName(completeNameSpec, extraData);
        this.names.set(completeNameSpec, namePromise);
        namePromise.then(name => {
            this.emit('add', name);
            this.wallet.datastore && this.wallet.datastore.getIndex('names').put(name);
        });
        return namePromise;
    }

    /**
     * Removes name from manager and datastore.
     */
    async removeName(nameSpec: NameSpec): Promise<void> {
        const completeNameSpec = this.getCompleteNameSpec(nameSpec);
        if (this.names.has(completeNameSpec)) {
            // Remove name from local cache
            this.names.delete(completeNameSpec);
        }
        if (this.wallet.datastore) {
            // Remove account from store
            const index = this.wallet.datastore.getIndex('names');
            await index.delete(serializeNameSpec(completeNameSpec));
        }
        this.emit('remove', completeNameSpec);
    }

    /**
     * Remove all accounts from manager and datastore.
     * Does not delete keys, call keyManager.clearKeys() for that.
     */
    async clearNames(): Promise<void> {
        this.names.clear();
        if (this.wallet.datastore) {
            await this.wallet.datastore.getIndex('names').clear();
        }
    }

    /**
     * Generate a partial tx body for a Name Create transaction
     */
    async getCreateNameTransaction(
        nameSpec: CompleteNameSpec | NameSpec,
        extraData: { from: string | Address } & Partial<TxBody>,
    ): Promise<Partial<TxBody>> {
        const completeNameSpec = this.getCompleteNameSpec(nameSpec);
        return {
            to: 'aergo.name',
            amount: (await this.getNamePrice(completeNameSpec.chainId)).toString(),
            payload: JSON.stringify({ Name: 'v1createName', Args: [completeNameSpec.name] }),
            limit: 0,
            type: TxTypes.Governance,
            ...extraData,
        };
    }

    /**
     * Generate a partial tx body for a Name Create transaction
     */
    async getUpdateNameTransaction(
        nameSpec: CompleteNameSpec | NameSpec,
        extraData: { from: string | Address } & Partial<TxBody>,
        newDestination: string | Address,
    ): Promise<Partial<TxBody>> {
        const completeNameSpec = this.getCompleteNameSpec(nameSpec);
        return {
            to: 'aergo.name',
            amount: (await this.getNamePrice(completeNameSpec.chainId)).toString(),
            payload: JSON.stringify({ Name: 'v1updateName', Args: [completeNameSpec.name, `${newDestination}`] }),
            limit: 0,
            type: TxTypes.Governance,
            ...extraData,
        };
    }

    /**
     * Returns list of all accounts. Loads data persisted in datastore.
     */
    async getNames(): Promise<Name[]> {
        if (!this.loadedFromStore && this.wallet.datastore) {
            const records = Array.from(await this.wallet.datastore.getIndex('names').getAll());
            const names = records.map(record => new Name(record.key, record.data as NameData));
            for (const name of names) {
                this.names.set(this.getCompleteNameSpec(name.data.spec), Promise.resolve(name));
            }
            this.loadedFromStore = true;
            return names;
        }
        const promises = await this.names.values();
        return Promise.all(promises);
    }

    /**
     * Gets a name and adds it to the manager if not existing.
     * @param nameSpec 
     */
    async getOrAddName(nameSpec: CompleteNameSpec | NameSpec, extraData?: Partial<NameData>): Promise<Name> {
        const completeNameSpec = this.getCompleteNameSpec(nameSpec);
        let name: Name;
        if (!this.names.has(completeNameSpec)) {
            name = await this.addName(completeNameSpec, extraData);
        } else {
            name = await this.names.get(completeNameSpec) as Name;
        }
        return name;
    }

    /**
     * Initializes account from datastore or with initial values.
     */
    async loadName(nameSpec: CompleteNameSpec, extraData?: Partial<NameData>): Promise<Name> {
        if (this.wallet.datastore) {
            try {
                const record = await this.wallet.datastore.getIndex('accounts').get(serializeNameSpec(nameSpec));
                return new Name(record.key, record.data as NameData);
            } catch (e) {
                // not found
            }
        }
        return new Name(serializeNameSpec(nameSpec), Name.getDefaultData({
            spec: {
                chainId: nameSpec.chainId,
                name: nameSpec.name,
            },
            ...extraData,
        }));
    }

    /**
     * Update name info from blockchain
     * @param nameSpec 
     */
    async updateName(nameSpec: CompleteNameSpec | NameSpec): Promise<Name> {
        const name = await this.getOrAddName(nameSpec);
        const client = this.wallet.getClient(nameSpec.chainId);
        const { bestHeight } = await client.blockchain();
        const nameInfo = await client.getNameInfo(nameSpec.name, bestHeight);
        name.data.destination = `${nameInfo.destination}`;
        name.data.owner = `${nameInfo.owner}`;
        name.data.lastSync = {
            blockno: bestHeight,
            timestamp: +new Date(),
        };
        this.emit('update', name);
        this.wallet.datastore && this.wallet.datastore.getIndex('names').put(name);
        return name;
    }
}
