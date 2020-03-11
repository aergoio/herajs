/**
 * These tests need a Ledger Nano S with the Aergo app connected on USB.
 */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

const BIP44_ID = 441;
const WALLET_HDPATH = `m/44'/${BIP44_ID}'/0'/0/`;

import { hash, verifyTxSignature, publicKeyFromAddress, hashTransaction } from '@herajs/crypto';
import AergoClient, { Tx } from '@herajs/client';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import Transport from '@ledgerhq/hw-transport';
import LedgerAppAergo from '../src';
import { Buffer } from 'buffer';

let transport: Promise<Transport>;

async function getApp(): Promise<LedgerAppAergo> {
    if (!transport) {
        transport = TransportNodeHid.create(3000, 1500);
    }
    return transport.then(transport => new LedgerAppAergo(transport));
}

describe('getVersion()', () => {
    it('should return the version', async () => {
        const app = await getApp();
        const result = await app.getVersion();
        assert.typeOf(result.major, 'number');
    });
});

describe('getWalletAddress()', () => {
    it('should return an address for a BIP44 path', async () => {
        const app = await getApp();
        for (let i = 0; i < 2; i++) {
            const path = WALLET_HDPATH + i;
            const address = await app.getWalletAddress(path);
            // eslint-disable-next-line no-console
            console.log(path, address.toString());
        }
    }).timeout(10000);
});

async function signAndVerifyTx(app: LedgerAppAergo, txBody: any): Promise<boolean> {
    // eslint-disable-next-line no-console
    console.log('Accept transaction on device!');
    // Send request to Ledger
    const result = await app.signTransaction(txBody);
    // Check if it's valid
    const pubkey = publicKeyFromAddress(txBody.from);
    return await verifyTxSignature(txBody, pubkey, result.signature);
}

describe.skip('signTransaction()', () => {
    it('should reject too big transactions', async () => {
        const app = await getApp();
        const address = await app.getWalletAddress(WALLET_HDPATH + '0');
        await assert.isRejected(signAndVerifyTx(app, {
            from: address,
            to: address,
            chainIdHash: hash(Buffer.from('test')),
            type: Tx.Type.CALL,
            nonce: 1,
            limit: 555,
            payload: Buffer.alloc(250).fill(1),
        }));
    });
    it('should produce a valid transaction signature (type = TRANSFER)', async () => {
        const app = await getApp();
        const address = await app.getWalletAddress(WALLET_HDPATH + '0');
        assert.isTrue(await signAndVerifyTx(app, {
            from: address,
            to: address,
            amount: '1337 aer',
            chainIdHash: hash(Buffer.from('test')),
            type: Tx.Type.TRANSFER,
            nonce: 1,
            limit: 555,
        }));
    }).timeout(30000);
    it('should produce a valid transaction signature (type = CALL)', async () => {
        const app = await getApp();
        const address = await app.getWalletAddress(WALLET_HDPATH + '0');
        assert.isTrue(await signAndVerifyTx(app, {
            from: address,
            to: address,
            chainIdHash: hash(Buffer.from('test')),
            type: Tx.Type.CALL,
            nonce: 1,
            limit: 555,
            payload: JSON.stringify({
                Name: 'FunctionName',
                Args: [1, 2, 3],
            }),
        }));
    }).timeout(30000);
});

describe('sign and send', () => {
    const aergo = new AergoClient();
    it('should sign transaction and send to network', async () => {
        const app = await getApp();
        const address = await app.getWalletAddress(WALLET_HDPATH + '0');
        const tx = {
            from: address,
            to: address,
            amount: '1337 aer',
            chainIdHash: await aergo.getChainIdHash(),
            type: Tx.Type.TRANSFER,
            nonce: await aergo.getNonce(address) + 1,
            limit: 100000,
        } as any;
        const result = await app.signTransaction(tx);
        tx.sign = result.signature;
        // TODO: result.hash seems to be the signed message, not the finalized tx hash. Not very useful in this case.
        // Let's think about calculating the hash automatically in sendSignedTransaction if missing.
        // ATM, herajs/client does not depend on herajs/crypto. Maybe hashing should be in a 'common' package?
        // Could also move some utils there, like encoding and polling w exponential backoff.
        // For now, let's calculate the hash here
        tx.hash = await hashTransaction(tx, 'bytes');
        const txHash = await aergo.sendSignedTransaction(tx);
        const txReceipt = await aergo.waitForTransactionReceipt(txHash);
        assert.equal(txReceipt.status, 'SUCCESS');
    }).timeout(30000);
});