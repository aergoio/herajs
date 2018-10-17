import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AergoClient from '../src';
import contractAbi from './fixtures/contract-inc.abi.json';
import Contract from '../src/models/contract';
import { longPolling } from '../src/utils';

/*

contract.functions.inc() -> FunctionCall
aergo.accounts.sendTransaction(FunctionCall.asTransaction({from: address}) -> Promise<Transaction>
aergo.queryContract(FunctionCall) -> Promise<Result>
*/

describe('Contracts', () => {
    const aergo = new AergoClient();
    
    const contractCode = 'qMi8Via28nBssysny7p32qMqWC3NSvJRBAtNQ3p66bi5K2xjMU8NLQngrcQe3g1mPRz3n44wa7wKM17SgyMpRSkf3eEw3mzEYSS57FdSAUon7rbSpV56xYsdzuhUBVmGbe41gcPgy3rkf3DC5b7ZhWQJC1z3fQK3JAaGyzFhT7jbwSiufHm6X7c3anS9q2hdrNVzEJDAAMsXar9KsV5pQm57oa8bYE9tMtMmqQFD9tv3bTbTxCwxDwjGZ8t5cxz2ZemUfsuy6La43usHpgokQpSfcCWT4nurtBBfujBeBNRoMaaY3ghGvHLAt9gPBqstTN7Wyv4P4QtaPSvB69MBDZaVM9JHARhKUMZPcoL5p3dHvRuQNybqtKitndu4txRCgR9s4YuWyMCzqHvLwFXzbitc25rGo9bwogRsrKK76F6SLuvdKALZpBbCf9UwXnmGUrbfbRuQtn5qKhYDSDiemxAQ9nCCj1L99SxJnR3q2akSeqxULuKDxdtcTFDL';

    describe('deploy, call, query', () => {
        let contractAddress;
        let testAddress;

        it('should deploy a smart contract', async () => {
            testAddress = await aergo.accounts.create('test');
            await aergo.accounts.unlock(testAddress, 'test');

            // Deploy contract
            const contract = Contract.fromCode(contractCode);
            const testtx = {
                from: testAddress,
                to: null,
                amount: 0,
                payload: contract.asPayload(),
            };
            const txhash = await aergo.accounts.sendTransaction(testtx);
            assert.typeOf(txhash, 'string');
            
            // Wait for deployment receipt
            
            const receipt = await longPolling(async () => 
                await aergo.getTransactionReceipt(txhash)
            );
            assert.equal(receipt.status, 'CREATED');
            contractAddress = receipt.contractaddress;
        });

        it('should get a smart contract\'s ABI', async () => {
            const abi = await aergo.getABI(contractAddress);
            assert.deepEqual(abi, contractAbi);
        });

        it('should load ABI from smart contract', async () => {
            const contract = Contract.atAddress(contractAddress);
            contract.loadAbi(await aergo.getABI(contractAddress));
            assert.typeOf(contract.inc, 'function');
        });

        it('should call a smart contract', async () => {
            // Setup address and ABI
            const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);

            // Call contract
            const callTx = contract.inc().asTransaction({
                from: testAddress
            });
            assert.equal(callTx.from, testAddress);
            const calltxhash = await aergo.accounts.sendTransaction(callTx);
            const calltxreceipt = await longPolling(async () => 
                await aergo.getTransactionReceipt(calltxhash)
            );
            assert.equal(calltxreceipt.status, 'SUCCESS');

            // Test missing from address
            assert.throws(() => {
                aergo.accounts.sendTransaction(contract.inc().asTransaction());
            }, Error, 'Missing required transaction parameter \'from\'. Call with asTransaction({from: ...})');
            assert.throws(() => {
                aergo.accounts.sendTransaction(contract.inc().asTransaction({
                    from: null
                }));
            }, Error, 'Missing required transaction parameter \'from\'. Call with asTransaction({from: ...})');
        });

        it('should query a smart contract', async () => {
            // Setup address and ABI
            const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);

            // Query contract
            const result1 = await aergo.queryContract(contract.query('key1'));
            assert.equal(1, result1);

            // Call contract again
            const callTx = contract.inc().asTransaction({
                from: testAddress
            });
            const callTxHash = await aergo.accounts.sendTransaction(callTx);
            const callTxReceipt = await longPolling(async () =>
                await aergo.getTransactionReceipt(callTxHash)
            );
            assert.equal(callTxReceipt.status, 'SUCCESS');

            // Query contract
            const result2 = await aergo.queryContract(contract.query('key1'));
            assert.equal(2, result2);
        }).timeout(3000);
    });
});
