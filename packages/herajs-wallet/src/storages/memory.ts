import { Storage, Index } from './storage';
import { Record } from '../models/record';

class MemoryIndex extends Index {
    storage: MemoryStorage;
    name: string;
    data: Map<string, Record> = new Map();

    constructor(storage: MemoryStorage, name: string) {
        super();
        this.storage = storage;
        this.name = name;
    }
    async get(key: string): Promise<Record> {
        const record = this.data.get(key);
        if (!record) throw new Error('not found');
        return record;
    }
    async getAll(/*query?: any, indexName?: string*/): Promise<IterableIterator<Record>> {
        return this.data.values();
        /*
        if (indexName) {
            return this.db.transaction(this.name).objectStore(this.name).index(indexName).getAll(query);
        }
        return this.db.transaction(this.name).objectStore(this.name).getAll(query);
        */
    }
    async put(data: Record): Promise<string> {
        this.data.set(data.key, data);
        return data.key;
        
    }
    async delete(key: string): Promise<void> {
        this.data.delete(key);
    }
    async clear(): Promise<void> {
        this.data.clear();
    }
}

export default class MemoryStorage extends Storage {
    name: string;
    version: number;
    indices: Map<string, MemoryIndex> = new Map();

    constructor(name: string, version: number) {
        super();
        this.name = name;
        this.version = version;
    }
    async open(): Promise<this> {
        return this;
    }
    getIndex(name: string): MemoryIndex {
        if (this.indices.has(name)) {
            return this.indices.get(name) as MemoryIndex;
        }
        const index = new MemoryIndex(this, name);
        this.indices.set(name, index);
        return index;
    }
}