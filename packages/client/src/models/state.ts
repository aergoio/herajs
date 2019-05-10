import { State as GrpcState } from '../../types/blockchain_pb';
import Amount from '../models/amount';


export default class State {
    nonce: number;
    balance: Amount;
    codehash: string;
    storageroot: string;
    sqlrecoverypoint: number;

    constructor(data: Partial<State>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcState) {
        return new State({
            nonce: grpcObject.getNonce(),
            balance: new Amount(grpcObject.getBalance_asU8()),
            codehash: grpcObject.getCodehash_asB64(),
            storageroot: grpcObject.getStorageroot_asB64(),
            sqlrecoverypoint: grpcObject.getSqlrecoverypoint()
        });
    }

    toGrpc() {
        throw new Error('not implemented');
    }
}