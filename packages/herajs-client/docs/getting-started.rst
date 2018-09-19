===============
Getting Started
===============

Quick start
-----------

.. code-block:: javascript

    import { AergoClient } from 'herajs';

    let aergo = new AergoClient();

    aergo.accounts.get().then((accounts) => {
        console.log(accounts);
    });

All async functions return standard promises, so you can also use them like this:

.. code-block:: javascript

    import { AergoClient } from 'herajs';

    let aergo = new AergoClient();

    async function update() {
        const blockchain = await aergo.blockchain();
        console.log(blockchain.bestHeight, blockchain.bestBlockHash);
        setTimeout(update, 1000);
    }
    update();

Setting a custom provider
-------------------------

.. code-block:: javascript

    import { AergoClient, GrpcProvider } from 'herajs';

    let aergo = new AergoClient({}, new GrpcProvider({url: 'localhost:7454'}));

    aergo.accounts.get().then((accounts) => {
        console.log(accounts);
    });