import { Storage, Index } from './storage';
import { Record, BasicType } from '../models/record';
import { propPath } from '../utils';

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
        // leveldb keeps entries sorted by key, so we emulate this for compatability
        let entries = Array.from(this.data.entries()).sort((a, b) => a[0].localeCompare(b[0]));
        if (indexName && indexValue) {
            entries = entries.filter(
                ([, record]) => propPath(record.data, indexName) === indexValue
            );
        }
        return entries.map(entry => entry[1])[Symbol.iterator]();
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

/**
 * MemoryStorage is a storage interface compatabile with other LevelDB-like storages.
 * It is mostly used for testing. It is not very efficient.
 */
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