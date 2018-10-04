import AergoClient from '../../client';
import GrpcProvider from '../../providers/grpc';

AergoClient.prototype.target = 'node';

AergoClient.prototype.defaultProvider = () => {
    return new GrpcProvider(); 
};

export { AergoClient, GrpcProvider, AergoClient as default };
