import Tx from './tx';
import bs58 from 'bs58';
import { Block as GrpcBlock } from '../../types/blockchain_pb';
import Address from './address';
import Amount from './amount';
import { Buffer } from 'buffer';

export type BlockHeader = {
    chainid: string,
    prevblockhash: string,
    blockno: number,
    timestamp: number,
    blocksroothash: string,
    txsroothash: string,
    receiptsroothash: string,
    confirms: number,
    pubkey: string,
    sign: Uint8Array | string,
    coinbaseaccount: Address,
    rewardaccount: Address,
}

export type BlockBody = {
    txsList: Tx[];
}

export default class Block {
    hash: string;
    header?: BlockHeader;
    body?: BlockBody;

    constructor(data: Partial<Block>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcBlock) {
        const obj = grpcObject.toObject();
        let txsList: Tx[] = [];
        if (obj.body) {
            txsList = grpcObject.getBody().getTxsList().map(tx => Tx.fromGrpc(tx)) ;
        }
        return new Block(<Partial<Block>>{
            hash: Block.encodeHash(grpcObject.getHash_asU8()),
            header: {
                ...obj.header,
                chainid: Buffer.from(grpcObject.getHeader().getChainid_asU8()).toString('utf8'),
                prevblockhash: Block.encodeHash(grpcObject.getHeader().getPrevblockhash_asU8()),
                coinbaseaccount: new Address(grpcObject.getHeader().getCoinbaseaccount_asU8()),
                pubkey: Block.encodeHash(grpcObject.getHeader().getPubkey_asU8()),
                rewardaccount: new Address(grpcObject.getHeader().getConsensus_asU8()),
            },
            body: {
                txsList,
            },
        });
    }
    toGrpc() {
        throw new Error('Not implemented');
    }
    static encodeHash(bytes: Uint8Array): string {
        return bs58.encode(Buffer.from(bytes));
    }
    static decodeHash(bs58string: string): Uint8Array {
        return bs58.decode(bs58string);
    }
    static getVoteReward(block: Block): Amount {
        if (block.header && !block.header.rewardaccount.isEmpty()) {
            return new Amount('0.16 aergo');
        }
        return new Amount(0);
    }
    get voteReward() {
        return Block.getVoteReward(this);
    }
}
