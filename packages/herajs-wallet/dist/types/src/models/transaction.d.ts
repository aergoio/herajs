import { Record, Data } from './record';
import { Address, Amount } from '@herajs/client';
declare enum Status {
    Pending = "pending",
    Confirmed = "confirmed",
    Error = "error",
    Timeout = "timeout"
}
interface TransactionData extends Data {
    chainId: string;
    from: string;
    to: string | null;
    hash: string | null;
    ts: string;
    blockhash: string | null;
    blockno: number | null;
    amount: string;
    type: number;
    status: Status;
}
export interface TxBody {
    hash?: string;
    nonce?: number;
    sign?: string;
    from: string | Address;
    to: string | Address | null;
    amount: string | number | Amount;
    payload: Uint8Array | null;
    chainIdHash: string | Uint8Array;
    type?: number;
    limit?: number;
    price?: string | Amount;
}
export declare class Transaction extends Record<TransactionData> {
    static readonly Status: typeof Status;
    txBody?: TxBody;
    private _unsignedHash?;
    constructor(key: string, data: TransactionData, txBody?: TxBody);
    readonly unsignedHash: string;
    /**
     * Calculate the hash excluding any signature
     */
    getUnsignedHash(): string;
    readonly amount: Amount;
}
export declare class SignedTransaction extends Transaction {
    private _signedHash?;
    signature: string;
    txBody: TxBody;
    constructor(key: string, data: TransactionData, txBody: TxBody, signature: string);
    readonly status: string;
    readonly isPending: boolean;
    readonly isConfirmed: boolean;
    readonly hash: string;
    /**
     * Calculate the hash, including all present body
     */
    getHash(): Promise<string>;
    static fromTxBody(txBody: TxBody, chainId: string): SignedTransaction;
}
export {};
