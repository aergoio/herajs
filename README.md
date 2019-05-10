# herajs - Javascript SDK for aergo

[![Travis_ci](https://travis-ci.org/aergoio/herajs.svg?branch=master)](https://travis-ci.org/aergoio/herajs)

Tested with aergo server version
[1.0.2](https://github.com/aergoio/aergo/tree/v1.0.2)

[Documentation](https://herajs.readthedocs.io/)

Javascript client SDK for the Aergo blockchain platform.

- [@herajs/client](./packages/@herajs/client): API client, basic models/utils (contract, address, encoding, amounts)
- [@herajs/crypto](./packages/@herajs/crypto): key generation, hashing, signing
- [@herajs/wallet](./packages/@herajs/wallet): stateful key manager, account tracking, tx tracking, storage

## Contribute

### Setup

Clone this repository and run

```console
yarn
```

### Scripts

Run tests (requires a local Aergo node running in `--testmode`, listening on port `7845`).

```console
yarn test
```

Regenerate GRPC type definitions

```console
yarn run lerna run grpc --scope=@herajs/client
```
```console
yarn run build [--scope=@herajs/client]
```
