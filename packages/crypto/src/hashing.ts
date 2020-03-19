import { fromNumber, fromBigInt, decodeAddress } from './encoding';
import { encodeBuffer, decodeToBytes, ByteEncoding } from '@herajs/common';
import JSBI from 'jsbi';
import { Buffer } from 'buffer';
import { ecdsa } from './ecdsa';

function bufferOrB58(input?: Uint8Array | string): Uint8Array {
    if (typeof input === 'string') {
        return decodeToBytes(input, 'base58');
    }
    if (typeof input === 'undefined') {
        return new Uint8Array([]);
    }
    return input;
}

interface StringCovertible {
    toString(): string;
}

/**
 * Calculate hash of transaction
 * @param {object} tx Transaction
 * @return {Buffer} transaction hash
 */
export function hash(data: Buffer): Buffer {
    const h = ecdsa.hash();
    h.update(data);
    return Buffer.from(h.digest());
}

/**
 * Transaction body.
 * All fields except nonce, from, and chainIdHash are optional and will assume sensible defaults.
 */
export interface TxBody {
    nonce: number;
    from: string | StringCovertible;
    chainIdHash: Uint8Array | string;
    amount?: string | number | JSBI | StringCovertible;
    to?: null | string | StringCovertible;
    payload?: null | string | Uint8Array;
    limit?: number;
    price?: string | number | JSBI | StringCovertible;
    type?: number;
    sign?: string;
}

/**
 * Infer a tx type based on body. Can be overriden by exlicitly passing type.
 */
function inferType(tx: TxBody): number {
    if (!tx.to) {
        return 6;
    }
    if (`${tx.to}` === 'aergo.system' || `${tx.to}` === 'aergo.enterprise') {
        return 1;
    }
    return 0;
}

/**
 * Calculate hash of transaction
 * @param {object} tx Transaction
 * @param {ByteEncoding} encoding bytes (default), base58, base64
 * @return {Buffer | string} transaction hash. If encoding is bytes, the result is a Buffer, otherwise a string.
 */
export async function hashTransaction(tx: TxBody): Promise<string>;
export async function hashTransaction(tx: TxBody, encoding: ByteEncoding, includeSign?: boolean): Promise<string>;
export async function hashTransaction(tx: TxBody, encoding: 'bytes', includeSign?: boolean): Promise<Buffer>;
export async function hashTransaction(tx: TxBody, encoding: ByteEncoding | 'bytes' = 'base64', includeSign = true): Promise<Buffer | string> {
    // Amount defaults to zero if tx.amount is falsy
    let amount = '0';
    if (tx.amount) {
        const amountStr = tx.amount.toString().trim();
        if (amountStr !== '') {
            // Throw error if unit is given other than aer
            const amountUnit = amountStr.match(/\s*([^0-9]+)\s*/);
            if (amountUnit && amountUnit[1] !== 'aer') {
                throw Error(`Can only hash amounts provided in the base unit (aer), not '${tx.amount}'. Convert to aer or remove unit.`);
            }
            // Strip unit
            amount = amountStr.replace(/[^0-9]/g,'');
            // Throw error if amount is an empty string at this point (amount with unit but without value)
            if (amount === '') {
                throw Error(`Could not parse numeric value from amount '${tx.amount}'.`);
            }
        }
    }
    const type = typeof tx.type !== 'undefined' ? tx.type : inferType(tx);

    const items = [
        fromNumber(tx.nonce, 64/8),
        decodeAddress(tx.from.toString()),
        tx.to ? decodeAddress(tx.to.toString()) : Buffer.from([]),
        fromBigInt(amount!= '' ? amount : 0),
        tx.payload ? Buffer.from(tx.payload as any) : Buffer.from([]),
        fromNumber(tx.limit || 0, 64/8),
        fromBigInt(tx.price ? tx.price.toString() : 0),
        fromNumber(type, 32/8),
        bufferOrB58(tx.chainIdHash),
    ].map(item => Buffer.from(item));

    let data = Buffer.concat(items);

    if (includeSign && typeof tx.sign !== 'undefined') {
        data = Buffer.concat([data, Buffer.from(tx.sign, 'base64')]);
    }

    const result = hash(data);
    if (encoding === 'bytes') {
        return result;
    }
    return encodeBuffer(result, encoding);
}
