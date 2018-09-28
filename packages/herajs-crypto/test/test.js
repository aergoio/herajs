import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import 'regenerator-runtime/runtime';

import {createIdentity, signTransaction, hashTransaction, verifySignature, identifyFromPrivateKey, decryptPrivateKey, decodePrivateKey} from '../src';


describe('createIdentity()', () => {
    it('should return a new identity', () => {
        const identity = createIdentity();
        //console.log(identity);
        assert.isTrue('address' in identity);
        assert.isTrue('privateKey' in identity);
        assert.isTrue('publicKey' in identity);
    });
});

describe('signTransaction()', () => {
    it('should sign a tx and verify a signature', async () => {
        const identity = createIdentity();
        const tx = {
            nonce: 1,
            from: identity.address,
            to: identity.address,
            amount: 100,
            payload: '',
        };
        tx.signature = await signTransaction(tx, identity.keyPair);
        tx.hash = await hashTransaction(tx);

        //console.log(JSON.stringify(tx));

        const verify = await verifySignature(tx, identity.keyPair, tx.signature);
        assert.isTrue(verify);
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
});