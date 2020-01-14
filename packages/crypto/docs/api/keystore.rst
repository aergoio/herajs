========
Keystore
========

Keystore is a specification to store private keys in a secure way.
Please see Aergo documentation for format specification.

Generating keystore from private key (encryption)
=================================================
.. js:autofunction:: keystoreFromPrivateKey

Reading private key from keystore (decryption)
==============================================
.. js:autofunction:: identityFromKeystore

.. js:autoclass:: Keystore
   :members:

.. js:autoclass:: KeystoreCipher
   :members:

.. js:autoclass:: CipherParams
   :members:

.. js:autoclass:: KeystoreKdf
   :members:

.. js:autoclass:: ScryptParams
   :members:
