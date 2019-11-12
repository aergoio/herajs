Using with React Native
=======================

To use @herajs/crypto with React Native, you need to shim a few Node internal packages.

Otherwise, you may get an error like :code:`Module `crypto` does not exist in the Haste module map`.

The following guide uses `rn-nodeify <https://github.com/tradle/rn-nodeify>`_.


**1. Installation**

*When using Yarn:*

.. code-block:: bash

    // Install dependencies
    yarn add react-native-crypto react-native-randombytes

    // Fix integration
    react-native link react-native-randombytes
    yarn add -D tradle/rn-nodeify
    ./node_modules/.bin/rn-nodeify --install --hack --yarn

*When using NPM:*

.. code-block:: bash

    // Install dependencies
    npm install --save react-native-crypto react-native-randombytes

    // Fix integration
    react-native link react-native-randombytes
    npm install --save-dev tradle/rn-nodeify
    ./node_modules/.bin/rn-nodeify --install --hack

.. note::

    You have to run the final command every time you add packages.
    It is a good idea to add it as a post-install script to your package.json:

    .. code-block:: text

        "scripts": {
            "postinstall": "rn-nodeify --install --hack"
        }

**2. Add shim to index.js**

Import these at the top of the file.

.. code-block:: javascript

    import './shim.js'
    import crypto from 'crypto'

If you are using a simulator, you may also need to add this line to shim.js: 

.. code-block:: javascript

    self = undefined

**3. Use normally**

Now you can use @herajs/crypto normally. Add the dependency :code:`@herajs/crypto` and use it, for example:

.. code-block:: javascript

    import { createIdentity } from '@herajs/crypto';

    const identity = createIdentity();