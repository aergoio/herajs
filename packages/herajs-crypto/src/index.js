import { ec } from 'elliptic';
import { AES_GCM } from 'asmcrypto.js';
import { fromNumber, encodeAddress, decodeAddress, encodePrivateKey, decodePrivateKey } from './encoding';
import 'regenerator-runtime/runtime';

const ecdsa = new ec('secp256k1');

/**
 * Shortcut function to create a new random private key and
 * return keys and address as encoded strings.
 */
const createIdentity = () => {
    const keyPair = ecdsa.genKeyPair();
    return encodeIdentity(keyPair);
};

/**
 * Returns identity associated with private key
 * @param {Uint8Array} privKeyBytes 
 */
const identifyFromPrivateKey = (privKeyBytes) => {
    const keyPair = ecdsa.keyFromPrivate(privKeyBytes);
    return encodeIdentity(keyPair);
};

/**
 * Encodes a key pair into an identity object
 * @param {KeyPair} keyPair 
 * @return {object}
 */
const encodeIdentity = (keyPair) => {
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

const decryptPrivateKey = (encryptedBytes, password) => {
    return new Promise((resolve) => {
        // Make a key from double hashing the password
        const hash = ecdsa.hash();
        hash.update(password);
        const addr = hash.digest();
        const rehash = ecdsa.hash();
        rehash.update(password);
        rehash.update(addr);
        const key = Buffer.from(rehash.digest());
        const nonce = Buffer.from(addr.slice(4, 16));
        resolve(AES_GCM.decrypt(encryptedBytes, key, nonce));
    });
};

const encodeSignature = (sig) => {
    return Buffer.from(sig.toDER()).toString('base64');
};

export {
    createIdentity,
    identifyFromPrivateKey,
    addressFromPublicKey,
    encodeAddress,
    decodeAddress,
    signTransaction,
    hashTransaction,
    verifySignature,
    decryptPrivateKey,
    encodePrivateKey,
    decodePrivateKey
};