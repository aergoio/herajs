# Herajs Wallet SDK

This package includes everything you need to build a wallet application on Aergo.
It is useful for other kinds of dapps, too.

Features:

- Manage keys
- Easy to use interface for sending transactions
- Track accounts for new transactions (using a full node or other external APIs)
- Sign and verify
- Integrates with storages (supported out of the box: IndexedDB (for browsers), LevelDB (for Node.js), and in-memory storage)

In contrary to @herajs/client, which includes just the API client and useful classes and helpers,
@herajs/wallet includes managers that can keep, coordinate, and optionally persist state.

**Work in progress, please check back later for release**

## Getting started

Work in progress

## Development

Based on https://github.com/graup/rollup-typescript-babel

### Building the repo

```shell
npm run build
```

### Building only types

```shell
npm run build:types
```

### Type-Checking the repo

```shell
npm run type-check
```

And to run in --watch mode:

```shell
npm run type-check:watch
```
