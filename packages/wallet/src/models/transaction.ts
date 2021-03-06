import { Record, Data } from './record';
import { Address, Amount } from '@herajs/common';
import { hashTransaction } from '@herajs/crypto';

enum Status {
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
    blockno: number | null;
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
    payload?: string | Uint8Array;
    chainIdHash: string | Uint8Array;
    type?: number;
    limit?: number;
    price?: string | Amount;
}
export type CompleteTxBody = TxBody & {
    nonce: number;
    sign: string;
    hash: string;
};

export class Transaction extends Record<TransactionData> {
    static readonly Status = Status;
    txBody?: CompleteTxBody;
    private _unsignedHash?: string;

    constructor(key: string, data: TransactionData, txBody?: CompleteTxBody) {
        super(key, data);
        this.txBody = txBody;
    }

    get unsignedHash(): string {
        if (typeof this._unsignedHash === 'undefined') throw new Error('transaction is missing hash, either supply or compute with getUnsignedHash()');
        return this._unsignedHash;
    }

    /**
     * Calculate the hash excluding any signature
     */
    async getUnsignedHash(): Promise<string> {
        if (typeof this.txBody === 'undefined') {
            throw new Error('cannot get hash without txBody');
        }
        if (typeof this.txBody.nonce !== 'number') {
            throw new Error('missing required parameter `nonce`');
        }
        const hash = await hashTransaction({ ...this.txBody, nonce: this.txBody.nonce || 0 }, 'base58');
        this._unsignedHash = hash;
        return hash;
    }

    get amount(): Amount {
        return new Amount(this.data.amount);
    }
}

export class SignedTransaction extends Transaction {
    private _signedHash?: string;
    signature: string;
    txBody!: CompleteTxBody;

    constructor(key: string, data: TransactionData, txBody: CompleteTxBody, signature: string) {
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
        if (typeof this.txBody.nonce !== 'number') {
            throw new Error('missing required parameter `nonce`');
        }
        const hash = await hashTransaction({ ...this.txBody, nonce: this.txBody.nonce || 0 }, 'base58');
        this._signedHash = hash;
        return hash;
    }

    static fromTxBody(txBody: CompleteTxBody, chainId: string): SignedTransaction {
        return new SignedTransaction(txBody.hash ? txBody.hash : '', {
            chainId,
            from: ''+txBody.from,
            to: ''+txBody.to,
            hash: ''+txBody.hash,
            ts: '',
            blockhash: null,
            blockno: null,
            amount: ''+txBody.amount,
            type: txBody.type ? txBody.type : 0,
            status: Transaction.Status.Confirmed,
        }, txBody, txBody.sign ? txBody.sign : '');
    }
}
