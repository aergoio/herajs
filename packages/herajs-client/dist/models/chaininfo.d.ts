import { ChainInfo as GrpcChainInfo } from '../../types/rpc_pb';
import Amount from './amount';
export declare type ChainId = {
    magic: string;
    public: Boolean;
    mainnet: Boolean;
    consensus: string;
};
export default class ChainInfo {
    chainid: ChainId;
    bpnumber: number;
    maxblocksize: number;
    maxtokens: Amount;
    stakingminimum: Amount;
    constructor(data: Partial<ChainInfo>);
    static fromGrpc(grpcObject: GrpcChainInfo): ChainInfo;
    toGrpc(): void;
}
