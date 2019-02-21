import { BlockMetadata as GrpcBlockMetadata } from '../../types/rpc_pb';
import { BlockHeader } from './block';
export default class BlockMetadata {
    hash: string;
    header?: BlockHeader;
    txcount: number;
    constructor(data: Partial<BlockMetadata>);
    static fromGrpc(grpcObject: GrpcBlockMetadata): BlockMetadata;
    toGrpc(): void;
}
