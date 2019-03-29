/// <reference types="node" />
import JSBI from 'jsbi';
declare function hash(data: Buffer): string;
interface TxBody {
    nonce: number;
    from: string | Record<string, any>;
    chainIdHash: Uint8Array | string;
    amount?: string | number | JSBI | Record<string, any>;
    to?: null | string | Record<string, any>;
    payload?: null | Uint8Array;
    limit?: number;
    price?: string | number | JSBI | Record<string, any>;
    type?: number;
    sign?: string;
}
/**
 * Calculate hash of transaction
 * @param {object} tx Transaction
 * @return {string} transaction hash
 */
declare function hashTransaction(tx: TxBody): Promise<string>;
declare function hashTransaction(tx: TxBody, encoding: string, includeSign?: boolean): Promise<Buffer | string>;
declare function hashTransaction(tx: TxBody, encoding: 'base64', includeSign?: boolean): Promise<string>;
declare function hashTransaction(tx: TxBody, encoding: 'base58', includeSign?: boolean): Promise<string>;
declare function hashTransaction(tx: TxBody, encoding: 'bytes', includeSign?: boolean): Promise<Buffer>;
export { hash, hashTransaction, };
