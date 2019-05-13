import { Wallet } from '@herajs/wallet';
import { GrpcWebProvider } from '@herajs/client';

export default {
    install (Vue, options) {
        const wallet = new Wallet();
        for (const chain of options.chains || []) {
            wallet.useChain({
                chainId: chain.chainId,
                provider: new GrpcWebProvider({ url: chain.nodeUrl })
            });
        }
        Vue.prototype.$aergo = wallet;
    }
};