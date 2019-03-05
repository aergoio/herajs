import Address from './address';
import { Event as GrpcEvent } from '../../types/blockchain_pb';
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
    constructor(data: Partial<Event>);
    static fromGrpc(grpcObject: GrpcEvent): Event;
    toGrpc(): void;
}
