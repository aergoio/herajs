import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AergoClient from '../src';
import GrpcWebNodeProvider from '../src/providers/grpc-web-node';

describe('Aergo over grpc-web', () => {
    const provider = new GrpcWebNodeProvider({url: 'http://127.0.0.1:7845'});
    const aergo = new AergoClient({}, provider);

    describe('getChainInfo()', () => {
        it('should return basic chain information', async () => {
            const info = await aergo.getChainInfo();
            assert.equal(info.chainid.magic, 'dev.chain');
        });
    });
});
