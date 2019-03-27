import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import {
    createIdentity,
    signTransaction, hashTransaction,
    verifyTxSignature,
    identifyFromPrivateKey,
    decryptPrivateKey, encryptPrivateKey,
    decodePrivateKey, encodePrivateKey,
    publicKeyFromAddress,
    signMessage, verifySignature
} from '../src';

describe('createIdentity()', () => {
    it('should return a new identity', () => {
        const identity = createIdentity();
        assert.isTrue('address' in identity);
        assert.isTrue('privateKey' in identity);
        assert.isTrue('publicKey' in identity);
    });
});

describe('hashTransaction()', () => {
    it('should fail with invalid amount', async () => {
        const tx = {
            amount: '100000 aergo',
        };
        return assert.isRejected(hashTransaction(tx), Error, 'Can only hash amounts provided in the base unit (aer), not 100000 aergo. Convert to aer or remove unit.');
    });
});

describe('signTransaction()', () => {
    it('should sign a tx and verify a signature', async () => {
        const identity = createIdentity();
        const tx = {
            nonce: 1,
            from: identity.address,
            to: identity.address,
            amount: '100000 aer',
            payload: '',
            signature: '',
            hash: ''
        };
        tx.signature = await signTransaction(tx, identity.keyPair);
        tx.hash = await hashTransaction(tx);
        assert.isTrue(await verifyTxSignature(tx, identity.keyPair, tx.signature));
    });
});

describe('identifyFromPrivateKey', () => {
    it('should import a cleartext private key', () => {
        const address = 'AmMap16gd6dAkChr5yiDCLJ5vCqPvx1n6SqwFtkBhrBfUo3v4pnF';
        const privKey = Buffer.from([8,2,18,32,181,50,7,214,107,164,248,113,106,185,37,184,128,246,154,14,30,242,56,174,161,62,156,169,90,82,212,188,170,47,67,95]);
        const identity = identifyFromPrivateKey(privKey);
        assert.equal(address, identity.address);
    });
    it('should import an encrypted, base58 encoded private key', async () => {
        const address = 'AmMAaH7EBHcjDTXzLFr5bZeBRrwRrZeLEa6xMTHWfHz9S8AKCP6Z';
        const encrypted = '47tZTi84VZeH6AjXnXDrhhoTKyVHfQWQFN6pf29wVYCvFBQWbrX94sbmWKcP1rMpkdUhQr3Ak';
        const password = 'test';
        const encryptedBytes = decodePrivateKey(encrypted);

        const decryptedBytes = await decryptPrivateKey(encryptedBytes, password);
        const identity = identifyFromPrivateKey(decryptedBytes);
        assert.equal(address, identity.address);
    });
    it('should export a private key', async () => {
        const encrypted = '47tZTi84VZeH6AjXnXDrhhoTKyVHfQWQFN6pf29wVYCvFBQWbrX94sbmWKcP1rMpkdUhQr3Ak';
        const password = 'test';
        const encryptedBytes = decodePrivateKey(encrypted);

        const decryptedBytes = await decryptPrivateKey(encryptedBytes, password);

        const encryptedCheck = encodePrivateKey(await encryptPrivateKey(decryptedBytes, password));
        assert.equal(encrypted, encryptedCheck);
    });
    it('should export a new private key', async () => {
        const identity = createIdentity();
        const encKey = await encryptPrivateKey(identity.privateKey, 'pass');
        const privkey = encodePrivateKey(Buffer.from(encKey));
        const decryptedBytes = await decryptPrivateKey(decodePrivateKey(privkey), 'pass');
        const identityCheck = identifyFromPrivateKey(decryptedBytes);
        assert.equal(identity.address, identityCheck.address);
    });
});

describe('verifySignatureWithAddress', () => {
    it('should verify tx signature using address', async () => {
        const identity = createIdentity();
        const tx = {
            nonce: 1,
            from: identity.address,
            to: identity.address,
            amount: '100000 aer',
            payload: '',
        };
        const signature = await signTransaction(tx, identity.keyPair);

        const pubkey = publicKeyFromAddress(identity.address);
        assert.isTrue(await verifyTxSignature(tx, pubkey, signature));
    });
});

describe('message signing', () => {
    it('should verify tx signature using address', async () => {
        const identity = createIdentity();
        const msg = Buffer.from('hello');
        const signature = await signMessage(msg, identity.keyPair);
        const pubkey = publicKeyFromAddress(identity.address);
        assert.isTrue(await verifySignature(msg, pubkey, signature));
    });
});