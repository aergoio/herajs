import { AergoRPCServiceClient } from '../../types/rpc_grpc_web_pb';
import { grpc } from "@improbable-eng/grpc-web";

interface GrpcWebProviderConfig {
    url?: string;
}

/**
 * Provider for GRPC-WEB connections over HTTP.
 * This is compatible with Web browsers.
 * Note that the transport is considerably slower than over standard GRPC.
 */
class GrpcWebProvider {
    client: any;
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
        this.config = {
            ...this.defaultConfig,
            ...config
        };
        const options = {
            transport: grpc.WebsocketTransport()
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
