# herajs - Javascript client framework for aergo

[![Travis_ci](https://travis-ci.org/aergoio/herajs.svg?branch=master)](https://travis-ci.org/aergoio/herajs)

Tested with aergo server version
[672d2b8baebfde473bf163c94a9b6c85e9e82b5a](https://github.com/aergoio/aergo/tree/672d2b8baebfde473bf163c94a9b6c85e9e82b5a)

Supported platforms: Node.js

Roadmap:

- Continuous integration
- Publish on NPM
- Browser support
- Typescript support

## Usage

```console
npm install https://github.com/aergoio/herajs
```

You can import the module both as CommonJS (require) and ES module (import).

```javascript
import {Aergo} from herajs;
let aergo = new Aergo();
aergo.accounts.get().then((accounts) => {
    console.log(accounts);
});
```

## Development Setup

Clone this repository and run

```console
npm install
```

## Development Scripts

Run tests

```console
npm run test
```

Regenerate GRPC definitions

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