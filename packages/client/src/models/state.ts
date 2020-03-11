import { State as GrpcState } from '../../types/blockchain_pb';
import { Amount } from '@herajs/common';

export default class State {
    nonce!: number;
    balance!: Amount;
    codehash!: string;
    storageroot!: string;
    sqlrecoverypoint!: number;

    constructor(data: Partial<State>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcState): State {
        return new State({
            nonce: grpcObject.getNonce(),
            balance: new Amount(grpcObject.getBalance_asU8()),
            codehash: grpcObject.getCodehash_asB64(),
            storageroot: grpcObject.getStorageroot_asB64(),
            sqlrecoverypoint: grpcObject.getSqlrecoverypoint()
        });
    }

    toGrpc(): never {
        throw new Error('not implemented');
    }
}