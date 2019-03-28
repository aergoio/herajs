import Address from './address';
import { Function, StateQuery as GrpcStateQuery, Query } from '../../types/blockchain_pb';
declare type _PrimitiveType = string | number | boolean;
export declare type PrimitiveType = _PrimitiveType | Array<_PrimitiveType>;
/**
 * Data structure for contract function calls.
 * You should not need to build these yourself, they are returned from contract instance functions and
 * can be passed to the client.
 */
export declare class FunctionCall {
    definition: Function.AsObject;
    args: Array<PrimitiveType>;
    contractInstance: Contract;
    constructor(contractInstance: any, definition: any, args: any);
    /**
     * Generate transaction object that can be passed to :meth:`aergoClient.accounts.sendTrasaction`
     *
     * .. code-block:: javascript
     *
     *     import { Contract } from '@herajs/client';
     *     const contract = Contract.fromAbi(abi).atAddress(address);
     *     const functionCall = contract.someAbiFunction();
     *     aergo.accounts.sendTransaction(functionCall.asTransaction({
     *         from: myAddress
     *     })).then(result => {
     *         console.log(result);
     *     })
     * @param {obj} extraArgs
     * @param {string} extraArgs.from set from address for the transaction
     * @return {obj} transaction data
     */
    asTransaction(extraArgs: any): any;
    /**
     * Generate query info that can be passed to the API.
     * You usually do not need to call this function yourself, :meth:`AergoClient.queryContract` takes care of that.
     *
     * .. code-block:: javascript
     *
     *     import { Contract } from '@herajs/client';
     *     const contract = Contract.fromAbi(abi).atAddress(address);
     *     const functionCall = contract.someAbiFunction();
     *     aergo.queryContract(functionCall).then(result => {
     *         console.log(result);
     *     })
     *
     * @return {obj} queryInfo data
     */
    asQueryInfo(): {
        Name: string;
        Args: PrimitiveType[];
    };
    toGrpc(): Query;
}
/**
 * Query contract state directlty without using ABI methods.
 *
 * .. code-block:: javascript
 *
 *     import { Contract } from '@herajs/client';
 *     const contract = Contract.fromAbi(abi).atAddress(address);
 *     const query = contract.queryState('stateVariableName');
 *     aergo.queryContractState(query).then(result => {
 *         console.log(result);
 *     })
 */
export declare class StateQuery {
    contractInstance: Contract;
    storageKey: string;
    constructor(contractInstance: any, storageKey: any);
    toGrpc(): GrpcStateQuery;
}
/**
 * Smart contract interface.
 * You usually instantiante this class by using one of the static methods.
 * Most of the instance methods return the contract so they can be chained.
 * When an ABI is loaded, its functions will be added to the instance and can be called directly.
 * ABI functions return `FunctionCall` objects that can be queried or called.
 *
 * .. code-block:: javascript
 *
 *     import { Contract } from '@herajs/client';
 *     const contract = Contract.fromAbi(abi).setAddress(address);
 *     aergo.queryContract(contract.someAbiFunction()).then(result => {
 *         console.log(result);
 *     })
 *
 */
declare class Contract {
    code: Buffer;
    address: Address;
    functions: any;
    constructor(data: Partial<Contract>);
    /**
     * Create contract instance from code
     * @param {string} bs58checkCode base58-check encoded code
     * @return {Contract} contract instance
     */
    static fromCode(bs58checkCode: any): Contract;
    /**
     * Create contract instance and set address
     * @param {Address} address
     * @return {Contract} contract instance
     */
    static atAddress(address: Address): Contract;
    /**
     * Create contract instance from ABI
     * @param {obj} abi parsed JSON ABI
     * @return {Contract} contract instance
     */
    static fromAbi(abi: any): Contract;
    /**
     * Set address of contract instance
     * @param {Address|string} address
     * @return {Contract} contract instance
     */
    setAddress(address: Address | string): Contract;
    /**
     * Load contract ABI
     * @param {obj} abi parsed JSON ABI
     * @return {Contract} contract instance
     */
    loadAbi(abi: any): Contract;
    /**
     * Return contract code as payload for transaction
     * @param {args}
     * @return {Buffer} a byte buffer
     */
    asPayload(args?: Array<PrimitiveType>): Buffer;
    /**
     * Create query object to query contract state.
     * @param varname
     * @param varindex
     */
    queryState(key: string): StateQuery;
    static encodeCode(byteArray: Buffer): string;
    static decodeCode(bs58checkCode: string): Buffer;
}
export default Contract;
