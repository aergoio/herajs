
import { Address, Amount } from '@herajs/client';
import { Record, Data } from './record';

export interface AccountSpec {
    address: string | Address;
    chainId?: string;
}

export interface CompleteAccountSpec {
    address: string | Address;
    chainId: string;
}

export interface AccountData extends Data {
    spec: {
        address: string;
        chainId: string;
    };
    privateKey: number[];
    publicKey: number[];
    balance: string;
    nonce: number;
    name: string;
    lastSync: {
        blockno: number;
        timestamp: number;
    } | null;
}

export class Account extends Record<AccountData> {
    get balance(): Amount {
        return new Amount(this.data.balance);
    }
    get nonce(): number {
        return this.data.nonce;
    }
    get address(): Address {
        return new Address(this.data.spec.address);
    }
}
