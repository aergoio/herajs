import { Storage, Index } from './storage';
import { Record, BasicType } from '../models/record';
import { LevelUp } from 'levelup';
declare class LevelDbIndex extends Index {
    storage: LevelDbStorage;
    name: string;
    db: LevelUp;
    constructor(storage: LevelDbStorage, name: string);
    get(key: string): Promise<Record>;
    getAll(indexValue?: BasicType, indexName?: string): Promise<IterableIterator<Record>>;
    put(data: Record): Promise<string>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}
export default class LevelDbStorage extends Storage {
    name: string;
    version: number;
    indices: Map<string, LevelDbIndex>;
    db?: LevelUp;
    constructor(name: string, version: number);
    open(): Promise<this>;
    close(): Promise<void>;
    getIndex(name: string): LevelDbIndex;
}
export {};
