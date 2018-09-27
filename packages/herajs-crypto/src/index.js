import bs58check from 'bs58check';
import { ec } from 'elliptic';
import { ADDRESS_PREFIXES } from './constants';
import { fromNumber } from './encoding';
import 'regenerator-runtime/runtime';

const ecdsa = new ec('secp256k1');

/**
 * Shortcut function to create a new random private key and
 * return keys and address as encoded strings.
 */
const createIdentity = () => {
    const keyPair = ecdsa.genKeyPair();
    const privateKey = keyPair.getPrivate();
    const publicKey = keyPair.getPublic();
    const address = addressFromPublicKey(publicKey);
    return {
        address,
        publicKey,
        privateKey,
        keyPair
    };
};

/**
 * 
 * @param {ECPoint} publicKey
 * @return {string} base58check encoded address
 */
const addressFromPublicKey = (publicKey) => {
    const len = publicKey.curve.p.byteLength();
    const x = publicKey.getX().toArray('be', len);
    const address = [ publicKey.getY().isEven() ? 0x02 : 0x03 ].concat(x);
    return encodeAddress(address);
};

/**
 * Encodes address form byte array to string.
 * @param {number[]} byteArray 
 * @param {string} address
 */
const encodeAddress = (byteArray) => {
    const buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT, ...byteArray]);
    return bs58check.encode(buf);
};

/**
 * Decodes address from string to byte array.
 * @param {string} address base58check encoded address 
 * @return {number[]} byte array
 */
const decodeAddress = (address) => {
    return bs58check.decode(address).slice(1);
};

/**
 * Sign transaction with key.
 * @param {object} tx transaction
 * @param {BN} key key pair or private key
 */
const signTransaction = (tx, key) => {
    return new Promise(async (resolve) => {
        const msgHash = await hashTransaction(tx, 'bytes', false);
        const sig = key.sign(msgHash);
        resolve(encodeSignature(sig));
    });
};

const verifySignature = (tx, key, signature) => {
    return new Promise(async (resolve) => {
        const sign = Buffer.from(signature, 'base64');
        resolve(key.verify(await hashTransaction(tx, 'bytes', false), sign));
    });
};

/**
 * Calculate hash of transaction
 * @param {object} tx Transaction
 * @return {string} transaction hash
 */
const hashTransaction = (tx, encoding = 'base64', includeSign = true) => {
    return new Promise((resolve) => {
        const h = ecdsa.hash();
        tx.type = 1;
        let data = Buffer.concat([
            fromNumber(tx.nonce, 64),
            decodeAddress(tx.from),
            decodeAddress(tx.to),
            fromNumber(tx.amount, 64),
            Buffer.from(tx.payload),
            fromNumber(tx.limit, 64),
            fromNumber(tx.price, 64),
            fromNumber(tx.type, 32)
        ]);

        if (includeSign && 'sign' in tx) {
            data = Buffer.concat([data, Buffer.from(tx.sign, 'base64')]);
        }

        h.update(data);

        if (encoding == 'base64') {
            resolve(Buffer.from(h.digest()).toString('base64'));
        } else {
            resolve(h.digest());
        }
    });
};

const encodeSignature = (sig) => {
    return Buffer.from(sig.toDER()).toString('base64');
};

export {
    createIdentity,
    addressFromPublicKey,
    encodeAddress,
    decodeAddress,
    signTransaction,
    hashTransaction,
    verifySignature
};