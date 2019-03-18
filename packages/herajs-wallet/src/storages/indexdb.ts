import { openDB, IDBPDatabase } from 'idb';
import { Record } from '../models/record';
import { Storage, Index } from './storage';

class IDBIndex extends Index {
    storage: IndexedDbStorage;
    name: string;
    db: IDBPDatabase;
    keyPath: string = 'key';

    constructor(storage: IndexedDbStorage, name: string) {
        super();
        this.storage = storage;
        this.name = name;
        if (typeof storage.db === 'undefined') {
            throw new Error('open storage before accessing index');
        }
        this.db = storage.db;
    }
    async get(key: string): Promise<Record> {
        return this.db.transaction(this.name).objectStore(this.name).get(key);
    }
    async getAll(query?: any, indexName?: string): Promise<IterableIterator<Record>> {
        if (indexName) {
            const records = await this.db.transaction(this.name).objectStore(this.name).index(indexName).getAll(query);
            return records[Symbol.iterator]();
        }
        const records = await this.db.transaction(this.name).objectStore(this.name).getAll(query);
        return records[Symbol.iterator]();
    }
    async put(data: Record): Promise<string> {
        const tx = this.db.transaction(this.name, 'readwrite');
        const validKey = await tx.objectStore(this.name).put({
            [this.keyPath]: data.key,
            data
        });
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
    db?: IDBPDatabase;
    indices: Map<string, IDBIndex> = new Map();

    constructor(name: string, version: number) {
        super();
        this.name = name;
        this.version = version;
    }
    async open(): Promise<this> {
        if (typeof this.db !== 'undefined') return this;

        function upgrade(db: IDBPDatabase, oldVersion: number) {
            switch (oldVersion) {
                case 0: {
                    const txOS = db.createObjectStore('tx', { keyPath: 'hash' });
                    txOS.createIndex('from', 'data.from', { unique: false });
                    txOS.createIndex('to', 'data.to', { unique: false });
                    db.createObjectStore('accounts', { keyPath: 'id' });
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            }
        }

        this.db = await openDB(this.name, this.version, { upgrade });
        return this;
        /*
        this.transactions = new Index(this.db, 'tx', 'hash');
        this.accounts = new Index(this.db, 'accounts', 'id');
        this.settings = new Index(this.db, 'settings', 'key');
        */
    }
    getIndex(name: string): IDBIndex {
        if (this.indices.has(name)) {
            return this.indices.get(name) as IDBIndex;
        }
        const index = new IDBIndex(this, name);
        this.indices.set(name, index);
        return index;
    }
}