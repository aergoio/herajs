export type BasicType = number | string | boolean | null;
export interface Data {
    [prop: string]: BasicType | BasicType[] | Data[] | Data;
}

/**
 * A Record is a basic object that only contains a key and data as primitive types, arrays, and objects.
 * The data field is serializable and should be compatabile with any kind of storage.
 * Sub-classes can add non-serializable fields.
 */
export class Record<T extends { [P in string]: unknown; } = Data> {
    key: string;
    data: T;

    /**
     * @param key database key of record
     * @param data data of record
     */
    constructor(key: string, data: T) {
        this.key = key;
        this.data = data;
    }
}