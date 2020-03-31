import { Wallet } from '../wallet';
import { Name, NameSpec, NameData, CompleteNameSpec } from '../models/name';
import { AccountSpec, CompleteAccountSpec } from '../models/account';
import { serializeNameSpec, serializeAccountSpec, deserializeAccountSpec, HashMap } from '../utils';
import { PausableTypedEventEmitter } from '../utils';
import { TxTypes, Address, Amount } from '@herajs/common';
import { TxBody } from '../models/transaction';

export interface Events {
    'add': Name;
    'update': Name;
    'remove': NameSpec;
    'updateAccount': { accountSpec: AccountSpec; names: Name[] };
}

type NamesByKey = HashMap<CompleteNameSpec, Promise<Name>>;
type NamesByAccount = HashMap<CompleteAccountSpec, NamesByKey>;

/**
 * AccountManager manages and tracks single accounts
 */
export default class NameManager extends PausableTypedEventEmitter<Events> {
    public wallet: Wallet;
    private namesByAccount: NamesByAccount = new HashMap();
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

    private getNamesMap(accountSpec: CompleteAccountSpec): NamesByKey {
        const completeAccountSpec = this.wallet.accountManager.getCompleteAccountSpec(accountSpec);
        if (!this.namesByAccount.has(completeAccountSpec)) {
            this.namesByAccount.set(completeAccountSpec, new HashMap());
        }
        return this.namesByAccount.get(completeAccountSpec) as NamesByKey;
    }

    /**
     * Adds name to manager and datastore.
     */
    addName(accountSpec: AccountSpec, name: string, extraData?: Partial<NameData>): Promise<Name> {
        const completeAccountSpec = this.wallet.accountManager.getCompleteAccountSpec(accountSpec);
        const names = this.getNamesMap(completeAccountSpec);
        const completeNameSpec = { name, chainId: completeAccountSpec.chainId };
        if (names.has(completeNameSpec)) {
            throw new Error('Name has already been added.');
        }
        const namePromise = this.loadName(completeNameSpec, {
            ...extraData,
            accountKey: serializeAccountSpec(completeAccountSpec),
        });
        names.set(completeNameSpec, namePromise);
        namePromise.then(name => {
            this.emit('add', name);
            Promise.all(names.values()).then(names => {
                this.emit('updateAccount', { accountSpec: completeAccountSpec, names });
            });
            this.wallet.datastore && this.wallet.datastore.getIndex('names').put(name);
        });
        return namePromise;
    }

    /**
     * Removes name from manager and datastore.
     */
    async removeName(accountSpec: AccountSpec, name: string, fromStore = true): Promise<void> {
        const completeAccountSpec = this.wallet.accountManager.getCompleteAccountSpec(accountSpec);
        const names = this.getNamesMap(completeAccountSpec);
        const completeNameSpec = { name, chainId: completeAccountSpec.chainId };
        if (names.has(completeNameSpec)) {
            // Remove name from local cache
            names.delete(completeNameSpec);
        }
        if (this.wallet.datastore && fromStore) {
            // Remove account from store
            const index = this.wallet.datastore.getIndex('names');
            await index.delete(serializeNameSpec(completeNameSpec));
        }
        this.emit('remove', completeNameSpec);
        Promise.all(names.values()).then(names => {
            this.emit('updateAccount', { accountSpec: completeAccountSpec, names });
        });
    }

    /**
     * Remove all names from manager and datastore.
     */
    async clearNames(): Promise<void> {
        this.namesByAccount.clear();
        if (this.wallet.datastore) {
            await this.wallet.datastore.getIndex('names').clear();
        }
    }

    /**
     * Generate a partial tx body for a Name Create transaction
     */
    async getCreateNameTransaction(
        accountSpec: CompleteAccountSpec | AccountSpec,
        name: string,
        extraData?: Partial<TxBody>,
    ): Promise<Partial<TxBody>> {
        const completeAccountSpec = this.wallet.accountManager.getCompleteAccountSpec(accountSpec);
        return {
            from: completeAccountSpec.address,
            to: 'aergo.name',
            amount: (await this.getNamePrice(completeAccountSpec.chainId)).toString(),
            payload: JSON.stringify({ Name: 'v1createName', Args: [name] }),
            limit: 0,
            type: TxTypes.Governance,
            ...extraData,
        };
    }

    /**
     * Generate a partial tx body for a Name Create transaction
     */
    async getUpdateNameTransaction(
        accountSpec: CompleteAccountSpec | AccountSpec,
        name: string,
        newDestination: string | Address,
        extraData?: Partial<TxBody>,
    ): Promise<Partial<TxBody>> {
        const completeAccountSpec = this.wallet.accountManager.getCompleteAccountSpec(accountSpec);
        return {
            from: completeAccountSpec.address,
            to: 'aergo.name',
            amount: (await this.getNamePrice(completeAccountSpec.chainId)).toString(),
            payload: JSON.stringify({ Name: 'v1updateName', Args: [name, `${newDestination}`] }),
            limit: 0,
            type: TxTypes.Governance,
            ...extraData,
        };
    }

    /**
     * Returns list of all accounts. Loads data persisted in datastore.
     */
    async getNames(accountSpec: AccountSpec): Promise<Name[]> {
        const completeAccountSpec = this.wallet.accountManager.getCompleteAccountSpec(accountSpec);
        const namesMap = this.getNamesMap(completeAccountSpec);
        if (!this.loadedFromStore && this.wallet.datastore) {
            const records = Array.from(await this.wallet.datastore.getIndex('names').getAll(serializeAccountSpec(completeAccountSpec), 'accountKey'));
            const names = records.map(record => new Name(record.key, record.data as NameData));
            for (const name of names) {
                namesMap.set(this.getCompleteNameSpec(name.data.spec), Promise.resolve(name));
            }
            this.loadedFromStore = true;
            return names;
        }
        return Promise.all(namesMap.values()).then(names => {
            this.emit('updateAccount', { accountSpec: completeAccountSpec, names });
            return names;
        });
    }

    /**
     * Gets a name and adds it to the manager if not existing.
     * @param nameSpec 
     */
    async getOrAddName(accountSpec: CompleteAccountSpec | AccountSpec, name: string, extraData?: Partial<NameData>): Promise<Name> {
        const completeAccountSpec = this.wallet.accountManager.getCompleteAccountSpec(accountSpec);
        const namesMap = this.getNamesMap(completeAccountSpec);
        const completeNameSpec = { name, chainId: completeAccountSpec.chainId };
        let nameObj: Name;
        if (!namesMap.has(completeNameSpec)) {
            nameObj = await this.addName(accountSpec, name, extraData);
        } else {
            nameObj = await namesMap.get(completeNameSpec) as Name;
        }
        return nameObj;
    }

    /**
     * Initializes account from datastore or with initial values.
     */
    async loadName(nameSpec: CompleteNameSpec, extraData?: Partial<NameData>): Promise<Name> {
        if (this.wallet.datastore) {
            try {
                const record = await this.wallet.datastore.getIndex('names').get(serializeNameSpec(nameSpec));
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

    moveNameToAccount(oldAccountSpec: CompleteAccountSpec, newAccountSpec: CompleteAccountSpec, name: Name): void {
        const nameSpec = this.getCompleteNameSpec(name.data.spec);
        const oldNamesMap = this.getNamesMap(oldAccountSpec);
        if (oldNamesMap.has(nameSpec)) {
            oldNamesMap.delete(nameSpec);
        }
        const newNamesMap = this.getNamesMap(newAccountSpec);
        newNamesMap.set(nameSpec, Promise.resolve(name));
        Promise.all(oldNamesMap.values()).then(names => {
            this.emit('updateAccount', { accountSpec: oldAccountSpec, names });
        });
        Promise.all(newNamesMap.values()).then(names => {
            this.emit('updateAccount', { accountSpec: newAccountSpec, names });
        });
    }

    /**
     * Update name info from blockchain
     * @param nameSpec 
     */
    async updateName(accountSpec: AccountSpec, name: string): Promise<Name> {
        const completeAccountSpec = this.wallet.accountManager.getCompleteAccountSpec(accountSpec);
        const nameObj = await this.getOrAddName(completeAccountSpec, name);
        const client = this.wallet.getClient(completeAccountSpec.chainId);
        const { bestHeight } = await client.blockchain();
        const nameInfo = await client.getNameInfo(name, bestHeight);
        nameObj.data.destination = `${nameInfo.destination}`;
        nameObj.data.owner = `${nameInfo.owner}`;
        nameObj.data.lastSync = {
            blockno: bestHeight,
            timestamp: +new Date(),
        };
        // If the owner changed, also update the associated account and namesMap
        const oldAccountKey = nameObj.data.accountKey;
        const newAccountSpec = this.wallet.accountManager.getCompleteAccountSpec({ chainId: completeAccountSpec.chainId, address: `${nameInfo.owner}` });
        nameObj.data.accountKey = serializeAccountSpec(newAccountSpec);
        if (oldAccountKey !== nameObj.data.accountKey) {
            const oldAccountSpec = this.wallet.accountManager.getCompleteAccountSpec(deserializeAccountSpec(oldAccountKey));
            this.moveNameToAccount(oldAccountSpec, newAccountSpec, nameObj);
        }
        this.emit('update', nameObj);
        this.wallet.datastore && this.wallet.datastore.getIndex('names').put(nameObj);
        return nameObj;
    }
}
