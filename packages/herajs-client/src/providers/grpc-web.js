import Provider from './base.js';
import { AergoRPCServiceClient } from '../../types/web/rpc_pb_service.js';

class GrpcWebProvider extends Provider {
    constructor(config) {
        super(config);
        this.client = new AergoRPCServiceClient(this.config.url); 
    }

    get defaultConfig() {
        return {
            url: 'http://localhost:7845'
        };
    }
}

export default GrpcWebProvider;
