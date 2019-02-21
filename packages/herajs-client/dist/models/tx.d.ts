import { Tx as GrpcTx } from '../../types/blockchain_pb';
import Address from './address';
import Amount from './amount';
export default class Tx {
    hash: string;
    nonce: number;
    from: Address;
    to: Address;
    amount: Amount;
    payload: Uint8Array;
    sign: string;
    type: number;
    limit: number;
    price: Amount;
    constructor(data: Partial<Tx>);
    static fromGrpc(grpcObject: GrpcTx): Tx;
    toGrpc(): GrpcTx;
}
