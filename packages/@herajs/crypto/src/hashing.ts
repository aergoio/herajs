import { ec } from 'elliptic';
import { fromNumber, fromBigInt, decodeAddress, encodeTxHash } from './encoding';
import bs58 from 'bs58';
import JSBI from 'jsbi';

const ecdsa = new ec('secp256k1');

function bufferOrB58(input?: Uint8Array | string): Uint8Array {
    if (typeof input === 'string') {
        return bs58.decode(input);
    }
    if (typeof input === 'undefined') {
        return new Uint8Array([]);
    }
    return input;
}

function hash(data: Buffer): string {
    const h = ecdsa.hash();
    h.update(data);
    return h.digest();
}

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
async function hashTransaction(tx: TxBody): Promise<string>;
async function hashTransaction(tx: TxBody, encoding: string, includeSign?: boolean): Promise<Buffer | string>;
async function hashTransaction(tx: TxBody, encoding: 'base64', includeSign?: boolean): Promise<string>;
async function hashTransaction(tx: TxBody, encoding: 'base58', includeSign?: boolean): Promise<string>;
async function hashTransaction(tx: TxBody, encoding: 'bytes', includeSign?: boolean): Promise<Buffer>;
async function hashTransaction(tx: TxBody, encoding = 'base64', includeSign = true): Promise<Buffer | string> {
    // check amount format
    tx.amount = '' + tx.amount;
    if (typeof tx.amount !== 'string') throw new Error(); // this is a type-hint for ts
    const amountUnit = tx.amount.match(/\s*([^0-9]+)\s*/);
    if (amountUnit && amountUnit[1] !== 'aer') {
        throw Error(`Can only hash amounts provided in the base unit (aer), not ${tx.amount}. Convert to aer or remove unit.`);
    }
    tx.amount = tx.amount.replace(/[^0-9]/g, '');

    const items = [
        fromNumber(tx.nonce, 64),
        decodeAddress(tx.from.toString()),
        tx.to ? decodeAddress(tx.to.toString()) : Buffer.from([]),
        fromBigInt(tx.amount ? tx.amount.toString() : 0),
        tx.payload ? Buffer.from(tx.payload) : Buffer.from([]),
        fromNumber(tx.limit || 0, 64),
        fromBigInt(tx.price ? tx.price.toString() : 0),
        fromNumber(tx.type || 0, 32),
        Buffer.from(bufferOrB58(tx.chainIdHash))
    ];

    let data = Buffer.concat(items.map(item => Buffer.from(item)));

    if (includeSign && typeof tx.sign !== 'undefined') {
        data = Buffer.concat([data, Buffer.from(tx.sign, 'base64')]);
    }

    const result = hash(data);

    if (encoding == 'base64') {
        return Buffer.from(result).toString('base64');
    } else if (encoding == 'base58') {
        return encodeTxHash(Buffer.from(result));
    } else {
        return result;
    }
}

export {
    hash,
    hashTransaction,
};