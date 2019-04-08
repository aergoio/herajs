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
export declare class Account extends Record<AccountData> {
    readonly balance: Amount;
    readonly nonce: number;
    readonly address: Address;
}
