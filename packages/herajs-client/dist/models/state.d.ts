import { State as GrpcState } from '../../types/blockchain_pb';
import Amount from '../models/amount';
export default class State {
    nonce: number;
    balance: Amount;
    codehash: string;
    storageroot: string;
    sqlrecoverypoint: number;
    constructor(data: Partial<State>);
    static fromGrpc(grpcObject: GrpcState): State;
    toGrpc(): void;
}
