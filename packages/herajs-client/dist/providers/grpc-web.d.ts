interface GrpcWebProviderConfig {
    url?: string;
}
/**
 * Provider for GRPC-WEB connections over HTTP.
 * This is compatible with both Web browser and Node.js environments.
 * Note that the transport is considerably slower than over standard GRPC.
 */
declare class GrpcWebProvider {
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
    constructor(config?: GrpcWebProviderConfig);
    readonly defaultConfig: GrpcWebProviderConfig;
}
export default GrpcWebProvider;
