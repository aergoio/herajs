/// <reference types="node" />
declare function hash(data: Buffer): string;
/**
 * Calculate hash of transaction
 * @param {object} tx Transaction
 * @return {string} transaction hash
 */
declare function hashTransaction(tx: Record<string, any>): Promise<string>;
declare function hashTransaction(tx: Record<string, any>, encoding: string, includeSign?: boolean): Promise<Buffer | string>;
declare function hashTransaction(tx: Record<string, any>, encoding: 'base64', includeSign?: boolean): Promise<string>;
declare function hashTransaction(tx: Record<string, any>, encoding: 'base58', includeSign?: boolean): Promise<string>;
declare function hashTransaction(tx: Record<string, any>, encoding: 'bytes', includeSign?: boolean): Promise<Buffer>;
export { hash, hashTransaction, };
