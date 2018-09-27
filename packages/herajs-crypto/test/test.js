import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import 'regenerator-runtime/runtime';

import {createIdentity, signTransaction, hashTransaction, verifySignature} from '../src';

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