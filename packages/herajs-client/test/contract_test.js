import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import AergoClient from '../src';
import contractAbi from './fixtures/contract-inc.abi.json';
import sqlContractAbi from './fixtures/contract-sql.abi.json';
import Contract from '../src/models/contract';
import { longPolling } from '../src/utils';

/*

contract.functions.inc() -> FunctionCall
aergo.accounts.sendTransaction(FunctionCall.asTransaction({from: address}) -> Promise<Transaction>
aergo.queryContract(FunctionCall) -> Promise<Result>
*/

describe('Contracts', () => {
    const aergo = new AergoClient();
    
    describe('deploy, call, query a simple contract', () => {
        const contractCode = 'qMi8Via28nBssysny7p32qMqWC3NSvJRBAtNQ3p66bi5K2xjMU8NLQngrcQe3g1mPRz3n44wa7wKM17SgyMpRSkf3eEw3mzEYSS57FdSAUon7rbSpV56xYsdzuhUBVmGbe41gcPgy3rkf3DC5b7ZhWQJC1z3fQK3JAaGyzFhT7jbwSiufHm6X7c3anS9q2hdrNVzEJDAAMsXar9KsV5pQm57oa8bYE9tMtMmqQFD9tv3bTbTxCwxDwjGZ8t5cxz2ZemUfsuy6La43usHpgokQpSfcCWT4nurtBBfujBeBNRoMaaY3ghGvHLAt9gPBqstTN7Wyv4P4QtaPSvB69MBDZaVM9JHARhKUMZPcoL5p3dHvRuQNybqtKitndu4txRCgR9s4YuWyMCzqHvLwFXzbitc25rGo9bwogRsrKK76F6SLuvdKALZpBbCf9UwXnmGUrbfbRuQtn5qKhYDSDiemxAQ9nCCj1L99SxJnR3q2akSeqxULuKDxdtcTFDL';
        let contractAddress;
        let testAddress;
        let deployTxhash;

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
            deployTxhash = await aergo.accounts.sendTransaction(testtx);
            assert.typeOf(deployTxhash, 'string');
            
            // Wait for deployment receipt
            
            const receipt = await longPolling(async () => 
                await aergo.getTransactionReceipt(deployTxhash)
            );
            assert.equal(receipt.status, 'CREATED');
            contractAddress = receipt.contractaddress;
        });

        it('should encode a null address to an empty string', async () => {
            const txInfo = await aergo.getTransaction(deployTxhash);
            assert.equal(txInfo.tx.to, '');
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

    describe('deploy, call, query an sql contract', () => {
        const contractCode = 'L27gmNZNrxKAEqjXaPHsvxUsR9CnuahUKaVfawXxJvwoEr5idXcetQ3xyyB3pFiUpv29Fx9io8E4eaDQ44ibM7DLoVHHqWAajRMm6BVLzG4NJXEszmv3T8Ens6MAy2Se2j8Kz8H8LSMZtxwybRR876aveJJw4Ce3sGnY8v47xZsF44sS2yVYFRtAb6tDfhhKHgZWpJsrNuGxwLaJRL4fnb7hG2Eic4eV8Auf47L4poQCWb2u3S5HhN1XKHhZcFLt9x41DNn1zXunfmGSCYcTfrg6ccxBuKFYkL72bbknBpLoXDRyuzHsViBkoBKhGgrTtXj8ts1CqJV2Jm3sHvhtCL3azy776WWBXxtG8sLUC9KojV16BENhmCKynSFGKUznx1NXCZGMeq8q5MGrQLPCWjfSescNAK3NQtXTFQhr85FPBaM5fKgoqPE9cggDkFB8gHNS8GVXFMxWuSbjQo4Y27UQsR79w5H26b5LQ4LvoyLxh8MEVBJYywHqpUmhBsNvtESexAppK5Fc3Zv4Q4Fpf9gUrp2zX4SQyPsRefwWvJPBjy7fgsksokLULgJSTBhxpWZM1bC9zqLLBc74EJYQhrJ2Szp17VvVktbh3V7YcN6EJSt66G9UAZMt8sTbSAjLiedSjDBL3iJoYsgfPSeMYbS4TYtcADzoYRK6fJH2VyD9NMi51FVX6dFSUaSAP92vGmjekjwQu6MA3JtSSKRyMNM9d7ZCMRawoiHtX7ieQ1zHrt7d5nDSQgnXzQ6r1YFSZRScagweXDMseRmcCfbFDHKDd7D18GurwQxnu8utjTZufSDPxBXo3c5FszZ7K8aoaqRxPPGLrZjjJJSKCaxcoH1CFMcJpd7R4E2853KEpL7CfRUgSXesNGJ4MvrEyf96N3kcZhK3sUDxfhQkUvrS4Bzy1ZwwBezi69xAeApMU7XhD5hgLVqgr5MhA19or3q8P3Wbfg2Yc5DtCV9ko9CQqximaJfWAJ33kCHYgWod9XhoBTmkaoYDLP3Q363A9i9TXa297Z4j19CbipRUhZdcVWb5PHc2uKuPo9KzsdNsVKmBg1CkTJRX148iro1AcWzJmVRGZUkKynbhpZiyK7QTnKcVYZsXCvhEMzPDSebi2wNuaX5TvMkJjHuxx3e6FqYcAazWDS2kaoBx6y6y8QAyrzrFaQqJ51u9B1h5LFtcLRM4NvGakknV7YR7kGdiwvo8dFmKKZKhGotRm17XAnAmYhyTe1hkT5yF2VmVVGSBH8JxfXNC3LknwQ13vHt5PEdKUj7FfPtoiLAUE5a4GX3Kk2KZUn2aqBg4h7wjcjoa9kLHcy94nE5SNUZyNVN4WiwEGWSbYU3DbzAWpPTBnizisMZLB7zA1s1yYQXK4WqivLehF8YMLsqttHLwmwNsrTDpacxAPubaav2uiphMcPMUgNZa6u5SBQ1EL6MW41Mz97oP8sn9oTJdB5tsmofQqN7HZdaBfjp1tEU6CDEyEyrnqjPksmeKjbzwPK9PugAs5JC4H1VPyfAyodPBsBmQDVaLE5Y4jNQK4LUyMULSDXZ9iqpMraU5iooAn6hVp6esBnUvkZB71jTgS3ucNoYJxVBbSPysKBSH6wRRcoW79xM5DMXUXpVpev4A5KREF5Kt5MfCngd1soPFGvRihXWJWVSpdYh7P5EweUpWZb2SodX3S7r3SpF29JE9k8gtqNs8dqoxKDZY6VmdTzdR8d9Tr8i9AyeMoqJUSo8wmjfswfsvadFGT7gGRVNxKSRtBv';
        let contractAddress;
        let testAddress;
        let deployTxhash;

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
            deployTxhash = await aergo.accounts.sendTransaction(testtx);
            assert.typeOf(deployTxhash, 'string');
            
            // Wait for deployment receipt
            const receipt = await longPolling(async () => 
                await aergo.getTransactionReceipt(deployTxhash)
            );
            assert.equal(receipt.status, 'CREATED');
            contractAddress = receipt.contractaddress;
        });

        it('should call and query', async () => {
            const contract = Contract.atAddress(contractAddress).loadAbi(sqlContractAbi);

            // Call contract
            const txHash = await aergo.accounts.sendTransaction(contract.insertTestValues().asTransaction({
                from: testAddress
            }));

            // Wait for receipt
            await longPolling(async () =>
                await aergo.getTransactionReceipt(txHash)
            );
            
            // Query contract
            const result = await aergo.queryContract(contract.query());
            assert.deepEqual(result, [
                [ 2, 3.1, 'X Hello Blockchain' ],
                [ 2, 3.1, 'Y Hello Blockchain' ],
                [ 2, 3.1, 'Z Hello Blockchain' ]
            ]);
        });
    });
});
