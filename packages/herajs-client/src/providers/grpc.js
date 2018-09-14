import Provider from './base.js';
import { AergoRPCServiceClient } from '../../types/rpc_grpc_pb.js';
import grpc from 'grpc';

class GrpcProvider extends Provider {
    constructor(config) {
        super(config);
        this.client = new AergoRPCServiceClient(this.config.url, grpc.credentials.createInsecure()); 
    }

    get defaultConfig() {
        return {
            url: 'localhost:7845'
        };
    }
}

export default GrpcProvider;
