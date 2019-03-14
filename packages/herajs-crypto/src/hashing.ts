import { ec } from 'elliptic';
import { fromNumber, fromBigInt, decodeAddress, encodeTxHash } from './encoding';

const ecdsa = new ec('secp256k1');

function hash(data: Buffer): string {
    const h = ecdsa.hash();
    h.update(data);
    return h.digest();
}

/**
 * Calculate hash of transaction
 * @param {object} tx Transaction
 * @return {string} transaction hash
 */
async function hashTransaction(tx: Record<string, any>): Promise<string>;
async function hashTransaction(tx: Record<string, any>, encoding: string, includeSign?: boolean): Promise<Buffer | string>;
async function hashTransaction(tx: Record<string, any>, encoding = 'base64', includeSign = true): Promise<Buffer | string> {
    // check amount format
    tx.amount = '' + tx.amount;
    const amountUnit = tx.amount.match(/\s*([^0-9]+)\s*/);
    if (amountUnit && amountUnit[1] !== 'aer') {
        throw Error(`Can only hash amounts provided in the base unit (aer), not ${tx.amount}. Convert to aer or remove unit.`);
    }
    tx.amount = tx.amount.replace(/[^0-9]/g, '');

    let data = Buffer.concat([
        fromNumber(tx.nonce, 64),
        decodeAddress(tx.from.toString()),
        tx.to ? decodeAddress(tx.to.toString()) : Buffer.from([]),
        fromBigInt(tx.amount || 0),
        Buffer.from(tx.payload),
        fromNumber(tx.limit, 64),
        fromBigInt(tx.price || 0),
        fromNumber(tx.type, 32)
    ]);

    if (includeSign && 'sign' in tx) {
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