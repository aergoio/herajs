import Provider from './base.js';
import { AergoRPCServiceClient } from '../../types/web/rpc_pb_service.js';

/**
 * Provider for GRPC-WEB connections over HTTP.
 * This is compatible with both Web browser and Node.js environments.
 * Note that the transport is considerably slower than over standard GRPC.
 */
class GrpcWebProvider extends Provider {
    /**
     * .. code-block:: javascript
     * 
     *     import { GrpcWebProvider } from 'herajs';
     *     const provider = new GrpcWebProvider({url: 'http://localhost:7845'});
     * 
     * @param {object} config
     * @param {string} config.url URL to connect to (including http:// protocol)
     */
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
