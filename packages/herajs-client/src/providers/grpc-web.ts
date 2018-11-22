import Provider from './base';
import { AergoRPCServiceClient } from '../../types/rpc_grpc_web_pb';
import { grpc } from 'grpc-web-client';

interface GrpcWebProviderConfig {
    url?: string;
}

/**
 * Provider for GRPC-WEB connections over HTTP.
 * This is compatible with both Web browser and Node.js environments.
 * Note that the transport is considerably slower than over standard GRPC.
 */
class GrpcWebProvider extends Provider {
    client: AergoRPCServiceClient;
    config: GrpcWebProviderConfig;

    /**
     * .. code-block:: javascript
     * 
     *     import { GrpcWebProvider } from '@herajs/client';
     *     const provider = new GrpcWebProvider({url: 'http://localhost:7845'});
     * 
     * @param {GrpcWebProviderConfig} config
     */
    constructor(config: GrpcWebProviderConfig = {}) {
        super(config);
        const options = {
            transport: grpc.WebsocketTransportFactory
        };
        this.client = new AergoRPCServiceClient(this.config.url, options);
    }

    get defaultConfig(): GrpcWebProviderConfig {
        return {
            url: 'http://localhost:7845'
        };
    }
}

export default GrpcWebProvider;
