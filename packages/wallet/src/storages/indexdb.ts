import { openDB, IDBPDatabase, OpenDBCallbacks, StoreNames, DBSchema } from 'idb';
import { Record, BasicType, Data } from '../models/record';
import { Storage, Index } from './storage';

interface IdbSchema extends DBSchema {
    'transactions': {
        key: string;
        value: Record;
        indexes: { 'from': string; 'to': string };
    };
    'accounts': {
        key: string;
        value: Record;
        indexes: { 'spec.address': string };
    };
    'names': {
        key: string;
        value: Record;
        indexes: { 'accountKey': string };
    };
    'settings': {
        key: string;
        value: Record;
    };
    'keys': {
        key: string;
        value: Record;
    };
}

function arrayContains<T extends U, U>(haystack: ReadonlyArray<T>, needle: U): needle is T {
    return haystack.indexOf(needle as T) !== -1;
}

class IDBIndex extends Index {
    storage: IndexedDbStorage;
    name: StoreNames<IdbSchema>;
    db: IDBPDatabase<IdbSchema>;
    keyPath = 'key';

    constructor(storage: IndexedDbStorage, name: StoreNames<IdbSchema>) {
        super();
        this.storage = storage;
        this.name = name;
        if (typeof storage.db === 'undefined') {
            throw new Error('open storage before accessing index');
        }
        this.db = storage.db;
    }
    async get(key: string): Promise<Record> {
        const record = await this.db.transaction(this.name).objectStore(this.name).get(key);
        if (!record) throw new Error('not found');
        return record;
    }
    async getAll(indexValue?: BasicType, indexName?: string): Promise<IterableIterator<Record>> {
        const q = typeof indexValue !== 'undefined' ? IDBKeyRange.only(indexValue) : undefined;
        if (typeof indexName !== 'undefined') {
            if (this.name === 'transactions' && arrayContains(['from', 'to'] as const, indexName)) {
                const records = await this.db.transaction(this.name).objectStore(this.name).index(indexName).getAll(q);
                return records[Symbol.iterator]();
            }
            if (this.name === 'accounts' && arrayContains(['spec.address'] as const, indexName)) {
                const records = await this.db.transaction(this.name).objectStore(this.name).index(indexName).getAll(q);
                return records[Symbol.iterator]();
            }
            if (this.name === 'names' && arrayContains(['accountKey'] as const, indexName)) {
                const records = await this.db.transaction(this.name).objectStore(this.name).index(indexName).getAll(q);
                return records[Symbol.iterator]();
            }
        }
        const records = await this.db.transaction(this.name).objectStore(this.name).getAll(q);
        return records[Symbol.iterator]();
    }
    async put<T extends Data = Data>(record: Record<T>): Promise<string> {
        const tx = this.db.transaction(this.name, 'readwrite');
        const validKey = await tx.objectStore(this.name).put(record);
        return validKey.toString();
    }
    delete(key: string): Promise<void> {
        return this.db.transaction(this.name, 'readwrite').objectStore(this.name).delete(key);
    }
    clear(): Promise<void> {
        return this.db.transaction(this.name, 'readwrite').objectStore(this.name).clear();
    }
}

/**
 * IndexedDbStorage uses the browser-native IndexedDb.
 */
export default class IndexedDbStorage extends Storage {
    name: string;
    version: number;
    db?: IDBPDatabase<IdbSchema>;
    indices: Map<string, IDBIndex> = new Map();

    constructor(name: string, version: number) {
        super();
        this.name = name;
        this.version = version;
    }
    async open(): Promise<this> {
        if (typeof this.db !== 'undefined') return this;

        const upgrade: OpenDBCallbacks<IdbSchema>['upgrade'] = (db, oldVersion, _newVersion, tx) => {
            switch (oldVersion) {
                // @ts-ignore: falls through
                case 0: {
                    const txOS = db.createObjectStore('transactions', { keyPath: 'key' });
                    txOS.createIndex('from', 'data.from', { unique: false });
                    txOS.createIndex('to', 'data.to', { unique: false });
                    db.createObjectStore('accounts', { keyPath: 'key' });
                    db.createObjectStore('settings', { keyPath: 'key' });
                    db.createObjectStore('keys', { keyPath: 'key' });
                }
                // @ts-ignore: falls through
                case 1: {
                    tx.objectStore('accounts').createIndex('spec.address', 'data.spec.address', { unique: false });
                }
                // @ts-ignore: falls through
                case 2: {
                    db.createObjectStore('names', { keyPath: 'key' });
                    tx.objectStore('names').createIndex('accountKey', 'data.accountKey', { unique: false });
                }
            }
        };

        this.db = await openDB<IdbSchema>(this.name, this.version, { upgrade });
        return this;
    }
    async close(): Promise<void> {
        return;
    }
    getIndex(name: StoreNames<IdbSchema>): IDBIndex {
        if (this.indices.has(name)) {
            return this.indices.get(name) as IDBIndex;
        }
        const index = new IDBIndex(this, name);
        this.indices.set(name, index);
        return index;
    }
}