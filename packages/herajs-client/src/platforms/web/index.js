import AergoClient from '../../client';
import GrpcWebProvider from '../../providers/grpc-web';
import constants from '../../constants';
import Contract from '../../models/contract';

AergoClient.prototype.target = 'web';

AergoClient.prototype.defaultProvider = () => {
    return new GrpcWebProvider(); 
};

export { AergoClient, GrpcWebProvider, constants, Contract, AergoClient as default };
