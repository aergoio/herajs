## 2.1.1 (October 22, 2024)

- Client: Update deploy contracts as plain code

## 2.1.0 (August 09, 2024)

- Client: Update grpc-js

## 1.1.0 (March 16, 2022)

- Client: queryContract now accepts an alternative calling signature: `queryContract(address, functionName, ...args)`

## 1.0.0 (February 17, 2022)

- Updated dependencies and Typescript version
- Client: getTransactionReceipt return value now contains `events`

## 0.20.8 (July 1, 2020)

- Ledger HW App: fix sending tx chunks (did not apply Mode.Finish)

## 0.20.7 (July 1, 2020)

- Ledger HW App: support for tx type FeeDelegation

## 0.20.6 (June 8, 2020)

- Ledger HW App: support for displayAccount

## 0.20.5 (May 25, 2020)

- Crypto: export validateMnemonic

## 0.20.4 (May 20, 2020)

- Ledger HW App: support for signMessage

## 0.20.3 (April 24, 2020)

- Wallet: Name manager did not correctly load persisted names due to a missing indexdb method
- Wallet: Correctly set transaction.data.type
- Client: getEvents FilterInfo: address can be a string

## 0.20.2 (April 22, 2020)

- Wallet: Add accountManager.importAccount method

## 0.20.1 (March 31, 2020)

- Wallet: Name Manager keeps names keyed by account. Add database migration for IndexedDbStorage version 3.

## 0.20.0 (March 31, 2020)

- Wallet: Add Name Manager
- Client: add argument blockno to getNameInfo (default 0 = current block)

## 0.19.8 (March 30, 2020)

- Ledger HW App: update supported tx types

## 0.19.7 (March 30, 2020)

- Wallet: add field 'added' to account

## 0.19.6 (March 26, 2020)

- Ledger HW App: fix browser compatability

## 0.19.5 (March 25, 2020)

- Ledger HW App: support for current spec under development

## 0.19.4 (March 25, 2020)

- Wallet: allow external signatures when using Ledger
- Crypto: encodeSignature now also accepts 'base58' as a possible encoding

## 0.19.3 (March 24, 2020)

- Wallet: fix list of external dependencies

## 0.19.2 (March 24, 2020)

- Wallet: add experimental support for `@herajs/ledger-hw-app-aergo`

## 0.19.1 (March 24, 2020)

- Client: fixed a bug (regression introduced in 0.18) in contract function's `asTransaction`. The previously used amount couldn't be used with local signing. #95

## 0.19.0 (March 19, 2020)

- Client: sendSignedTransaction() now additionally accepts an array of transcations to send simultaneously.
  If you pass an array, the result will be an array of `{ error?: string, hash?: string }` objects.

## 0.18.2 (March 17, 2020)

- Ignore more unnecessary files for npm package
- Crypto: fix path to type def

## 0.18.1 (March 17, 2020)

- The previous release was botched. Don't use version 0.18.0.

## 0.18.0 (March 17, 2020)

- Ledger HW App

  - New package `@herajs/ledger-hw-app-aergo` with support for [Aergo Ledger App](https://github.com/aergoio/ledger-app-aergo).

- Client

  - Try to infer correct tx type for contract calls and governance transactions.
  - Address class has a new property `length` which returns the number of (decoded) bytes.
  - Properly encode all hashes in block header (blocksroothash, txsroothash, receiptsroothash).
  - Improve type safety.
  - Extracted some common code into new `@herajs/common` package.

- Crypto

  - Try to infer correct tx type for contract calls and governance transactions
  - Export `encodeTxHash`, `decodeTxHash`, `encodeSignature`
  - `publicKeyFromAddress` can now accept an object of class client.Address

- Wallet
- Add wallet.isSetup method

## 0.17.1 (March 2, 2020)

- Crypto
  - Rename function identifyFromPrivateKey to identityFromPrivateKey.
    The old name with the typo will continue to be exported but is deprecated.

## 0.17.0 (January 14, 2020)

- Crypto

  - Support for parsing and generating keystore files

- Client
  - blockchain: fix encoding of return value, incl. properly decoded ChainInfo

## 0.16.5 (December 19, 2019)

- Client
  - Peer: add static enum Peer.Role and method peer.acceptedroleLabel() to get human-readable role

## 0.16.4 (November 27, 2019)

- Client
  - ChainInfo: add new fields totalvotingpower and votingreward (available since aergosvr 2.0.2)

## 0.16.3 (November 26, 2019)

- Client
  - Amount.toJSON(): return a string with unit aer, e.g. "11234 aer", instead of useless array representation of JSBI

## 0.16.2 (November 18, 2019)

- Client
  - Add TxReceipt.gasused (supported in aergosvr 2.0)
  - Add Block.rewardaccount and Block.voteReward (supported in aergosvr 2.0)
  - Add Address.isEmpty method

## 0.16.1 (November 13, 2019)

- Client
  - Add new tx types to `Tx.Type` (supported in aergosvr 2.0)

## 0.16.0 (November 12, 2019)

- Crypto

  - Fix a dependency issue of the 'crypto' module. This should now work properly with React Native

- Client
  - Add more math methods to Amount class

## 0.15.1 (November 7, 2019)

- Client
  - Fix encoding of amount as bytes (regression introduced in 0.15.0)

## 0.15.0 (November 7, 2019)

- Crypto
  - Change default BIP44 identifier to `441`.
    If you already used the previous version, manually supply an hdpath as an option to seed functions, e.g.
    `privateKeyFromMnemonic(mnemonic, { hdpath: "m/44'/442'/0'/0/" })`.

## 0.14.0 (November 4, 2019)

- Client
  - Support for Aergo 2.0
  - Add nameprice and gasprice to chaininfo
  - Ability to set default gas limit
  - Fix potential bug in Amount by freezing value
- Wallet
  - Ability to set default gas limit

## 0.13.2 (October 2, 2019)

- Client
  - Export Tx.Type enum and enable setting type to Tx.Type.DEPLOY (2).

## 0.13.0 (October 1, 2019)

- Client
  - add `queryContractStateProof` to return contract state including full proof.
  - `queryContractState` now throws an error when querying a non-existent contract.
  - contract.queryState()
    - This method is no longer variadic. Please change calls like `contract.queryState(...keys)` to `contract.queryState(keys)`.
      Single-value calls continue to be supported.
    - Added optional parameters `compressed` and `root`.

## 0.12.1 (September 27, 2019)

- Client
  - allow passing buffer-like arguments to state query

## 0.12.0 (September 27, 2019)

- Crypto
  - add import/export of seed, mnemonic key phrases

## 0.11.1 (September 5, 2019)

- Client
  - StateQuery: Fix type returned by storageKeys hasher

## 0.11.0 (September 3, 2019)

- Client
  - Support for Aergo 1.2
  - Updated implementation of queryState
  - Added `stakingtotal` amount to chain info

## 0.10.2 (July 18, 2019)

- Client
  - Bug fix: Address did not recognize certain system addresses passed in as bytes

## 0.10.0 (June 31, 2019)

- Client
  - Add Address.isSystemAddress function
  - Change version to be in-sync with wallet and crypto

## 0.9.0 (May 31, 2019)

- Client
  - Configuration and build changes

## 0.8.6 (April 8, 2019)

- Client
  - New API method: getServerInfo()
  - Change queryState to allow querying for multiple state keys at once

## 0.8.5 (April 3, 2019)

- Client
  - Add fields 'payable' and 'view' to getABI output

## 0.8.4 (April 1, 2019)

- Client
  - New API method: getNodeState()

## 0.8.2, 0.8.3 (March 29, 2019)

- Client
  - Bugfix: buffer conversion

## 0.8.1 (March 29, 2019)

- Client
  - Add chainIdHash to blockchain() and tx calls

## 0.8.0 (March 28, 2019)

- Client
  - Compatability with aergosvr 1.0
  - New API method: getConsensusInfo()
  - Additional fields in transaction receipt
  - More Typescript annotations
  - Improved smart contract documentation
  - Add equal methods for Address and Amount

## 0.7.2 (March 19, 2019)

- Client
  - getNameInfo: add destination address

## 0.7.1 (March 18, 2019)

- Client
  - Build was broken due to unused export

## 0.7.0 (March 18, 2019)

- Client
  - Changed build settings
  - Updated dependencies
  - More Typescript annotations
  - Add compare methods for Address and Amount

## 0.6.0 (March 8, 2019)

- Client
  - Compatability with aergosvr 0.12
    - getPeers has additonal parameters
    - Governance tx format has changed
  - New methods: getEvents, getEventStream

## 0.5.3 (February 22, 2019)

- Client
  - Add option to contract.asPayload() to pass constructor arguments
  - Fix response of getABI, was missing state_variables.

## 0.5.2 (February 21, 2019)

- Client
  - Fix Typescript definitions

## 0.5.1 (February 11, 2019)

- Client
  - Compatability with aergosvr 0.11: changed address of Peer

## 0.5.0 (February 7, 2019)

- Client
  - New API method: getChainInfo() (https://github.com/aergoio/herajs/pull/16)
  - Compatability with aergosvr 0.11
  - Various small bug fixes

## 0.4.6 (January 28, 2019)

- Client
  - Remove Proxy from provider classes to save code and enable future IE support

## 0.4.5 (January 24, 2019)

- Client
  - Fix usage of Buffer in Node.js environments

## 0.4.4 (January 24, 2019)

- Client
  - Compatability with aergosvr 0.10 (https://github.com/aergoio/herajs/pull/17)

## 0.4.3 (January 8, 2019)

- Client
  - Bugfix: Encoding tx hashes was broken in node.js environments (https://github.com/aergoio/herajs/pull/15)

## 0.4.2 (December 24, 2018)

- Client
  - New API method: getStaking()
  - New API method: queryContractState()
  - Add block producer's pubkey to Block data

## 0.4.1 (December 19, 2018)

- Client
  - Bugfix: Names with less than 12 characters were not recognized

## 0.4.0 (December 19, 2018)

- Client
  - Compatibility with Aergo protocol 0.9
  - New API method: getNameInfo()
  - New API method: getBlockMetadataStream()

## 0.3.2 (December 14, 2018)

- Client
  - Introduce Amount utility class for converting amounts with and without units

## 0.3.1 (December 7, 2018)

- Client
  - Fixed a possible bug regarding conversion of hex strings

## 0.3.0 (December 6, 2018)

- Client
  - Changed number of decimals of native token to 18 (https://github.com/aergoio/aergo/issues/16)
  - Use BigInt for balances and amounts

## 0.2.2 (November 28, 2018)

- Client
  - Changed return value of getPeers to return Peer objects
  - Docs: change doc builder to use typedoc

## 0.2.1 (November 19, 2018)

- Client
  - Bugfix: use Uint8Array instead of Buffer for compatability

## 0.2.0 (November 16, 2018)

- Client
  - Rewrote large parts of the codebase to use Typescript

## 0.1.0 (November 1, 2018)

- Client
  - Initial npm release
