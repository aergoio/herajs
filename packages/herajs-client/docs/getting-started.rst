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

    let aergo = new AergoClient();

    aergo.blockchain().then((blockchainState) => {
        console.log(blockchainState.bestHeight, blockchainState.bestBlockHash);
    });

All async functions return standard promises, so you can also use them like this:

.. code-block:: javascript

    import { AergoClient } from '@herajs/client';

    let aergo = new AergoClient();

    async function update() {
        const blockchainState = await aergo.blockchain();
        console.log(blockchainState.bestHeight, blockchainState.bestBlockHash);
        setTimeout(update, 1000);
    }
    update();

Setting a custom provider
-------------------------

.. code-block:: javascript

    import { AergoClient, GrpcProvider } from '@herajs/client';

    let aergo = new AergoClient({}, new GrpcProvider({url: 'localhost:7454'}));

    aergo.accounts.get().then((accounts) => {
        console.log(accounts);
    });