import { IDBPDatabase, DBSchema } from 'idb';
import { Record, BasicType } from '../models/record';
import { Storage, Index } from './storage';
declare type KnownKeys<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {
    [_ in keyof T]: infer U;
} ? U : never;
declare type StoreNames<DBTypes extends DBSchema | unknown> = DBTypes extends DBSchema ? KnownKeys<DBTypes> : string;
interface IdbSchema extends DBSchema {
    'transactions': {
        key: string;
        value: Record;
        indexes: {
            'from': string;
            'to': string;
        };
    };
    'accounts': {
        key: string;
        value: Record;
        indexes: {
            'spec.address': string;
        };
    };
    'settings': {
        key: string;
        value: Record;
    };
    'keys': {
        key: string;
        value: Record;
    };
}
declare class IDBIndex extends Index {
    storage: IndexedDbStorage;
    name: StoreNames<IdbSchema>;
    db: IDBPDatabase<IdbSchema>;
    keyPath: string;
    constructor(storage: IndexedDbStorage, name: StoreNames<IdbSchema>);
    get(key: string): Promise<Record>;
    getAll(indexValue?: BasicType, indexName?: string): Promise<IterableIterator<Record>>;
    put(record: Record): Promise<string>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}
export default class IndexedDbStorage extends Storage {
    name: string;
    version: number;
    db?: IDBPDatabase<IdbSchema>;
    indices: Map<string, IDBIndex>;
    constructor(name: string, version: number);
    open(): Promise<this>;
    close(): Promise<void>;
    getIndex(name: StoreNames<IdbSchema>): IDBIndex;
}
export {};
