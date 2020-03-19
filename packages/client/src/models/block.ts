import { SignedTx } from './tx';
import { Block as GrpcBlock } from '../../types/blockchain_pb';
import Address from './address';
import { Amount, base58 } from '@herajs/common';
import { Buffer } from 'buffer';

export interface BlockHeader {
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
    rewardaccount: Address;
}

export interface BlockBody {
    txsList: SignedTx[];
}

export default class Block {
    hash!: string;
    header!: BlockHeader;
    body!: BlockBody;

    constructor(data: Partial<Block>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcBlock): Block {
        const obj = grpcObject.toObject();
        let txsList: SignedTx[] = [];
        const body = grpcObject.getBody();
        if (obj.body && body) {
            txsList = body.getTxsList().map(tx => SignedTx.fromGrpc(tx)) as SignedTx[];
        }
        const header = grpcObject.getHeader();
        return new Block({
            hash: Block.encodeHash(grpcObject.getHash_asU8()),
            header: header ? {
                ...obj.header,
                blockno: header.getBlockno(),
                timestamp: header.getTimestamp(),
                confirms: header.getConfirms(),
                sign: header.getSign(),
                chainid: Buffer.from(header.getChainid_asU8()).toString('utf8'),
                prevblockhash: Block.encodeHash(header.getPrevblockhash_asU8()),
                blocksroothash: Block.encodeHash(header.getBlocksroothash_asU8()),
                txsroothash: Block.encodeHash(header.getTxsroothash_asU8()),
                receiptsroothash: Block.encodeHash(header.getReceiptsroothash_asU8()),
                coinbaseaccount: new Address(header.getCoinbaseaccount_asU8()),
                pubkey: Block.encodeHash(header.getPubkey_asU8()),
                rewardaccount: new Address(header.getConsensus_asU8()),
            } : undefined,
            body: {
                txsList,
            },
        });
    }
    toGrpc(): never {
        throw new Error('Not implemented');
    }
    static encodeHash(bytes: Uint8Array): string {
        return base58.encode(Buffer.from(bytes));
    }
    static decodeHash(bs58string: string): Uint8Array {
        return base58.decode(bs58string);
    }
    static getVoteReward(block: { header?: BlockHeader }): Amount {
        if (block.header && !block.header.rewardaccount.isEmpty()) {
            return new Amount('0.16 aergo');
        }
        return new Amount(0);
    }
    get voteReward(): Amount {
        return Block.getVoteReward(this);
    }
}
