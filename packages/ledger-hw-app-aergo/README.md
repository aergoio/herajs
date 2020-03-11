# Ledger Hardware Wallet Aergo JavaScript bindings

[![npm](https://img.shields.io/npm/v/@herajs/ledger-hw-app-aergo.svg)](https://www.npmjs.com/package/@herajs/ledger-hw-app-aergo)

## How to use

```shell
npm install --save @herajs/ledger-hw-app-aergo
```

### Getting address and signing transaction

```js
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';
// Pick a transport. See https://github.com/LedgerHQ/ledgerjs
import Transport from '@ledgerhq/hw-transport-node-hid';
import AergoClient, { Tx } from '@herajs/client';

async () => {
    const aergo = new AergoClient();
    const transport = await Transport.create(3000, 1500);
    const app = new LedgerAppAergo(transport);
    const path = "m/44'/441'/0'/0/" + i;
    const address = await app.getWalletAddress(path);
    const tx = {
        from: address,
        to: address,
        chainIdHash: await aergo.getChainIdHash(),
        type: Tx.Type.TRANSFER,
        nonce: await aergo.getNonce(address) + 1,
        limit: 100000,
        nonce: 1,
    };
    const result = await app.signTransaction(tx); // { hash, signature }
    tx.sign = result.signature;
    tx.hash = await hashTransaction(tx, 'bytes');
    const txHash = await aergo.sendSignedTransaction(tx);
    const txReceipt = await aergo.waitForTransactionReceipt(txHash); // { status: 'SUCCESS', blockno: number, ... }
}()
```
