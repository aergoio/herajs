//import Tx from '@herajs/client/src/models/tx';
//import { signTransaction, hashTransaction } from '@herajs/crypto';
import { Record, Data } from './record';
import { Address, Amount } from '@herajs/client';
import { hashTransaction } from '@herajs/crypto';

export enum Status {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Error = 'error',
    Timeout = 'timeout',
}

interface TransactionData extends Data {
    chainId: string;
    from: string;
    to: string | null;
    hash: string | null;
    ts: string;
    blockhash: string | null;
    amount: string;
    type: number;
    status: Status;
}

export interface TxBody {
    hash?: string;
    nonce?: number;
    sign?: string;
    from: string | Address;
    to: string | Address | null;
    amount: string | number | Amount;
    payload: Uint8Array | string | null;
    type?: number;
    limit?: number;
    price?: string | Amount;
}

export class Transaction extends Record<TransactionData> {
    static readonly Status = Status;
    txBody?: TxBody;
    private _unsignedHash?: string;

    constructor(key: string, data: TransactionData, txBody?: TxBody) {
        super(key, data);
        this.txBody = txBody;
    }

    get unsignedHash(): string {
        if (typeof this._unsignedHash === 'undefined') {
            this._unsignedHash = this.getUnsignedHash();
        }
        return this._unsignedHash;
    }

    /**
     * Calculate the hash excluding any signature
     */
    getUnsignedHash(): string {
        // TODO calc hash
        return '';
    }

    get amount(): Amount {
        return new Amount(this.data.amount);
    }
}

export class SignedTransaction extends Transaction {
    private _signedHash?: string;
    signature: string;
    txBody!: TxBody;

    constructor(key: string, data: TransactionData, txBody: TxBody, signature: string) {
        super(key, data);
        this.txBody = txBody;
        if (this.data.hash !== null) {
            this._signedHash = this.data.hash;
        }
        this.signature = signature;
    }

    get status(): string {
        return this.data.status;
    }

    get isPending(): boolean {
        return this.status === Transaction.Status.Pending;
    }

    get isConfirmed(): boolean {
        return this.status === Transaction.Status.Confirmed;
    }

    get hash(): string {
        if (typeof this._signedHash === 'undefined') throw new Error('transaction is missing hash, either supply or compute with getHash()');
        return this._signedHash;
    }

    /**
     * Calculate the hash, including all present body
     */
    async getHash(): Promise<string> {
        const hash = await hashTransaction({ ...this.txBody }, 'base58') as string;
        this._signedHash = hash;
        return hash;
    }
}
