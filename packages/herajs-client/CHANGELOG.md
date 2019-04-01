## 0.8.4 (April 1, 2019)

- New API method: getNodeState()

## 0.8.2, 0.8.3 (March 29, 2019)

- Bugfix: buffer conversion

## 0.8.1 (March 29, 2019)

- Add chainIdHash to blockchain() and tx calls

## 0.8.0 (March 28, 2019)

- Compatability with aergosvr 1.0
- New API method: getConsensusInfo()
- Additional fields in transaction receipt
- More Typescript annotations
- Improved smart contract documentation
- Add equal methods for Address and Amount

## 0.7.2 (March 19, 2019)

- getNameInfo: add destination address

## 0.7.1 (March 18, 2019)

- Build was broken due to unused export

## 0.7.0 (March 18, 2019)

- Changed build settings
- Updated dependencies
- More Typescript annotations
- Add compare methods for Address and Amount

## 0.6.0 (March 8, 2019)

- Compatability with aergosvr 0.12
  - getPeers has additonal parameters
  - Governance tx format has changed
- New methods: getEvents, getEventStream

## 0.5.3 (February 22, 2019)

- Add option to contract.asPayload() to pass constructor arguments
- Fix response of getABI, was missing state_variables.

## 0.5.2 (February 21, 2019)

- Fix Typescript definitions

## 0.5.1 (February 11, 2019)

- Compatability with aergosvr 0.11: changed address of Peer

## 0.5.0 (February 7, 2019)

- New API method: getChainInfo() (https://github.com/aergoio/herajs/pull/16)
- Compatability with aergosvr 0.11
- Various small bug fixes

## 0.4.6 (January 28, 2019)

- Remove Proxy from provider classes to save code and enable future IE support

## 0.4.5 (January 24, 2019)

- Fix usage of Buffer in Node.js environments

## 0.4.4 (January 24, 2019)

- Compatability with aergosvr 0.10 (https://github.com/aergoio/herajs/pull/17)

## 0.4.3 (January 8, 2019)

- Bugfix: Encoding tx hashes was broken in node.js environments (https://github.com/aergoio/herajs/pull/15)

## 0.4.2 (December 24, 2018)

- New API method: getStaking()
- New API method: queryContractState()
- Add block producer's pubkey to Block data

## 0.4.1 (December 19, 2018)

- Bugfix: Names with less than 12 characters were not recognized

## 0.4.0 (December 19, 2018)

- Compatibility with Aergo protocol 0.9
- New API method: getNameInfo()
- New API method: getBlockMetadataStream()

## 0.3.2 (December 14, 2018)

- Introduce Amount utility class for converting amounts with and without units

## 0.3.1 (December 7, 2018)

- Fixed a possible bug regarding conversion of hex strings

## 0.3.0 (December 6, 2018)

- Changed number of decimals of native token to 18 (https://github.com/aergoio/aergo/issues/16)
- Use BigInt for balances and amounts

## 0.2.2 (November 28, 2018)

- Changed return value of getPeers to return Peer objects
- Docs: change doc builder to use typedoc

## 0.2.1 (November 19, 2018)

- Bugfix: use Uint8Array instead of Buffer for compatability

## 0.2.0 (November 16, 2018)

- Rewrote large parts of the codebase to use Typescript

## 0.1.0 (November 1, 2018)

- Initial npm release