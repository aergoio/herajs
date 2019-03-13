import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import 'regenerator-runtime/runtime';

import { Wallet } from '../src/wallet';

describe('Wallet: chain configuration', () => {
    it('uses default chain', () => {
        const wallet = new Wallet();
        assert.equal(wallet.defaultChainId, 'testnet.aergo.io');
    });
    it('uses first defined chain', () => {
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'foobarchain',
            nodeUrl: 'foobarchain.com:7845'
        });
        assert.equal(wallet.defaultChainId, 'foobarchain');
    });
    it('throws when using not defined chain', () => {
        const wallet = new Wallet();
        assert.throws(() => {
            wallet.setDefaultChain('not-configured');
        }, Error, 'configure chain not-configured using useChain() before setting it as default');
    });
    it('switches around default chains', () => {
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'foobarchain',
            nodeUrl: 'foobarchain.com:7845'
        });
        wallet.useChain({
            chainId: 'testnet.aergo.io',
            nodeUrl: 'testnet.aergo.io:7845'
        });
        assert.equal(wallet.defaultChainId, 'foobarchain');
        wallet.setDefaultChain('testnet.aergo.io');
        assert.equal(wallet.defaultChainId, 'testnet.aergo.io');

        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });
        wallet.setDefaultChain('testnet.localhost');
        assert.equal(wallet.defaultChainId, 'testnet.localhost');
    });
});
