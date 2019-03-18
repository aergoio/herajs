import { Record, BasicType } from '../models/record';

export abstract class Index {
    abstract async get(key: string): Promise<Record>;
    abstract async getAll(indexValue?: BasicType, indexName?: string): Promise<IterableIterator<Record>>;
    abstract async put(data: Record): Promise<string>;
    abstract delete(key: string): Promise<void>;
    abstract clear(): Promise<void>;
}

export abstract class Storage {
    abstract async open(name: string, version: number): Promise<this>;
    abstract getIndex(name: string): Index;
}
