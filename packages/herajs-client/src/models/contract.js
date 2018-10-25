import { ADDRESS_PREFIXES } from '../constants.js';
import bs58check from 'bs58check';
import { fromNumber } from '../utils';

/**
 * Data structure for contract function calls.
 * You should not need to build these yourself, they are returned from contract instance functions and
 * can be passed to the client.
 */
class FunctionCall {
    constructor(contractInstance, definition, args) {
        this.definition = definition;
        this.args = args;
        this.contractInstance = contractInstance;
    }
    /**
     * Generate transaction object that can be passed to `aergo.accounts.sendTransaction()`
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
    asTransaction(extraArgs) {
        const payload = JSON.stringify({
            Name: this.definition.name,
            Args: this.args
        });
        if (!this.contractInstance.address) throw new Error('Set address of contract before creating transactions');
        if (typeof extraArgs === 'undefined' || !extraArgs.from || extraArgs.from.length === 0) {
            throw new Error('Missing required transaction parameter \'from\'. Call with asTransaction({from: ...})');
        }
        return {
            to: this.contractInstance.address,
            amount: 0,
            payload,
            ...extraArgs
        };
    }
    /**
     * Generate query info that can be passed to `aergo.queryContract()`.
     * You usually do not need to call this function yourself, `queryContract` takes care of that.
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
    asQueryInfo() {
        return {
            Name: this.definition.name,
            Args: this.args
        };
    }
}

/**
 * Smart contract interface
 * You usually instantiante this class by using one of the static methods.
 * Most of the instance methods return the contract so they can be chained.
 * When an ABI is loaded, its functions will be added to the instance and can be called directly.
 * ABI functions return FunctionCall objects that can be queried or called.
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
class Contract {
    /**
     * @param {obj} [data]
     */
    constructor(data) {
        this.functions = {};
        
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }

        // This class acts as a proxy that passes ABI method calls
        return new Proxy(this, {
            get(obj, field) {
                if (field in obj) return obj[field];
                if (field in obj.functions) return obj.functions[field];
                return undefined;
            }
        });
    }
    /**
     * Create contract instance from code
     * @param {string} bs58checkCode base58-check encoded code
     * @return {Contract} contract instance
     */
    static fromCode(bs58checkCode) {
        const decoded = Contract.decodeCode(bs58checkCode);
        return new Contract({
            code: decoded
        });
    }
    /**
     * Create contract instance and set address
     * @param {string} address 
     * @return {Contract} contract instance 
     */
    static atAddress(address) {
        const contract = new Contract();
        contract.setAddress(address);
        return contract;
    }
    /**
     * Create contract instance from ABI
     * @param {obj} abi parsed JSON ABI
     * @return {Contract} contract instance
     */
    static fromAbi(abi) {
        const contract = new Contract();
        contract.loadAbi(abi);
        return contract;
    }
    /**
     * Set address of contract instance
     * @param {string} address 
     * @return {Contract} contract instance
     */
    setAddress(address) {
        this.address = address;
        return this;
    }
    /**
     * Load contract ABI
     * @param {obj} abi parsed JSON ABI
     * @return {Contract} contract instance
     */
    loadAbi(abi) {
        for (const definition of abi.functions) {
            this.functions[definition.name] = (...args) => new FunctionCall(this, definition, args);
        }
        return this;
    }
    /**
     * Return contract code as payload for transaction
     * @return {Buffer} a byte buffer
     */
    asPayload() {
        if (!this.code || !this.code.length) {
            throw new Error('Code is required to generate payload');
        }
        // First 4 bytes are the length
        return Buffer.concat([Buffer.from(fromNumber(4 + this.code.length, 4)), this.code]);
    }
    static encodeCode(byteArray) {
        const buf = Buffer.from([ADDRESS_PREFIXES.CONTRACT, ...byteArray]);
        return bs58check.encode(buf);
    }
    static decodeCode(bs58checkCode) {
        return bs58check.decode(bs58checkCode).slice(1);
        //return bs58.decode(bs58checkCode);
    }
}

export default Contract;
