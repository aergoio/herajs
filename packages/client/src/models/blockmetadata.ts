import { BlockMetadata as GrpcBlockMetadata } from '../../types/rpc_pb';
import Address from './address';
import Block, { BlockHeader } from './block';
import { Buffer } from 'buffer';
import { Amount } from '@herajs/common';

export default class BlockMetadata {
    hash!: string;
    header!: BlockHeader;
    txcount!: number;
    size!: number;

    constructor(data: Partial<BlockMetadata>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcBlockMetadata): BlockMetadata {
        const obj = grpcObject.toObject();
        const header = grpcObject.getHeader();
        return new BlockMetadata({
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
            txcount: obj.txcount,
            size: obj.size,
        });
    }
    toGrpc(): never {
        throw new Error('Not implemented');
    }
    get voteReward(): Amount {
        return Block.getVoteReward(this);
    }
}
