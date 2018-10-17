import AergoClient from '../../client';
import GrpcProvider from '../../providers/grpc';
import constants from '../../constants';

AergoClient.prototype.target = 'node';

AergoClient.prototype.defaultProvider = () => {
    return new GrpcProvider(); 
};

export { AergoClient, GrpcProvider, constants, AergoClient as default };
