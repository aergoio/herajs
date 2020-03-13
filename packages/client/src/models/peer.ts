import { base58 } from '@herajs/common';
import { Peer as GrpcPeer } from '../../types/rpc_pb';
import { PeerRole, PeerRoleMap } from '../../types/node_pb';
import Block from './block';

type RoleValue = PeerRoleMap[keyof PeerRoleMap];

export function keys<O>(o: O): (keyof O)[] {
    return Object.keys(o) as (keyof O)[];
}

export default class Peer {
    static readonly Role = PeerRole;

    acceptedrole!: RoleValue;

    constructor(data: Partial<Peer>) {
        Object.assign(this, data);
    }
    static fromGrpc(grpcObject: GrpcPeer): Peer {
        const obj: GrpcPeer.AsObject = grpcObject.toObject();
        const bestblock = grpcObject.getBestblock();
        if (bestblock && obj.bestblock) {
            obj.bestblock.blockhash = Block.encodeHash(bestblock.getBlockhash_asU8());
        }
        const address = grpcObject.getAddress();
        if (address) {
            // @ts-ignore
            obj.address = {
                ...obj.address,
                peerid: base58.encode(Buffer.from(address.getPeerid_asU8())),
            };
        }
        return new Peer(obj as Partial<Peer>);
    }
    get acceptedroleLabel(): string {
        const roles = Peer.Role;
        const key = keys(roles).find(key => roles[key] === this.acceptedrole);
        return key || '';
    }
    toGrpc(): never {
        throw new Error('Not implemented');
    }
}
