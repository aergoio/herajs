import AergoClient from '../../client';
import GrpcProvider from '../../providers/grpc';
import constants from '../../constants';
import Contract from '../../models/contract';

AergoClient.prototype.target = 'node';

AergoClient.prototype.defaultProvider = () => {
    return new GrpcProvider(); 
};

export { AergoClient, GrpcProvider, constants, Contract, AergoClient as default };
