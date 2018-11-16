import { Block as GrpcBlock } from '../../types/blockchain_pb';
export default class Block {
    constructor(data: Partial<Block>);
    static fromGrpc(grpcObject: GrpcBlock): Block;
    toGrpc(): void;
    static encodeHash(bytes: any): any;
    static decodeHash(bs58string: any): any;
}
