import AergoClient from '../../client';
import GrpcWebProvider from '../../providers/grpc-web';

AergoClient.prototype.target = 'web';

AergoClient.prototype.defaultProvider = () => {
    return new GrpcWebProvider(); 
};

export { AergoClient, GrpcWebProvider, AergoClient as default };
