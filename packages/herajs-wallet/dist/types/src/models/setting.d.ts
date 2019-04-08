import { Record, Data } from './record';
export interface EncryptedIdData extends Data {
    value: number[];
}
export declare class EncryptedIdSetting extends Record<EncryptedIdData> {
}
