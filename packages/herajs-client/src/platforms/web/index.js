import AergoClient from '../../client';
import GrpcWebProvider from '../../providers/grpc-web';
import constants from '../../constants';

AergoClient.prototype.target = 'web';

AergoClient.prototype.defaultProvider = () => {
    return new GrpcWebProvider(); 
};

export { AergoClient, GrpcWebProvider, constants, AergoClient as default };
