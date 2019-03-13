import { Transaction, SignedTransaction } from './transaction';
import { Record, Data } from './record';
//import Tx from '@herajs/client/src/models/tx';
import { identifyFromPrivateKey, signTransaction } from '@herajs/crypto';
//import { Amount } from '@herajs/client';

export interface KeyData extends Data {
    address: string;
    privateKey: number[];
}

export class Key extends Record<KeyData> {
    private _keyPair?: any;

    async signTransaction(tx: Transaction): Promise<SignedTransaction> {
        if (typeof tx.txBody === 'undefined') {
            throw new Error('cannot sign transaction without txBody. Did you use prepareTransaction?');
        }
        const signature = await signTransaction({ ...tx.txBody }, this.keyPair);
        const signedTx = new SignedTransaction(tx.key, tx.data, { ...tx.txBody }, signature);
        signedTx.txBody.sign = signature;
        signedTx.txBody.hash = await signedTx.getHash();
        return signedTx;
    }

    get keyPair(): any {
        if (!this._keyPair) {
            const identity = identifyFromPrivateKey(Uint8Array.from(this.data.privateKey));
            this._keyPair = identity.keyPair;
        }
        return this._keyPair;
    }
}