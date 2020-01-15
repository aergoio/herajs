====
Keys
====

Generating random private key
=============================
.. js:autofunction:: createIdentity

Importing private key
=====================
.. js:autofunction:: identityFromPrivateKey

Encryption
==========
.. js:autofunction:: decryptPrivateKey
.. js:autofunction:: encryptPrivateKey

Public keys and addresses
=========================

In Aergo, addresses are generated directly from public keys. Because of that, it is easy to convert between the two.

.. js:autofunction:: publicKeyFromAddress
.. js:autofunction:: addressFromPublicKey