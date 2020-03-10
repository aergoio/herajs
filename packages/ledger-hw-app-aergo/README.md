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

async () => {
    const transport = await Transport.create(3000, 1500);
    const app = new LedgerAppAergo(transport);
    const path = "m/44'/441'/0'/0/" + i;
    const address = await app.getWalletAddress(path);
    const result = await app.signTransaction({
        from: address,
        to: address,
        chainIdHash: hash(Buffer.from('test')), // TODO: insert real hash
        type: Tx.Type.CALL,
        nonce: 1,
    }); // { hash, signature }
    // TODO Send to network
}()
```
