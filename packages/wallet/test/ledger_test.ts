import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import 'regenerator-runtime/runtime';

import { Wallet } from '../src/wallet';
import { TxTypes } from '@herajs/common';
import Transport from '@ledgerhq/hw-transport-node-hid';

let wallet: Wallet;
async function getWallet(): Promise<Wallet> {
    if (!wallet) {
        wallet = new Wallet();
        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '127.0.0.1:7845'
        });
        const transport = await Transport.create(3000, 1500);
        wallet.connectLedger(transport);
    }
    return wallet;
}

describe('Hardware Wallet support', async () => {
    if (process.env.CI) return; // This test can only be run locally
    
    it('gets address from Ledger', async () => {
        const wallet = await getWallet();
        const address = await wallet.accountManager.getAddressFromLedger('m/44\'/441\'/0\'/0/' + 1);
        assert.equal(address[0], 'A');
    });

    it('sends tx (loads key, builds and commits tx, gets status updates)', async () => {
        const wallet = await getWallet();
        const path = 'm/44\'/441\'/0\'/0/' + 1;
        const address = await wallet.accountManager.getAddressFromLedger(path);
        const accountSpec = { address };
        const account =  await wallet.accountManager.getOrAddAccount(accountSpec, { type: 'ledger', derivationPath: path });

        // Create another address to check that Ledger does not get confused
        const otherAddress = await wallet.accountManager.getAddressFromLedger('m/44\'/441\'/0\'/0/' + 2);
        const tx = {
            from: account.address,
            to: otherAddress,
            amount: '1 aergo',
            type: TxTypes.Transfer,
        };
        // eslint-disable-next-line no-console
        console.log('Confirm transaction on device...');
        const txTracker = await wallet.sendTransaction(account, tx);
        const receipt = await txTracker.getReceipt();
        assert.equal(receipt.status, 'SUCCESS');
    }).timeout(30000);
});