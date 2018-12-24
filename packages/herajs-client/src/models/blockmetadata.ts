import bs58 from 'bs58';
import { BlockMetadata as GrpcBlockMetadata } from '../../types/rpc_pb';
import Address from './address';
import Block, { BlockHeader } from './block';

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
                pubkey: bs58.encode(grpcObject.getHeader().getPubkey_asU8()),
            },
            txcount: obj.txcount
        });
    }
    toGrpc() {
        throw new Error('Not implemented');
    }
}
