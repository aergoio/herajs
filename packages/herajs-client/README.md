# herajs - Javascript client framework for aergo

[![Travis_ci](https://travis-ci.org/aergoio/herajs.svg?branch=master)](https://travis-ci.org/aergoio/herajs)

Tested with aergo server version
[8a26a9c2dd1d8885280cceb8648dee601c6e6c19](https://github.com/aergoio/aergo/tree/8a26a9c2dd1d8885280cceb8648dee601c6e6c19)

This package supports both Node.js and Web platforms, but there is a difference in the handling of the GRPC connections. While the Node.js version uses the standard GRPC protocol over HTTP2, the Web version uses the GRPC-WEB extension, which wraps GRPC requests in standard HTTP requests. This results in the Node.js version having a significant performance advantage.

Roadmap:

- Publish on NPM
- Typescript support

## Usage

```console
npm install https://github.com/aergoio/herajs
```

You can import the module both as CommonJS (require) and ES module (import).

```javascript
import {AergoClient} from 'herajs';
let aergo = new AergoClient();
aergo.accounts.get().then((accounts) => {
    console.log(accounts);
});
```

Note that this by default imports the Node.js version which is not compatible with browsers. If you target web browsers, either `import {AergoClient} from 'herajs/dist/herajs.js';` or create an alias in your bundler configuration. An example of how to do this with Webpack will be provided shortly.

You can also directly import the pre-built bundle in HTML using `<script src="herajs/dist/herajs.min.js"></script>` and use the global `herajs` variable.

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
