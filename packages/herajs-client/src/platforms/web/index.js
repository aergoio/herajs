import AergoClient from '../../client';
import GrpcWebProvider from '../../providers/grpc-web';

AergoClient.prototype.target = 'web';

AergoClient.prototype.initProvider = () => {
    return new GrpcWebProvider(); 
};

export { GrpcWebProvider };
export default AergoClient;
