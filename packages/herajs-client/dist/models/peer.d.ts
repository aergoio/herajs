import { Peer as GrpcPeer } from '../../types/rpc_pb';
export default class Peer {
    constructor(data: Partial<Peer>);
    static fromGrpc(grpcObject: GrpcPeer): Peer;
    toGrpc(): void;
}
