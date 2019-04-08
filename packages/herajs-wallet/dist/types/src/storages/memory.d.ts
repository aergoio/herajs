import { Storage, Index } from './storage';
import { Record, BasicType } from '../models/record';
declare class MemoryIndex extends Index {
    storage: MemoryStorage;
    name: string;
    data: Map<string, Record>;
    constructor(storage: MemoryStorage, name: string);
    get(key: string): Promise<Record>;
    getAll(indexValue?: BasicType, indexName?: string): Promise<IterableIterator<Record>>;
    put(data: Record): Promise<string>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}
export default class MemoryStorage extends Storage {
    name: string;
    version: number;
    indices: Map<string, MemoryIndex>;
    constructor(name: string, version: number);
    open(): Promise<this>;
    close(): Promise<void>;
    getIndex(name: string): MemoryIndex;
}
export {};
