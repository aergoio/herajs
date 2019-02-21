interface GrpcProviderConfig {
    url?: string;
}
/**
 * Provider for standard GRPC connections over HTTP2.
 * This is only compatible with Node.js environments.
 */
declare class GrpcProvider {
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
    constructor(config?: GrpcProviderConfig);
    readonly defaultConfig: GrpcProviderConfig;
}
export default GrpcProvider;
