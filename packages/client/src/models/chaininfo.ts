import { ChainInfo as GrpcChainInfo } from '../../types/rpc_pb';
import { Amount } from '@herajs/common';

export interface ChainId {
    magic: string;
    public: boolean;
    mainnet: boolean;
    consensus: string;
}

export default class ChainInfo {
    chainid!: ChainId;
    bpnumber!: number;
    maxblocksize!: number;
    maxtokens!: Amount;
    stakingminimum!: Amount;
    stakingtotal!: Amount;
    gasprice!: Amount;
    nameprice!: Amount;
    totalvotingpower!: Amount;
    votingreward!: Amount;

    constructor(data: Partial<ChainInfo>) {
        Object.assign(this, data);
    }

    static fromGrpc(grpcObject: GrpcChainInfo): ChainInfo {
        const chainid = grpcObject.getId();
        return new ChainInfo({
            chainid: chainid ? {
                magic: chainid.getMagic(),
                public: chainid.getPublic(),
                mainnet: chainid.getMainnet(),
                consensus: chainid.getConsensus()
            } : {
                magic: 'unknown', public: false, mainnet: false, consensus: 'unknown',
            },
            bpnumber: grpcObject.getBpnumber(),
            maxblocksize: grpcObject.getMaxblocksize(),
            maxtokens: new Amount(grpcObject.getMaxtokens_asU8()),
            stakingminimum: new Amount(grpcObject.getStakingminimum_asU8()),
            stakingtotal: new Amount(grpcObject.getTotalstaking_asU8()),
            gasprice: new Amount(grpcObject.getGasprice_asU8()),
            nameprice: new Amount(grpcObject.getNameprice_asU8()),
            totalvotingpower: new Amount(grpcObject.getTotalvotingpower_asU8()),
            votingreward: new Amount(grpcObject.getVotingreward_asU8()),
        });
    }

    toGrpc(): never {
        throw new Error('Not implemented');
    }
}
