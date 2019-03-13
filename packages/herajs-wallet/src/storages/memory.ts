import Storage from './storage';
import { Record } from '../models/record';

interface Store {
    [key: string]: Record;
}

/**
 * A simple in-memory storage for testing
 */
export default class MemoryStorage extends Storage {
    _store: Store;

    constructor() {
        super();
        this._store = {};
    }
    async get(key: string): Promise<Record> {
        return this._store[key];
    }
    async put(record: Record) {
        this._store[record.key] = record;
    }
}