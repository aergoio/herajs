import { Storage, Index } from './storage';
import { Record, BasicType } from '../models/record';
import { LevelUp } from 'levelup';
import level from 'level';
import { propPath } from '../utils';

class LevelDbIndex extends Index {
    storage: LevelDbStorage;
    name: string;
    db: LevelUp;

    constructor(storage: LevelDbStorage, name: string) {
        super();
        this.storage = storage;
        this.name = name;
        this.db = level(`./herajs-${this.storage.name}-${this.name}.db`, { valueEncoding: 'json' });
    }
    async get(key: string): Promise<Record> {
        const record = await this.db.get(key);
        if (!record) throw new Error('not found');
        return record;
    }
    async getAll(indexValue?: BasicType, indexName?: string): Promise<IterableIterator<Record>> {
        return new Promise((resolve, reject) => {
            const results: Record[] = [];
            this.db.createReadStream()
                .on('data', (data) => {
                    if (indexName && indexValue) {
                        const propValue = propPath(data.value.data, indexName);
                        if (propValue && propValue !== indexValue) return;
                    }
                    results.push(data.value as Record);
                })
                .on('error', reject)
                .on('end', () => {
                    resolve(results[Symbol.iterator]());
                });
        });
    }
    async put(data: Record): Promise<string> {
        await this.db.put(data.key, data);
        return data.key;
    }
    async delete(key: string): Promise<void> {
        await this.db.del(key);
    }
    async clear(): Promise<void> {
        throw new Error('clear is not supported on leveldb');
    }
}

export default class LevelDbStorage extends Storage {
    name: string;
    version: number;
    indices: Map<string, LevelDbIndex> = new Map();
    db?: LevelUp;

    constructor(name: string, version: number) {
        super();
        this.name = name;
        this.version = version;
    }
    async open(): Promise<this> {
        return this;
    }
    async close(): Promise<void> {
        /*for (let index of this.indices.values()) {
            index.close();
        }*/
        //this.db && await this.db.close();
    }
    getIndex(name: string): LevelDbIndex {
        if (this.indices.has(name)) {
            return this.indices.get(name) as LevelDbIndex;
        }
        const index = new LevelDbIndex(this, name);
        this.indices.set(name, index);
        return index;
    }
}