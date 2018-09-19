import AergoClient from '../../client';
import GrpcProvider from '../../providers/grpc';

AergoClient.prototype.target = 'node';

AergoClient.prototype.initProvider = () => {
    return new GrpcProvider(); 
};

export { GrpcProvider };
export default AergoClient;
