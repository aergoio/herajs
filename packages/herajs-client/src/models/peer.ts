import bs58 from 'bs58';
import { Peer as GrpcPeer} from '../../types/rpc_pb';
import Block from './block';
import { Buffer } from 'buffer';

export default class Peer {
    constructor(data: Partial<Peer>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcPeer) {
        const obj: GrpcPeer.AsObject = grpcObject.toObject();
        const bestblock = grpcObject.getBestblock();
        if (bestblock) {
            obj.bestblock.blockhash = Block.encodeHash(bestblock.getBlockhash_asU8());
        }
        obj.address = {
            address: Buffer.from(grpcObject.getAddress().getAddress_asU8()),
            port: obj.address.port,
            peerid: bs58.encode(grpcObject.getAddress().getPeerid_asU8()),
        };
        return new Peer(<Partial<Peer>>obj);
    }
    toGrpc() {
        throw new Error('Not implemented');
    }
}
