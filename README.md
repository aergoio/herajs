# herajs - Javascript SDK for aergo

[![CI Status](https://github.com/aergoio/herajs/workflows/Build%20CI/badge.svg)](https://github.com/aergoio/herajs/actions)

Tested with aergo server version 1.3 - 2.0.

[Documentation](https://herajs.readthedocs.io/)

Javascript client SDK for the Aergo blockchain platform.

- [@herajs/client](./packages/client): API client, basic models/utils (contract, address, encoding, amounts)
- [@herajs/crypto](./packages/crypto): key generation, hashing, signing
- [@herajs/wallet](./packages/wallet): stateful key manager, account tracking, tx tracking, storage

## Contribute

### Setup

Clone this repository and run

```console
yarn
```

### Scripts

Run tests (requires a local Aergo node running in `--testmode`, listening on port `7845`).

```console
yarn build
```
```console
yarn test
```

Regenerate GRPC type definitions

```console
yarn lerna run grpc --scope=@herajs/client
```
```console
yarn build [--scope=@herajs/client]
```
