interface GrpcWebProviderConfig {
    url?: string;
}
/**
 * Provider for GRPC-WEB connections over HTTP.
 * This is compatible with Node.js environments.
 * Streaming methods are not supported.
 * This is mostly for testing, for productiomn use use GrpcWebProvider or GrpcProvider.
 */
declare class GrpcWebNodeProvider {
    client: any;
    config: GrpcWebProviderConfig;
    /**
     * .. code-block:: javascript
     *
     *     import { GrpcWebNodeProvider } from '@herajs/client';
     *     const provider = new GrpcWebProvider({url: 'http://localhost:7845'});
     *
     * @param {GrpcWebProviderConfig} config
     */
    constructor(config?: GrpcWebProviderConfig);
    readonly defaultConfig: GrpcWebProviderConfig;
}
export default GrpcWebNodeProvider;
