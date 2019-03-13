export type BasicType = number | string | boolean | null;
export interface Data {
    [prop: string]: BasicType | BasicType[] | Data[] | Data;
}

/**
 * A Record is a basic object that only contains primitive types, arrays, and objects.
 * The data field is serializable and should be compatabile with any kind of storage.
 * Sub-classes can add non-serializable fields.
 */
export class Record<T = Data> {
    key: string;
    data: T;

    constructor(key: string, data: T) {
        this.key = key;
        this.data = data;
    }
}