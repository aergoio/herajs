==========================
Interacting with contracts
==========================

For more general information about smart contracts, please refer to the `Aergo documentation <https://docs.aergo.io>`__.

This guide uses Javascript's await/async syntax.
Of course, you can always write code like :code:`await aergo.getTransactionReceipt()`
as :code:`aergo.getTransactionReceipt().then(callbackFunction)`.

Deployment
----------

To interact with a smart contract, it needs to be deployed on the blockchain.
To deploy a contract, you send a transaction of type DEPLOY with the contract code as the payload.

1. Setup the contract object with the source code of your smart contract and build a deployment transaction:

.. code-block:: javascript

    import { AergoClient, Contract } from '@herajs/client';
    const aergo = new AergoClient();

    const myAddress = 'Am....'; // Enter your account address or name
    const contractCode = 'source code of your smart contract';
    const contract = Contract.fromCode(contractCode);
    const tx = {
        type: 6,  // DEPLOY
        from: myAddress,
        to: null,
        payload: contract.asPayload(),
    };

2. Unlock account and deploy contract:

.. code-block:: javascript

    await aergo.accounts.unlock(myAddress, 'your password');

    const deployTxhash = await aergo.accounts.sendTransaction(tx);

3. Check the transaction receipt for the created contract address or any error:

.. code-block:: javascript

    const receipt = await aergo.getTransactionReceipt(deployTxhash);
    const contractAddress = receipt.contractaddress;
    console.log(receipt);
    /*
    {
        status: 'CREATED',
        contractaddress: 'Am.....'
    }
    */

How can I pass constructor paremeters?
""""""""""""""""""""""""""""""""""""""

The :meth:`Contract.asPayload` function accepts an optional parameter to pass a list of constructor parameters to the contract.
Example:

.. code-block:: javascript

    const tx = {
        type: 6,  // DEPLOY
        from: myAddress,
        to: null,
        payload: contract.asPayload([1, 2, 3]),
    };


Setup
-----

If you have the address of a contract instance and its ABI, you can setup communication with the contract like this.

.. code-block:: javascript

    import { AergoClient, Contract } from '@herajs/client';
    const aergo = new AergoClient();

    import contractAbi from './contract.abi.json';
    const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);

.. note:

    If you have the contract code, you can generate the JSON ABI like this:
    :code:`aergoluac --abi contract.abi.json contract.lua contract.out`

If you don't have the ABI, it is possible to retrieve it from the blockchain like this:

.. code-block:: javascript

    const abi = await aergo.getABI(contractAddress);
    const contract = Contract.atAddress(contractAddress);
    contract.loadAbi(await aergo.getABI(contractAddress));

Call
----

Calls are contract executions on the blockchain, i.e. transactions with a payload and a result.

Once you have your :code:`contract` instance set up, you can call contract methods like this.

.. code-block:: javascript

    // Build a transaction
    const callTx = contract.someContractMethod().asTransaction({
        from: myAddress
    });

    // Send the transaction
    const calltxhash = await aergo.accounts.sendTransaction(callTx);

    // Wait until the transaction is executed and included in a block, then get the receipt
    const calltxreceipt = await aergo.getTransactionReceipt(calltxhash);
    console.log(calltxreceipt);
    /*
    {
        status: "SUCCESS",
        result: "json string"
    }
    */

Query
-----

Queries are static contract executions, i.e. they return a result from your local node without creating changes on the blockchain.
Thus, they don't require a transaction.

.. code-block:: javascript

    const result = await aergo.queryContract(contractAddress, 'someContractMethod', arg1, arg2);
    console.log(result);

There is an alternative way to query a contract by directly calling the contract method.

.. code-block:: javascript

    const result = await aergo.queryContract(contract.someContractMethod(arg1, arg2));
    console.log(result);

Query a contract state variable
-------------------------------

We can directly read the value of a contract state variable without having to call a contract method.

.. code-block:: javascript

    const result = await aergo.queryContractState(contractAddress, 'stateVariableName');
    console.log(result);

If the variable is an array, we can specify the index of the element we want to read inside brackets.

.. code-block:: javascript

    const result = await aergo.queryContractState(contractAddress, 'list[1]');
    console.log(result);

Similarly, if the variable is a map, we can specify the key we want to read inside brackets.

.. code-block:: javascript

    const result = await aergo.queryContractState(contractAddress, 'items[key1]');
    console.log(result);

It is possible to read many state variables at once by passing an array.

.. code-block:: javascript

    const result = await aergo.queryContractState(contractAddress, ['price', 'list[1]', 'items[key1]']);
    console.log(result);

Query a contract state variable with proof
------------------------------------------

We can also request a proof for the value stored in a state variable.

.. code-block:: javascript

    const result = await aergo.queryContractStateProof(contractAddress, 'balance[Am....]');
    console.log(result);

Events
------

Contracts can log events during execution. This is the preferred way to notify the outside world of important state changes.
It is easy to request events using the :meth:`AergoClient.getEvents` method.

.. code-block:: javascript

    const result = await aergo.getEvents({
        address: contractAddress
    });
    /*
    [
        {
            eventName: '..',
            address: 'Am....',
            args: [ 1, 2, 3 ]
        }
    ]
    */

Filter events
"""""""""""""

You can also filter events in a fine grained way. Check :class:`FilterInfo` for all available options.

.. code-block:: javascript

    const result = await aergo.getEvents({
        address: contractAddress,
        args: [1] // or new Map([[1, 2]]) to only filter for the second argument
    });
    /*
    [
        {
            eventName: '..',
            address: 'Am....',
            args: [ 1, 2, 3 ]
        }
    ]
    */

Stream events
"""""""""""""

Events can also be streamed in real time using :meth:`AergoClient.getEventStream`.
The options are the same as for getEvents, but instead of retrieving all previous events, this creates a stream
that receives all future events as they get created.

.. code-block:: javascript

    const stream = aergo.getEventStream({
        address: contractAddress
    });
    stream.on('data', (event) => {
        console.log(event);
        /*
        {
            eventName: '..',
            address: 'Am....',
            args: [ 1, 2, 3 ]
        }
        */
    });
    // Call stream.cancel(); when you don't need it any more to free resources on the full node.

