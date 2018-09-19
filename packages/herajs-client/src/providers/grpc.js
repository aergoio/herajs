import Provider from './base.js';
import { AergoRPCServiceClient } from '../../types/rpc_grpc_pb.js';
import grpc from 'grpc';

/**
 * Provider for standard GRPC connections over HTTP2.
 * This is only compatible with Node.js environments.
 */
class GrpcProvider extends Provider {
    /**
     * .. code-block:: javascript
     * 
     *     import { GrpcProvider } from 'herajs';
     *     const provider = new GrpcProvider({url: 'localhost:7845'});
     * 
     * @param {object} config
     * @param {string} config.url URL to connect to (excluding protocol)
     */
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
