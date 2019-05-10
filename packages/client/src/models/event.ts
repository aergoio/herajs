import Address from './address';
import Block from './block';
import { Event as GrpcEvent} from '../../types/blockchain_pb';
import { PrimitiveType } from './contract';

export default class Event {
    address: Address;
    args: Array<PrimitiveType>;
    eventName: string;
    eventidx: number;
    blockhash: string;
    txhash: string;
    blockno: number;
    txidx: number;

    constructor(data: Partial<Event>) {
        Object.assign(this, data);
        this.address = new Address(<any>this.address);
    }
    static fromGrpc(grpcObject: GrpcEvent) {
        return new Event({
            args: JSON.parse(grpcObject.getJsonargs()),
            address: new Address(grpcObject.getContractaddress_asU8()),
            eventName: grpcObject.getEventname(),
            blockhash: Block.encodeHash(grpcObject.getBlockhash_asU8()),
            txhash: Block.encodeHash(grpcObject.getTxhash_asU8()),
            txidx: grpcObject.getTxindex(),
            eventidx: grpcObject.getEventidx(),
            blockno: grpcObject.getBlockno(),
        });
    }
    toGrpc() {
        throw new Error('Not implemented');
    }
}
