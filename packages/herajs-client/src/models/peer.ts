import { Peer as GrpcPeer} from '../../types/rpc_pb';
import Block from './block';

export default class Peer {
    constructor(data: Partial<Peer>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcPeer) {
        const obj: GrpcPeer.AsObject = grpcObject.toObject();
        obj.bestblock.blockhash = Block.encodeHash(grpcObject.getBestblock().getBlockhash_asU8());
        return new Peer(<Partial<Peer>>obj);
    }
    toGrpc() {
        throw new Error('Not implemented');
    }
}
