===============
Getting Started
===============

Installation
------------

Herajs is available on NPM. You can install it using

.. code-block:: shell

    npm install --save @herajs/client

Quick start
-----------

.. code-block:: javascript

    import { AergoClient } from '@herajs/client';

    const aergo = new AergoClient();

    aergo.blockchain().then((blockchainState) => {
        console.log(blockchainState.bestHeight, blockchainState.bestBlockHash);
    });

All async functions return standard promises, so you can also use them like this:

.. code-block:: javascript

    import { AergoClient } from '@herajs/client';

    const aergo = new AergoClient();

    async function update() {
        const blockchainState = await aergo.blockchain();
        console.log(blockchainState.bestHeight, blockchainState.bestBlockHash);
        setTimeout(update, 1000);
    }
    update();

Supported platforms
-------------------

Herajs supports both Node.js and Web platforms. However, there is one major implementation difference that you should be aware of.

The Aergo API uses GRPC, which is designed around HTTP 2. Many of its performance advantages come from utilizing HTTP 2.
However, currently most browsers do not fully support this protocol. There is a standard called GRPC-WEB that gets around that limitation.

Node.js supports the plain GRPC standard, so that's what you should use in that case.
When you import herajs in Node.js environments, it will automatically pick up that implementation.

To use herajs in browser environments either explicitly ``import ... from '@herajs/client/dist/herajs.js'`` or create an alias in your bundler configuration.
Many bundlers like Webpack automatically pick the browser version, so you don't need to configure anything and can just ``import ... from '@herajs/client'``.

Setting a custom provider
-------------------------

By default, AergoClient attempts to connect to the network using a default provider.
On Node.js, that is a GRPC connection at localhost:7845. On Web, that is a GRPC-WEB connection at http://localhost:7845.

You can also set a provider manually. In this case, you should choose between GRPC and GRPC-WEB providers.

For Node.js:

.. code-block:: javascript

    import { AergoClient, GrpcProvider } from '@herajs/client';

    const aergo = new AergoClient({}, new GrpcProvider({url: 'localhost:12345'}));

For Web:

.. code-block:: javascript

    import { AergoClient, GrpcWebProvider } from '@herajs/client';

    const aergo = new AergoClient({}, new GrpcWebProvider({url: 'http://localhost:12345'}));

The web transport also supports https.