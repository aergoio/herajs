import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

const BIP44_ID = 441;
const WALLET_HDPATH = `m/44'/${BIP44_ID}'/0'/0/`;

import { hash } from '@herajs/crypto';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import Transport from '@ledgerhq/hw-transport';
import LedgerAppAergo from '../src';

let transport: Promise<Transport>;

async function getApp(): Promise<LedgerAppAergo> {
    if (!transport) {
        transport = TransportNodeHid.create(3000, 1500);
    }
    return transport.then(transport => new LedgerAppAergo(transport));
}

describe('getVersion()', () => {
    it('should return the version', async () => {
        const app = await getApp();
        const result = await app.getVersion();
        assert.typeOf(result.major, 'number');
    });
});

describe('getWalletAddress()', () => {
    it('should return an address for a BIP44 path', async () => {
        const app = await getApp();
        for (let i = 0; i < 2; i++) {
            const path = WALLET_HDPATH + i;
            const address = await app.getWalletAddress(path);
            console.log(path, address);
        }
    }).timeout(10000);
});

describe('signTransaction()', () => {
    it('should sign a transaction', async () => {
        const app = await getApp();
        const address = await app.getWalletAddress(WALLET_HDPATH + '0');
        const result = await app.signTransaction({
            from: address,
            to: address,
            amount: 1337,
            chainIdHash: hash(Buffer.from('test')),
            type: 4,
            nonce: 1,
            limit: 555,
        });
        console.log(result);
    }).timeout(10000);
});
