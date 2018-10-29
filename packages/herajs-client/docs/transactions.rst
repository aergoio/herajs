====================
Sending transactions
====================

These are the main methods to send transactions to the blockchain.

The examples all assume an instance of the AergoClient named aergo.

.. code-block:: javascript

    import { AergoClient } from '@herajs/client';
    let aergo = new AergoClient();

Using a server-side account
---------------------------

The easiest way to send transactions is when you are connected to a local node that stores the account you want to use.
First unlock an account, then send a transaction using that account.

.. code-block:: javascript

    const address = 'AmNrsAqkXhQfE6sGxTutQkf9ekaYowaJFLekEm8qvDr1RB1AnsiM';
    aergo.accounts.unlock(address, 'testpass').then(unlockedAddress => 
        const testtx = {
            from: unlockedAddress,
            to: unlockedAddress,
            amount: 123
        };
        aergo.accounts.sendTransaction(testtx).then(txhash => {
            console.log(txhash);
        })
    });

    // 9YBYY1onL9RLeEFxV9AdnCReV8i1k689KKsosS3eAx3X

Using a client-side account
---------------------------

If you created a public-private key pair on the client side, you can sign and send transactions directly. Remember you need the optional package `@herajs/crypto` for this.

.. code-block:: javascript

    import { createIdentity, signTransaction, hashTransaction } from '@herajs/crypto';
    const identity = createIdentity();
    const tx = {
        nonce: 1,
        from: identity.address,
        to: identity.address,
        amount: 100
    };
    tx.sign = await signTransaction(tx, identity.keyPair);
    tx.hash = await hashTransaction(tx, 'bytes');
    aergo.sendSignedTransaction(tx);

Getting transaction status
--------------------------

After submitting a transaction, if it is valid it will be picked up from a mempool and included in a block.

To retrieve the status of a transaction, refer to `Reading from blockchain#Get transaction`. At the moment, you need to poll `getTransaction` until it returns the block that includes the transaction.
