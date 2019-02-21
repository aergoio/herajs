import Tx from './tx';
import { Block as GrpcBlock } from '../../types/blockchain_pb';
import Address from './address';
export declare type BlockHeader = {
    chainid: string;
    prevblockhash: string;
    blockno: number;
    timestamp: number;
    blocksroothash: string;
    txsroothash: string;
    receiptsroothash: string;
    confirms: number;
    pubkey: string;
    sign: Uint8Array | string;
    coinbaseaccount: Address;
};
export declare type BlockBody = {
    txsList: Tx[];
};
export default class Block {
    hash: string;
    header?: BlockHeader;
    body?: BlockBody;
    constructor(data: Partial<Block>);
    static fromGrpc(grpcObject: GrpcBlock): Block;
    toGrpc(): void;
    static encodeHash(bytes: Uint8Array): string;
    static decodeHash(bs58string: string): Uint8Array;
}
