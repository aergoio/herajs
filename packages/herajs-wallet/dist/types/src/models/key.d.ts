import { Transaction, SignedTransaction } from './transaction';
import { Record, Data } from './record';
export interface KeyData extends Data {
    address: string;
    privateKey: number[] | null;
    privateKeyEncrypted: number[] | null;
}
export declare class Key extends Record<KeyData> {
    private _keyPair?;
    signTransaction(tx: Transaction): Promise<SignedTransaction>;
    signMessage(message: Buffer, enc?: string): Promise<string>;
    unlock(passphrase?: string): void;
    readonly keyPair: any;
    static fromRecord(record: Record<any>): Key;
}
