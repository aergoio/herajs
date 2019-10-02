===============
Getting started
===============

This package includes everything you need to build a wallet application on Aergo.
It is useful for other kinds of dapps, too.

In contrary to @herajs/client, which includes just the API client and useful classes and helpers,
@herajs/wallet includes managers that can keep, coordinate, and optionally persist state.

Features
========

- Manage keys
- Easy to use interface for sending transactions
- Track accounts for new transactions (using a full node or other external APIs)
- Sign and verify
- Integrates with storages (supported out of the box: IndexedDB (for browsers), LevelDB (for Node.js), and in-memory storage)

Overview
========

All calls go through an instance of Wallet. Wallet keeps references to the different managers and offers shortcut functions.

.. code-block:: javascript

    import { Wallet } from '@herajs/wallet';
    const wallet = new Wallet();

    // wallet.accountManager
    // wallet.keyManager
    // wallet.transactionManager

    // Configure chain
    wallet.useChain({
        chainId: 'testnet.localhost',
        nodeUrl: '127.0.0.1:7845'
    });

    // Set up account and key
    const account = await wallet.accountManager.createAccount();

    // Build tx
    const tx = {
        from: account.address,
        to: account.address,
        amount: '1 aergo'
    };

    // Send
    let txTracker = await wallet.sendTransaction(account, tx);

    // Wait for block confirmation
    txTracker.on('block', (tx) => {
        console.log(tx);
    });