import { SignedTx } from '../models/tx';
import { default as Event } from '../models/event';
import { default as Address } from '../models/address';
import { Amount } from '@herajs/common';
import ChainInfo from '../models/chaininfo';

export interface GetTxResult {
    block?: {
        hash: string;
        idx: number;
    };
    tx: SignedTx;
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
    events: Event[];
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

export interface BlockchainResult {
    bestBlockHash: string;
    bestHeight: number;
    consensusInfo: any;
    bestChainIdHash: string;
    chainInfo: ChainInfo;
}

export interface BlockBodyPaged {
    total: number;
    size: number;
    offset: number;
    body: {
        txsList: SignedTx[];
    };
}

export interface BatchTxResult {
    error?: string;
    hash?: string;
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