# Multi-purpose javascript crypto library for aergo

It is used by herajs and the official wallet to manage keys and sign transactions offline.

## How to use

```shell
npm install --save herajs-crypto
```

```js
import { createIdentity, signTransaction, hashTransaction } from 'herajs-crypto';

async () => {
    const identity = createIdentity();
    const tx = {
        nonce: 1,
        from: identity.address,
        to: identity.address,
        amount: 100,
        payload: '',
    };
    tx.sign = await signTransaction(tx, identity.keyPair);
    tx.hash = await hashTransaction(tx);
    console.log(JSON.stringify(tx));
}()
```