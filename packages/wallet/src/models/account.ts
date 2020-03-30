
import { Address, Amount } from '@herajs/common';
import { Record, Data } from './record';

/**
 * Unique identifier of an account.
 * ChainId is optional. Managers use default chainId if undefined.
 */
export interface AccountSpec {
    address: string | Address;
    chainId?: string;
}

export interface CompleteAccountSpec {
    address: string | Address;
    chainId: string;
}

export type AccountType = '' | 'ledger';

export interface AccountData extends Data {
    spec: {
        address: string;
        chainId: string;
    };
    type: AccountType;
    derivationPath: string;
    privateKey: number[];
    publicKey: number[];
    balance: string;
    nonce: number;
    name: string;
    added: string | null;
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
    get type(): AccountType {
        return this.data.type || '';
    }

    static getDefaultData(extraData?: Partial<AccountData>): AccountData {
        return {
            spec: {
                chainId: '',
                address: '',
            },
            privateKey: [],
            publicKey: [],
            balance: '',
            nonce: 0,
            name: '',
            lastSync: null,
            derivationPath: '',
            type: '',
            added: new Date().toISOString(),
            ...extraData,
        };
    }
}
