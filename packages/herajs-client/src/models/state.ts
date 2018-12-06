import { State as GrpcState } from '../../types/blockchain_pb';
import { fromHexString, toHexString } from '../utils';
import JSBI from 'jsbi';

export default class State {
    nonce: number;
    balance: JSBI;
    codehash: string;
    storageroot: string;
    sqlrecoverypoint: number;

    constructor(data: Partial<State>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcState) {
        return new State({
            nonce: grpcObject.getNonce(),
            balance: JSBI.BigInt('0x' + toHexString(grpcObject.getBalance_asU8())),
            codehash: grpcObject.getCodehash_asB64(),
            storageroot: grpcObject.getStorageroot_asB64(),
            sqlrecoverypoint: grpcObject.getSqlrecoverypoint()
            
        });
    }

    toGrpc() {
        throw new Error('not implemented');
    }
}