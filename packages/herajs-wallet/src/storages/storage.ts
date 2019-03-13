import { Record } from '../models/record';

export default abstract class Storage {
    abstract async get(key: string): Promise<Record>;
    abstract async put(record: Record): Promise<void>;
}