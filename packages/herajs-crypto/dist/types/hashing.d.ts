/// <reference types="node" />
declare function hash(data: Buffer): string;
/**
 * Calculate hash of transaction
 * @param {object} tx Transaction
 * @return {string} transaction hash
 */
declare function hashTransaction(tx: Record<string, any>): Promise<string>;
declare function hashTransaction(tx: Record<string, any>, encoding: string, includeSign?: boolean): Promise<Buffer | string>;
export { hash, hashTransaction, };
