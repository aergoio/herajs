import Provider from './base.js';
import { AergoRPCServiceClient } from '../../types/rpc_grpc_pb.js';
import grpc from 'grpc';

interface GrpcProviderConfig {
    url?: string;
}


/**
 * Provider for standard GRPC connections over HTTP2.
 * This is only compatible with Node.js environments.
 */
class GrpcProvider extends Provider {
    client: AergoRPCServiceClient;
    config: any;

    /**
     * .. code-block:: javascript
     * 
     *     import { GrpcProvider } from '@herajs/client';
     *     const provider = new GrpcProvider({url: 'localhost:7845'});
     * 
     * @param {GrpcProviderConfig} config
     */
    constructor(config: GrpcProviderConfig = {}) {
        super(config);
        this.client = new AergoRPCServiceClient(this.config.url, grpc.credentials.createInsecure()); 
    }

    get defaultConfig(): GrpcProviderConfig {
        return {
            url: 'localhost:7845'
        };
    }
}

export default GrpcProvider;
