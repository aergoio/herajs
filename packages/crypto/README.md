# Multi-purpose javascript crypto library for aergo

[![npm](https://img.shields.io/npm/v/@herajs/crypto.svg)](https://www.npmjs.com/package/@herajs/crypto) [![readthedocs](https://readthedocs.org/projects/herajscrypto/badge/)](https://herajscrypto.readthedocs.io/)

- [Documentation](https://herajscrypto.readthedocs.io/)

It is used by Aergo dapps to manage keys and sign transactions offline.

Features:

- Key generation and importing
- Hashing
- Signing
- Simple AES-GCM encryption


## How to use

```shell
npm install --save @herajs/crypto
```

### Transaction signing

```js
import { createIdentity, signTransaction, hashTransaction } from '@herajs/crypto';

async () => {
    const identity = createIdentity();
    const tx = {
        nonce: 1,
        from: identity.address,
        to: identity.address,
        amount: '100 aer',
        payload: '',
    };
    tx.sign = await signTransaction(tx, identity.keyPair);
    tx.hash = await hashTransaction(tx);
    console.log(JSON.stringify(tx));
}()
```

### Arbitrary message signing

```js
import { createIdentity, signMessage, verifySignature, publicKeyFromAddress } from '@herajs/crypto';

async () => {
    const identity = createIdentity();
    const msg = Buffer.from('hello');
    const signature = await signMessage(msg, identity.keyPair);
    const pubkey = publicKeyFromAddress(identity.address);
    const check = await verifySignature(msg, pubkey, signature);
    console.log(check);
}()
```