import Tx from '../models/tx';
import Block from '../models/block';
import BlockMetadata from '../models/blockmetadata';
import { AddressInput, default as Address } from '../models/address';
import Amount from '../models/amount';

export interface GetTxResult {
    block?: {
        hash: string;
        idx: number;
    }
    tx: Tx
}

export interface GetReceiptResult {
    contractaddress: Address;
    result: string;
    status: string;
    fee: Amount;
    cumulativefee: Amount;
    blockno: number;
    blockhash: string;
    feeDelegation: boolean;
    gasused: number;
}

export interface NameInfoResult {
    name: string;
    owner: Address;
    destination: Address;
}

export interface ConsensusInfoResult {
    type: string;
    info: object;
    bpsList: object[];
}

export interface ServerInfoResult {
    configMap: Map<string, Map<string, string>>;
    statusMap: Map<string, string>;
}

export interface BlockBodyPaged {
    total: number;
    size: number;
    offset: number;
    body: {
        txsList: Tx[]
    }
}

export interface Stream<T> {
    on(eventName: string, callback: ((obj: T) => void)): void;
    cancel(): void;
    _stream: any;
}

export type BasicType = number | string | boolean | null;
export interface JsonData {
    [prop: string]: BasicType | BasicType[] | JsonData[] | JsonData;
}