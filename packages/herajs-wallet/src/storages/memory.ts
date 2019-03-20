import { Storage, Index } from './storage';
import { Record, BasicType } from '../models/record';

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
    async getAll(indexValue?: BasicType, indexName?: string): Promise<IterableIterator<Record>> {
        if (indexName && indexValue) {
            return Array.from(this.data.values()).reverse().filter(record => record.data[indexName] === indexValue)[Symbol.iterator]();
        }
        return this.data.values();
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
    async close(): Promise<void> {
        return;
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