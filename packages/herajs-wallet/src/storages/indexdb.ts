import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { Record, BasicType } from '../models/record';
import { Storage, Index } from './storage';

type KnownKeys<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U } ? U : never

type StoreNames<DBTypes extends DBSchema | unknown> =
  DBTypes extends DBSchema ? KnownKeys<DBTypes> : string;

interface IdbSchema extends DBSchema {
    'transactions': {
        key: string;
        value: Record;
        indexes: { 'from': string; 'to': string };
    };
    'accounts': {
        key: string;
        value: Record;
    };
    'settings': {
        key: string;
        value: Record;
    };
}

class IDBIndex extends Index {
    storage: IndexedDbStorage;
    name: StoreNames<IdbSchema>;
    db: IDBPDatabase<IdbSchema>;
    keyPath: string = 'key';

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
        if (this.name === 'transactions' && typeof indexName !== 'undefined') {
            indexName = indexName as keyof IdbSchema['transactions']['indexes'];
            if (indexName in ['from', 'to']) {
                //@ts-ignore
                const records = await this.db.transaction(this.name).objectStore(this.name).index(indexName).getAll(q);
                return records[Symbol.iterator]();
            }
        }
        const records = await this.db.transaction(this.name).objectStore(this.name).getAll(q);
        return records[Symbol.iterator]();
    }
    async put(record: Record): Promise<string> {
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

        function upgrade(db: IDBPDatabase<IdbSchema>, oldVersion: number) {
            switch (oldVersion) {
                case 0: {
                    const txOS = db.createObjectStore('transactions', { keyPath: 'key' });
                    txOS.createIndex('from', 'data.from', { unique: false });
                    txOS.createIndex('to', 'data.to', { unique: false });
                    db.createObjectStore('accounts', { keyPath: 'key' });
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            }
        }

        this.db = await openDB<IdbSchema>(this.name, this.version, { upgrade });
        return this;
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