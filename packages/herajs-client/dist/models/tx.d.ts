/// <reference types="node" />
import { Tx as GrpcTx } from '../../types/blockchain_pb';
import Address from './address';
export default class Tx {
    hash: string;
    nonce: number;
    from: Address;
    to: Address;
    amount: number;
    payload: Buffer;
    sign: Buffer;
    type: number;
    limit: number;
    price: number;
    constructor(data: Partial<Tx>);
    static fromGrpc(grpcObject: any): Tx;
    toGrpc(): GrpcTx;
}
