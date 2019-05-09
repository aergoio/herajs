import { AergoRPCServiceClient } from '../../types/rpc_grpc_pb';
import grpc from 'grpc';

interface GrpcProviderConfig {
    url?: string;
}

/**
 * Provider for standard GRPC connections over HTTP2.
 * This is only compatible with Node.js environments.
 */
class GrpcProvider {
    client: any;
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
        this.config = {
            ...this.defaultConfig,
            ...config
        };
        const urlScheme = this.config.url.match(/^([a-z0-9]+):\/\//);
        if (urlScheme) {
            throw new Error(`URL for GrpcProvider should be provided without scheme (not ${urlScheme[1]})`);
        }
        this.client = new AergoRPCServiceClient(this.config.url, grpc.credentials.createInsecure()); 
    }

    get defaultConfig(): GrpcProviderConfig {
        return {
            url: 'localhost:7845'
        };
    }
}

export default GrpcProvider;
