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
    signMessage, verifySignature,
    generateMnemonic, privateKeyFromMnemonic, privateKeyFromSeed, mnemonicToSeed,
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
    it('should default amount to 0 and treat falsy values as 0', async () => {
        const hashPromises = [];
        // These are all valid and treated like 0
        const amounts = ['0 aer', ' ', '0', 0, '', false, null, undefined];
        for (const amount of amounts) {
            const tx = {
                amount: amount as any,
                nonce: 1,
                from: '',
                chainIdHash: ''
            };
            hashPromises.push(hashTransaction(tx));
        }
        const hashes = await Promise.all(hashPromises);
        for (const [idx, hash] of hashes.entries()) {
            assert.equal(hash, hashes[0], `hash differs (idx: ${idx}, amount: ${amounts[idx]})`);
        }
    });
    it('should fail with invalid unit', async () => {
        // These are all invalid and throw 'invalid unit' error
        const amounts = ['100000 aergo', 'foo aergo', 'one aer', '123 whatever'];
        for (const amount of amounts) {
            const tx = {
                amount,
                nonce: 1,
                from: '',
                chainIdHash: ''
            };
            await assert.isRejected(hashTransaction(tx), Error, `Can only hash amounts provided in the base unit (aer), not '${amount}'. Convert to aer or remove unit.`);
        }
    });
    it('should fail with non-numeric amounts', async () => {
        // These are all invalid and throw 'invalid numeric value' error
        const amounts = ['aer', ' aer', '  aer  '];
        for (const amount of amounts) {
            const tx = {
                amount,
                nonce: 1,
                from: '',
                chainIdHash: ''
            };
            await assert.isRejected(hashTransaction(tx), Error, `Could not parse numeric value from amount '${amount}'.`);
        }
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
            payload: null,
            signature: '',
            hash: '',
            chainIdHash: 'foo'
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
    it('should verify generated tx signature using address', async () => {
        const identity = createIdentity();
        const msg = Buffer.from('hello');
        const signature = await signMessage(msg, identity.keyPair);
        const pubkey = publicKeyFromAddress(identity.address);
        assert.isTrue(await verifySignature(msg, pubkey, signature));
    });
    it('should verify given tx signature using address', async () => {
        const address = 'AmPWVmZj7AS6Rm4dyF7Dp7cXeujyxWH1e1a6HY5KYw5pCfm5B8GK';
        const msg = Buffer.from('hello');
        const signature = '30450220624ba49c48add697b8ce76d09111fa9f5f5a7c182626449b35259031f292470f022100ab8d1059d9addf281cc7b10cfe95cbe6b9244f418a46fd130796836e8ea35c25';
        const pubkey = publicKeyFromAddress(address);
        assert.isTrue(await verifySignature(msg, pubkey, signature, 'hex'));
    });
});

describe('seed', () => {
    it('should generate a mnemonic and create identity from it', async () => {
        const mnemonic = generateMnemonic();
        const privateKey = await privateKeyFromMnemonic(mnemonic);
        const identity = identifyFromPrivateKey(privateKey);
        assert.deepEqual(identity.privateKey, privateKey);
        assert.equal(identity.address[0], 'A');
    });
    it('should re-create identity from mnemonic', async () => {
        const mnemonic = 'raccoon agent nest round belt cloud first fancy awkward quantum valley scheme';
        const privateKey = await privateKeyFromMnemonic(mnemonic);
        const identity = identifyFromPrivateKey(privateKey);
        assert.equal(identity.address, 'AmPh2JQzWvQ5u8jCs4QTKGXvzkLE9uao1DfzxmTr71UczBsxHnqx');
    });
    it('should re-create identity from empty seed', async () => {
        const seed = Buffer.from([]);
        const privateKey = await privateKeyFromSeed(seed);
        const identity = identifyFromPrivateKey(privateKey);
        // This is the address corresponding to key generated from empty seed
        assert.equal(identity.address, 'AmQCPe9eoAkF1i1pcrpVmxKLNACXhGnuShZazySVVVfABz78e7XT');
    });
    it('should re-create identity from seed', async () => {
        const seed = await mnemonicToSeed('raccoon agent nest round belt cloud first fancy awkward quantum valley scheme');
        const seedExpected = Buffer.from('uxGJFRDao8WIWUkGCsJl4jo6f4SFlhjfJlVbuhVsCsuW3W+ViznXQCkIAoiPxkIkq5ctxf2X5kyN/FdX0V6MWg==', 'base64');
        assert.deepEqual(seed, seedExpected);
        const privateKey = await privateKeyFromSeed(seed);
        const identity = identifyFromPrivateKey(privateKey);
        assert.equal(identity.address, 'AmPh2JQzWvQ5u8jCs4QTKGXvzkLE9uao1DfzxmTr71UczBsxHnqx');
    });
});
