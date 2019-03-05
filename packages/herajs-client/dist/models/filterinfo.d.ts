import Address from './address';
import { FilterInfo as GrpcFilterInfo } from '../../types/blockchain_pb';
import { PrimitiveType } from './contract';
export default class FilterInfo {
    address?: Address;
    args?: Array<PrimitiveType> | Map<number | string, PrimitiveType>;
    eventName?: string;
    blockfrom?: number;
    blockto?: number;
    desc?: boolean;
    constructor(data: Partial<FilterInfo>);
    static fromGrpc(grpcObject: GrpcFilterInfo): FilterInfo;
    toGrpc(): GrpcFilterInfo;
}
