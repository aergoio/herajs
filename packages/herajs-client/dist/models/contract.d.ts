/// <reference types="node" />
import Address from './address.js';
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
 *     const contract = Contract.fromAbi(abi).atAddress(address);
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
     * @return {Buffer} a byte buffer
     */
    asPayload(): Buffer;
    static encodeCode(byteArray: Buffer): string;
    static decodeCode(bs58checkCode: string): Buffer;
}
export default Contract;
