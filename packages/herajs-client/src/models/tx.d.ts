/// <reference types="node" />
import { Tx as GrpcTx } from '../../types/blockchain_pb';
import Address from './address.js';
import BaseModel from './base.js';
export default class Tx extends BaseModel {
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
    static fromGrpc(grpcObject: any): Tx;
    toGrpc(): GrpcTx;
}
