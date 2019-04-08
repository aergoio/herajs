import { Record, BasicType } from '../models/record';
export declare abstract class Index {
    abstract get(key: string): Promise<Record>;
    abstract getAll(indexValue?: BasicType, indexName?: string): Promise<IterableIterator<Record>>;
    abstract put(data: Record): Promise<string>;
    abstract delete(key: string): Promise<void>;
    abstract clear(): Promise<void>;
}
export declare abstract class Storage {
    abstract open(): Promise<this>;
    abstract close(): Promise<void>;
    abstract getIndex(name: string): Index;
}
