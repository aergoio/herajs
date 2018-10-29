=======================
Reading from blockchain
=======================

These are the main methods to read state from the blockchain.

The examples all assume an instance of the AergoClient named aergo.

.. code-block:: javascript

    import { AergoClient } from '@herajs/client';
    let aergo = new AergoClient();

Get block height
----------------

.. code-block:: javascript

    let currentHeight;
    aergo.blockchain().then(blockchainState => {
        currentHeight = blockchainState.bestHeight;
        console.log(currentHeight);
    })

    // 3924

Get block
---------

.. code-block:: javascript

    aergo.getBlock(currentHeight).then(block => {
        console.log(block);
    })

.. code-block:: javascript

    Block {
        hash: 'VhkA9tF5jHnTC3HJpqKQWovxXDhpnU6PsZUbTV8v3r9',
        header: {
            prevblockhash: '6u1HVdsEhQVwWeP1fZy9U8BDRz9pMpQhTMo6vSKs236g',
            blockno: 3924,
            timestamp: 1540795459777847800,
            blocksroothash: 'K6MhDUqkA6kTIDw1TLDFQeMxboHEAZ73KfVD3e1H+Ig=',
            txsroothash: 'NNYSS5G0dTPu7/qbk8TlcDiPZ2s/HC5o9GL5MVN+Q7Y=',
            receiptsroothash: 'nyhdK6qewAKRJlxLanoPOoZthnXbhFJsgAe57CpXZGI=',
            confirms: 0,
            pubkey: '',
            sign: '',
            coinbaseaccount: ''
        },
        body: {
            txsList: [
                Tx {
                    hash: '9YBYY1onL9RLeEFxV9AdnCReV8i1k689KKsosS3eAx3X',
                    nonce: 1,
                    from: 'AmNrsAqkXhQfE6sGxTutQkf9ekaYowaJFLekEm8qvDr1RB1AnsiM',
                    to: 'AmNrsAqkXhQfE6sGxTutQkf9ekaYowaJFLekEm8qvDr1RB1AnsiM',
                    amount: 123,
                    payload: '',
                    sign: 'MEUCIQDP3ywVXX1DP42nTgM6cF95GFfpoEcl4D9ZP+MHO7SgoQIgdq2UiEiSp23lcPFzCHtDmh7pVzsow5x1s8p5Kz0aN7I=',
                    type: 0
                }
                ...
            ]
        }
    }

Get transaction
---------------

.. code-block:: javascript

    aergo.getTransaction('9YBYY1onL9RLeEFxV9AdnCReV8i1k689KKsosS3eAx3X').then(txInfo => {
        console.log(txInfo);
    })

.. code-block:: javascript

    {
        block: { // key only present if transaction has been mined
            hash: '2dR66zrZfo9Je2mavs5RVPXFG4FBpGwarE9PXKyA5bSo',
            idx: 0
        },
        tx: Tx {
            hash: '9YBYY1onL9RLeEFxV9AdnCReV8i1k689KKsosS3eAx3X',
            nonce: 1,
            from: 'AmNrsAqkXhQfE6sGxTutQkf9ekaYowaJFLekEm8qvDr1RB1AnsiM',
            to: 'AmNrsAqkXhQfE6sGxTutQkf9ekaYowaJFLekEm8qvDr1RB1AnsiM',
            amount: 123,
            payload: '',
            sign: 'MEUCIQDP3ywVXX1DP42nTgM6cF95GFfpoEcl4D9ZP+MHO7SgoQIgdq2UiEiSp23lcPFzCHtDmh7pVzsow5x1s8p5Kz0aN7I=',
            type: 0
        }
    }

Get account state
-----------------

.. code-block:: javascript

    aergo.getState('AmNrsAqkXhQfE6sGxTutQkf9ekaYowaJFLekEm8qvDr1RB1AnsiM').then(state => {
        console.log(state);
    })

.. code-block:: javascript

    {
        nonce: 1,
        balance: 99999999,
        codehash: ''
    }
