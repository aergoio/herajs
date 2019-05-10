import Address from './address';
import { FilterInfo as GrpcFilterInfo} from '../../types/blockchain_pb';
import { PrimitiveType } from './contract';
import { Buffer } from 'buffer';

function isArgMap(obj: any): obj is Map<number | string, PrimitiveType> {
    return obj instanceof Map;
}
  

export default class FilterInfo {
    address?: Address;
    args?: Array<PrimitiveType> | Map<number | string, PrimitiveType>;
    eventName?: string;
    blockfrom?: number = 0;
    blockto?: number = 0;
    desc?: boolean = true;

    constructor(data: Partial<FilterInfo>) {
        Object.assign(this, data);
        this.address = new Address(<any>this.address);
    }
    static fromGrpc(grpcObject: GrpcFilterInfo) {
        return new FilterInfo({
            args: JSON.parse(Buffer.from(grpcObject.getArgfilter_asU8()).toString()),
            address: new Address(grpcObject.getContractaddress_asU8()),
            eventName: grpcObject.getEventname(),
            blockfrom: grpcObject.getBlockfrom(),
            blockto: grpcObject.getBlockto(),
            desc: grpcObject.getDesc()
        });
    }
    toGrpc() {
        const fi = new GrpcFilterInfo();
        fi.setContractaddress(this.address.asBytes());
        if (this.args) {
            // The RPC handler only understands maps, not simple arrays
            // The advantage of this is that you can query positional arguments directly
            // Herajs supports both, so pass args either as a Map([[idx, value]]) or 0-indexes array [value]
            let argsAsObj;
            if (isArgMap(this.args)) {
                argsAsObj = Array.from(this.args).reduce((obj, [idx, value]) => {
                    obj[''+idx] = value;
                    return obj;
                }, {});
            } else {
                argsAsObj = this.args.reduce((obj, value, idx) => {
                    obj[''+idx] = value;
                    return obj;
                }, {});
            }
            const argsAsJson = JSON.stringify(argsAsObj);
            fi.setArgfilter(Buffer.from(argsAsJson));
        }
        if (this.eventName) {
            fi.setEventname(this.eventName);
        }
        fi.setBlockfrom(this.blockfrom);
        fi.setBlockto(this.blockto);
        fi.setDesc(this.desc);
        return fi;
    }
}
