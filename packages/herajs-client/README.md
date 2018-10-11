# herajs - Javascript client framework for aergo

[![Travis_ci](https://travis-ci.org/aergoio/herajs.svg?branch=master)](https://travis-ci.org/aergoio/herajs)

Tested with aergo server version
[32d37d55df72eb0a46f510b3225dbaff8b7ce65d](https://github.com/aergoio/aergo/tree/32d37d55df72eb0a46f510b3225dbaff8b7ce65d)

[Documentation](https://herajs.readthedocs.io/)

Javascript client SDK for AERGO blockchain.

This package supports both Node.js and Web platforms. Please refer to the documentation how to select the platform.

Roadmap:

- Improve documentation
- Publish on NPM
- Typescript support

## Quick start

```console
npm install https://github.com/aergoio/herajs
```

You can import the module both as CommonJS (require) and ES module (import).

```javascript
import AergoClient from 'herajs';
let aergo = new AergoClient();
aergo.accounts.get().then((accounts) => {
    console.log(accounts);
});
```

Note that this by default imports the Node.js version which is not compatible with browsers. If you target web browsers, either `import {AergoClient} from 'herajs/dist/herajs.js';` or create an alias in your bundler configuration. Webpack automatically picks the browser version, so you don't need to configure anything.

You can also directly import the pre-built bundle in HTML using `<script src="herajs/dist/herajs.min.js"></script>` and use the global `herajs` variable.

## Contribute

### Setup

Clone this repository and run

```console
npm install
```

### Scripts

Run tests

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
