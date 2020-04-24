import Address from './address';
import { FilterInfo as GrpcFilterInfo } from '../../types/blockchain_pb';
import { PrimitiveType } from './contract';
import { Buffer } from 'buffer';

function isArgMap(obj: any): obj is Map<number | string, PrimitiveType> {
    return obj instanceof Map;
}

export default class FilterInfo {
    address!: Address | string;
    args?: PrimitiveType[] | Map<number | string, PrimitiveType>;
    eventName?: string;
    blockfrom?: number = 0;
    blockto?: number = 0;
    desc?: boolean = true;

    constructor(data: Partial<FilterInfo>) {
        Object.assign(this, data);
    }
    static fromGrpc(grpcObject: GrpcFilterInfo): FilterInfo {
        return new FilterInfo({
            args: JSON.parse(Buffer.from(grpcObject.getArgfilter_asU8()).toString()),
            address: new Address(grpcObject.getContractaddress_asU8()),
            eventName: grpcObject.getEventname(),
            blockfrom: grpcObject.getBlockfrom(),
            blockto: grpcObject.getBlockto(),
            desc: grpcObject.getDesc()
        });
    }
    toGrpc(): GrpcFilterInfo {
        const fi = new GrpcFilterInfo();
        fi.setContractaddress(new Address(this.address as any).asBytes());
        if (this.args) {
            // The RPC handler only understands maps, not simple arrays
            // The advantage of this is that you can query positional arguments directly
            // Herajs supports both, so pass args either as a Map([[idx, value]]) or 0-indexed array [value]
            let argsAsObj;
            const argsObj: Record<string, any> = {};
            if (isArgMap(this.args)) {
                argsAsObj = Array.from(this.args).reduce((obj, [idx, value]) => {
                    obj[''+idx] = value;
                    return obj;
                }, argsObj);
            } else {
                argsAsObj = this.args.reduce((obj, value, idx) => {
                    obj[''+idx] = value;
                    return obj;
                }, argsObj);
            }
            const argsAsJson = JSON.stringify(argsAsObj);
            fi.setArgfilter(Buffer.from(argsAsJson));
        }
        if (this.eventName) {
            fi.setEventname(this.eventName);
        }
        if (this.blockfrom) {
            fi.setBlockfrom(this.blockfrom);
        }
        if (this.blockto) {
            fi.setBlockto(this.blockto);
        }
        if (this.desc) {
            fi.setDesc(this.desc);
        }
        return fi;
    }
}
