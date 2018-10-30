# herajs - Javascript client framework for aergo

[![Travis_ci](https://travis-ci.org/aergoio/herajs.svg?branch=master)](https://travis-ci.org/aergoio/herajs)
[![npm](https://img.shields.io/npm/v/@herajs/client.svg)](https://www.npmjs.com/package/@herajs/client)

Tested with aergo server version
[88a324d7d585357e798b0b215ee8ef7c662848db](https://github.com/aergoio/aergo/tree/88a324d7d585357e798b0b215ee8ef7c662848db)

[Documentation](https://herajs.readthedocs.io/)

Javascript client SDK for AERGO blockchain.

This package supports both Node.js and Web platforms. Please refer to the documentation how to select the platform.

Roadmap:

- Improve documentation
- Official release
- Typescript support

## Quick start

```console
npm install @herajs/client
```

You can import the module both as CommonJS (require) and ES module (import).

```javascript
import AergoClient from '@herajs/client';
let aergo = new AergoClient();
aergo.blockchain().then(result => {
    console.log('Current state', result);
});
```

Note that this by default imports the Node.js version which is not compatible with browsers. If you target web browsers, either `import AergoClient from 'herajs/dist/herajs.js';` or create an alias in your bundler configuration. Many bundlers like Webpack automatically pick the browser version, so you don't need to configure anything.

You can also directly import the pre-built bundle in HTML using `<script src="herajs/dist/herajs.min.js"></script>` and use the global `herajs` variable.

## Contribute

### Setup

Clone this repository and run

```console
npm install
```

### Scripts

Run tests (requires a local Aergo node running in `--testmode`, listening on port `7845`).

```console
npm run test
```

Regenerate GRPC type definitions

```console
npm run grpc
```

Development build with auto-update

```console
npm run dev
```

Build all targets for distribution

```console
npm run build
```
