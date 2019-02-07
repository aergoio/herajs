import { ChainInfo as GrpcChainInfo } from '../../types/rpc_pb';
import Amount from './amount';

export type ChainId = {
    magic: string;
    public: Boolean;
    mainnet: Boolean;
    coinbasefee: Amount;
    consensus: string;
}

export default class ChainInfo {
    chainid?: ChainId;
    bpnumber: number;
    maxblocksize: number;
    maxtokens: Amount;
    stakingminimum: Amount;

    constructor(data: Partial<ChainInfo>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcChainInfo) {
        const chainid = grpcObject.getChainid();
        return new ChainInfo(<Partial<ChainInfo>>{
            chainid: {
                magic: chainid.getMagic(),
                public: chainid.getPublic(),
                mainnet: chainid.getMainnet(),
                coinbasefee: new Amount(chainid.getCoinbasefee_asU8()),
                consensus: chainid.getConsensus()
            },
            bpnumber: grpcObject.getBpnumber(),
            maxblocksize: grpcObject.getMaxblocksize(),
            maxtokens: new Amount(grpcObject.getMaxtokens_asU8()),
            stakingminimum: new Amount(grpcObject.getStakingminimum_asU8()),
        });
    }

    toGrpc() {
        throw new Error('Not implemented');
    }
}
