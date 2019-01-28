========
Accounts
========

There are several methods to create and access accounts.

The examples all assume an instance of the AergoClient named aergo.

.. code-block:: javascript

    import { AergoClient } from '@herajs/client';
    let aergo = new AergoClient();

Address encoding
---------------------

A note about address encoding: Internally, addresses are stored and sent as raw bytes.
On the client side, they should always be displayed using Base58-check encoded strings (with the prefix 0x42).

Regarding return values, all methods in herajs return `Address` objects that encapsulate raw bytes.
String encoding happens automatically when you convert these objects as a string (or call toString() manually).

Regarding parameters, all methods in herajs can take either Base58-check encoded strings or raw byte arrays.
It is recommended to just stick to using strings everywhere, but in some cases it may be more efficient to skip the encoding-decoding process.

Server-side
-----------

When you are connected to a local node, you can store your accounts in the node.

Create a new account
^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

    const password = 'testpass';
    aergo.accounts.create(password).then(address => {
        console.log(address);
    })

    // Address {}

Unlock account
^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

    const password = 'testpass';
    address = 'AmNrsAqkXhQfE6sGxTutQkf9ekaYowaJFLekEm8qvDr1RB1AnsiM';
    aergo.accounts.unlock(address, password).then(unlockedAddress => {
        console.log(unlockedAddress);
    })

    // Address {}

.. warning::

    Only create and unlock accounts on access-controlled servers. This method is not safe to use on publicly accessible nodes.

Client-side
-----------

You can also create accounts entirely on the client side without any interaction with the server.
For that, you need to create a public-private key pair. As these cryptographic functions take up a lot of space in code, they are located in a separate package from the main client.

You can install it like this:

.. code-block:: shell

    npm install --save @herajs/crypto

This package is mostly a thin wrapper around https://github.com/indutny/elliptic for herajs compatability. Please refer to the documentation of elliptic for details.

Create a new account
^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

    import { createIdentity } from '@herajs/crypto';
    const identity = createIdentity();
    console.log(identity);

.. code-block:: javascript
    
    {
        address: 'AmPwShSoZbAFWWT58yimPBctajMrbjaLWAv88PbgxjvAftPAdLv7',
        publicKey: <EC Point x: ... y: ...>,
        privateKey: <BN: ...>,
        keyPair: <Key priv: ... pub: <EC Point x: ... y: ...> >
    }

.. warning::

    Be aware that if you keep private keys in the browser, any program that has access to your Javascript environment 
    (for example browser extensions) can potentially read your keys which is dangerous. Take care of storing private keys
    in a safe way.