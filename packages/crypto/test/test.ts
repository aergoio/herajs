import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { readFileSync } from 'fs';
import path from 'path';

import {
    createIdentity,
    signTransaction, hashTransaction,
    verifyTxSignature,
    identityFromPrivateKey,
    decryptPrivateKey, encryptPrivateKey,
    decodePrivateKey, encodePrivateKey,
    publicKeyFromAddress,
    signMessage, verifySignature,
    generateMnemonic, privateKeyFromMnemonic, privateKeyFromSeed, mnemonicToSeed,
    privateKeysFromSeed, privateKeysFromMnemonic, validateMnemonic,
    identityFromKeystore, keystoreFromPrivateKey,
    encodeAddress,
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
    it('should work with and without signature', async () => {
        const tx1 = {
            amount: '0 aer',
            nonce: 1,
            from: '',
            chainIdHash: ''
        };
        const tx2 = {
            ...tx1,
        };
        const tx3 = {
            ...tx1,
            sign: 'abc',
        };
        const hash1 = await hashTransaction(tx1);
        const hash2 = await hashTransaction(tx2);
        const hash3 = await hashTransaction(tx3);
        assert.equal(hash1, hash2);
        assert.notEqual(hash1, hash3);
    });
    it('should work with output encodings', async () => {
        const tx1 = {
            amount: '0 aer',
            nonce: 1,
            from: '',
            chainIdHash: '',
            type: 0,
        };
        const hash = await hashTransaction(tx1, 'base58');
        assert.equal(hash, 'AB1Y87LaQnYiFFbGYWoZhJiCdb12HMcphYFBakABzJvf');
        const hash2 = await hashTransaction(tx1, 'base64');
        assert.equal(hash2, 'iEmY32qR8n60KEYk/4xcNbxoiN3gs7uqAdK2MSQLjPQ=');
    });
});

describe('encodeAddress()', () => {
    it('should encode an address of bytes to a string', async () => {
        assert.equal(encodeAddress(Buffer.from('aergo.system')), 'aergo.system');
        const bytes = Buffer.from([3,64,29,129,69,88,16,141,82,148,3,236,147,113,52,102,159,118,142,46,225,55,161,16,172,231,54,159,208,19,69,22,73]);
        assert.equal(encodeAddress(bytes), 'AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX');
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
        const identity = identityFromPrivateKey(privKey);
        assert.equal(address, identity.address);
    });
    it('should import an encrypted, base58 encoded private key', async () => {
        const address = 'AmMAaH7EBHcjDTXzLFr5bZeBRrwRrZeLEa6xMTHWfHz9S8AKCP6Z';
        const encrypted = '47tZTi84VZeH6AjXnXDrhhoTKyVHfQWQFN6pf29wVYCvFBQWbrX94sbmWKcP1rMpkdUhQr3Ak';
        const password = 'test';
        const encryptedBytes = decodePrivateKey(encrypted);

        const decryptedBytes = await decryptPrivateKey(encryptedBytes, password);
        const identity = identityFromPrivateKey(decryptedBytes);
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
        const identityCheck = identityFromPrivateKey(decryptedBytes);
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
        const identity = identityFromPrivateKey(privateKey);
        assert.deepEqual(identity.privateKey, privateKey);
        assert.equal(identity.address[0], 'A');
    });

    // The following tests use a custom (old) BIP44 id
    const opts = { hdpath: 'm/44\'/442\'/0\'/0/' };
    it('should re-create identity from mnemonic', async () => {
        const mnemonic = 'raccoon agent nest round belt cloud first fancy awkward quantum valley scheme';
        const privateKey = await privateKeyFromMnemonic(mnemonic, opts);
        const identity = identityFromPrivateKey(privateKey);
        assert.equal(identity.address, 'AmPh2JQzWvQ5u8jCs4QTKGXvzkLE9uao1DfzxmTr71UczBsxHnqx');
    });
    it('should re-create identity from empty seed', async () => {
        const seed = Buffer.from([]);
        const privateKey = await privateKeyFromSeed(seed, opts);
        const [privateKey2] = await privateKeysFromSeed(seed, opts);
        assert.equal(privateKey.toString(), privateKey2.toString());
        const identity = identityFromPrivateKey(privateKey);
        // This is the address corresponding to key generated from empty seed
        assert.equal(identity.address, 'AmQCPe9eoAkF1i1pcrpVmxKLNACXhGnuShZazySVVVfABz78e7XT');

        // check with default config
        const [privateKeyB1] = await privateKeysFromSeed(seed);
        const [privateKeyB2] = await privateKeysFromSeed(seed, { count: 1 });
        assert.equal(privateKeyB1.toString(), privateKeyB2.toString());
    });
    it('should re-create identity from seed', async () => {
        const seed = await mnemonicToSeed('raccoon agent nest round belt cloud first fancy awkward quantum valley scheme');
        const seedExpected = Buffer.from('uxGJFRDao8WIWUkGCsJl4jo6f4SFlhjfJlVbuhVsCsuW3W+ViznXQCkIAoiPxkIkq5ctxf2X5kyN/FdX0V6MWg==', 'base64');
        assert.deepEqual(seed, seedExpected);
        const privateKey = await privateKeyFromSeed(seed, opts);
        const identity = identityFromPrivateKey(privateKey);
        assert.equal(identity.address, 'AmPh2JQzWvQ5u8jCs4QTKGXvzkLE9uao1DfzxmTr71UczBsxHnqx');
    });
    
    // Test using default BIP44 id
    it('should re-create identity from mnemonic', async () => {
        const mnemonic = 'dust sister misery any capital scrap country various quantum ocean pill around';
        const privateKey = await privateKeyFromMnemonic(mnemonic);
        const [privateKey2] = await privateKeysFromMnemonic(mnemonic);
        assert.equal(privateKey.toString(), privateKey2.toString());
        const identity = identityFromPrivateKey(privateKey);
        assert.equal(identity.address, 'AmMDKHZeSBHrJpNzGGcCQMaRRZMCn99BRB2kq9NHUuFjab7WvNkA');
    });

    it('should throw validation error', async () => {
        const mnemonic = 'dust sister misery any capital scrap country various quantum ocean pill around';
        const mnemonic2 = 'random random random random random random random random random random random random';

        assert.isTrue(validateMnemonic(mnemonic));
        assert.isFalse(validateMnemonic(mnemonic2));

        // Even if invalid, should still be usable
        await privateKeyFromMnemonic(mnemonic2);
    });
});

describe('keystore', () => {
    const fileContents = readFileSync(path.resolve(__dirname, 'AmM8Bspua3d1bACSzCaLUdstjooRLy1YqZ61Kk2nP4VfGTWJzDd6__keystore.txt')).toString();
    const keystoreFile = JSON.parse(fileContents);
    it('should parse a keystore file', async () => {
        // Decrypt
        const identity = await identityFromKeystore(keystoreFile, 'password');
        assert.equal(identity.address, 'AmM8Bspua3d1bACSzCaLUdstjooRLy1YqZ61Kk2nP4VfGTWJzDd6');
    });
    it('should generate a keystore file', async () => {
        const seed = Buffer.from([0, 1, 2, 3, 4]);
        const address = 'AmMaAqWeHAosWh2CPy2HAE3mWRjvYWjE6wKL7jgfb1yUQYyJXtWi';
        const privateKey = await privateKeyFromSeed(seed);

        // Encrypt
        const keystore = await keystoreFromPrivateKey(privateKey, 'password', { n: 1 << 10 });
        assert.equal(keystore.aergo_address, address);

        // Decrypt
        const identity = await identityFromKeystore(keystore, 'password');
        assert.equal(identity.address, address);
    });
    it('should throw with empty salt', async () => {
        const seed = Buffer.from([0, 1, 2, 3, 4]);
        const privateKey = await privateKeyFromSeed(seed);

        await assert.isRejected(
            keystoreFromPrivateKey(privateKey, 'password', {
                salt: '',
            }), 'missing required kdf parameter: salt');
    });
    it('should throw with missing or empty password', async () => {
        await assert.isRejected(identityFromKeystore(keystoreFile, undefined as any), 'missing required parameter: password');
        await assert.isRejected(identityFromKeystore(keystoreFile, ''), 'missing required parameter: password');
    });
    it('should throw with invalid mac', async () => {
        assert.isRejected(
            identityFromKeystore({
                ...keystoreFile,
                kdf: {
                    ...keystoreFile.kdf,
                    mac: '1111',
                },
            } as any, 'pw'), 'invalid mac value');
    });
    it('should throw with unsupported algorithm', async () => {
        await assert.isRejected(
            identityFromKeystore({
                ...keystoreFile,
                'ks_version': '0',
            } as any, 'pw'), 'unsupported keystore version: 0');
        await assert.isRejected(
            identityFromKeystore({
                ...keystoreFile,
                kdf: {
                    ...keystoreFile.kdf,
                    algorithm: 'KDF',
                },
            } as any, 'pw'), 'unsupported kdf algorithm: KDF');
        await assert.isRejected(
            identityFromKeystore({
                ...keystoreFile,
                cipher: {
                    ...keystoreFile.cipher,
                    algorithm: 'CIPHER',
                },
            } as any, 'pw'), 'unsupported encryption algorithm: CIPHER');
    });
});
