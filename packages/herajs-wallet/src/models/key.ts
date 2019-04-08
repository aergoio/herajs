import { Transaction, SignedTransaction } from './transaction';
import { Record, Data } from './record';
//import Tx from '@herajs/client/src/models/tx';
import { identifyFromPrivateKey, decryptPrivateKey, signTransaction, signMessage } from '@herajs/crypto';
//import { Amount } from '@herajs/client';

export interface KeyData extends Data {
    address: string;
    privateKey: number[] | null;
    privateKeyEncrypted: number[] | null;
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

    async signMessage(message: Buffer, enc = 'hex') {
        return await signMessage(message, this.keyPair, enc);
    }

    unlock(passphrase?: string) {
        if (this.data.privateKey) return; // already unlocked
        if (!passphrase) throw new Error('unlock wallet before using key');
        if (!this.data.privateKeyEncrypted) throw new Error('missing encrypted private key');
        this.data.privateKey = Array.from(decryptPrivateKey(Uint8Array.from(this.data.privateKeyEncrypted), passphrase));
    }

    get keyPair(): any {
        if (!this._keyPair) {
            if (!this.data.privateKey) throw new Error('missing private key, did you forget to unlock?');
            const identity = identifyFromPrivateKey(Uint8Array.from(this.data.privateKey));
            this._keyPair = identity.keyPair;
        }
        return this._keyPair;
    }

    static fromRecord(record: Record<any>): Key {
        return new Key(record.key, record.data as KeyData);
    }
}