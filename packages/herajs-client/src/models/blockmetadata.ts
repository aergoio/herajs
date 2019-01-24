import { BlockMetadata as GrpcBlockMetadata } from '../../types/rpc_pb';
import Address from './address';
import Block, { BlockHeader } from './block';
import { Buffer } from 'buffer';

export default class BlockMetadata {
    hash: string;
    header?: BlockHeader;
    txcount: number;

    constructor(data: Partial<BlockMetadata>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcBlockMetadata) {
        const obj = grpcObject.toObject();
        return new BlockMetadata(<Partial<BlockMetadata>>{
            hash: Block.encodeHash(grpcObject.getHash_asU8()),
            header: {
                ...obj.header,
                chainid: Buffer.from(grpcObject.getHeader().getChainid_asU8()).toString('utf8'),
                prevblockhash: Block.encodeHash(grpcObject.getHeader().getPrevblockhash_asU8()),
                coinbaseaccount: new Address(grpcObject.getHeader().getCoinbaseaccount_asU8()),
                pubkey: Block.encodeHash(grpcObject.getHeader().getPubkey_asU8()),
            },
            txcount: obj.txcount
        });
    }
    toGrpc() {
        throw new Error('Not implemented');
    }
}
