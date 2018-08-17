import AergoClient from '../../client';
import { AergoRPCServiceClient as NodeClient} from '../../../types/rpc_grpc_pb.js';
import grpc from 'grpc';

AergoClient.prototype.target = 'node';

AergoClient.prototype.initClient = (config) => {
    return new NodeClient(config.url, grpc.credentials.createInsecure()); 
};

export default AergoClient;
