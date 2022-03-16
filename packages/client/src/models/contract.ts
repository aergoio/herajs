import { Address, Amount, constants, fromNumber, base58check } from '@herajs/common';
import Tx from './tx';
import { StateQuery as GrpcStateQuery, Query, ABI } from '../../types/blockchain_pb';
import sha256 from 'hash.js/lib/hash/sha/256';

type _PrimitiveType = string | number | boolean;
export type PrimitiveType = _PrimitiveType | _PrimitiveType[];

type BufferLike = number[] | Uint8Array | Buffer;

interface QueryInfo {
    Name: string;
    Args: PrimitiveType[];
}

export type Abi = Partial<ABI.AsObject> & { functions: any; state_variables: any };

/**
 * Data structure for contract function calls.
 * You should not need to build these yourself, they are returned from contract instance functions and
 * can be passed to the client.
 */
export class FunctionCall {
    definition: { name: string };
    args: PrimitiveType[];
    contractInstance: { address: Address };

    constructor(contractInstance: { address: Address }, definition: { name: string }, args: PrimitiveType[]) {
        this.definition = definition;
        this.args = args;
        this.contractInstance = contractInstance;
    }

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
    asTransaction(extraArgs: Partial<Tx> & Pick<Tx, 'from'>): Partial<Tx> {
        const payload = JSON.stringify({
            Name: this.definition.name,
            Args: this.args,
        });
        if (!this.contractInstance.address) throw new Error('Set address of contract before creating transactions');
        if (typeof extraArgs === 'undefined' || !extraArgs.from || extraArgs.from.length === 0) {
            throw new Error('Missing required transaction parameter \'from\'. Call with asTransaction({from: ...})');
        }
        return {
            to: this.contractInstance.address,
            payload,
            amount: new Amount('0 aer'),
            type: Tx.Type.CALL,
            ...extraArgs
        };
    }
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
    asQueryInfo(): QueryInfo {
        return {
            Name: this.definition.name,
            Args: this.args
        };
    }

    toGrpc(): Query {
        const q = new Query();
        if (!this.contractInstance.address) {
            throw new Error('set contract address before creating state query');
        }
        q.setContractaddress(Uint8Array.from((new Address(this.contractInstance.address)).asBytes()));
        q.setQueryinfo(Uint8Array.from(Buffer.from(JSON.stringify(this.asQueryInfo()))));
        return q;
    }
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
export class StateQuery {
    contractInstance: Contract;
    storageKeys: string[] | BufferLike[];
    root: Uint8Array | undefined;
    compressed: boolean;

    constructor(contractInstance: Contract, storageKeys: string[] | BufferLike[], compressed?: boolean, root?: Uint8Array) {
        this.contractInstance = contractInstance;
        this.storageKeys = storageKeys;
        this.compressed = compressed || false;
        this.root = root;
    }

    toGrpc(): GrpcStateQuery {
        const q = new GrpcStateQuery();
        if (!this.contractInstance.address) {
            throw new Error('set contract address before creating state query');
        }
        q.setContractaddress(this.contractInstance.address.asBytes());
        const storageKeys = (this.storageKeys as any[]).map((key: string | BufferLike) => {
            const buf = typeof key === 'string' ? Buffer.from(key) : key;
            return Uint8Array.from(sha256().update(buf).digest());
        });
        q.setStoragekeysList(storageKeys);
        q.setCompressed(this.compressed);
        if (this.root) {
            q.setRoot(Uint8Array.from(this.root));
        }
        return q;
    }
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
class Contract {
    code?: Buffer;
    address?: Address;
    functions: Record<string, (...args: PrimitiveType[]) => FunctionCall>;

    constructor(data: Partial<Contract>) {
        Object.assign(this, data);

        this.functions = {};

        function isNotProxied(obj: Contract, field: string): field is keyof Contract {
            return field in obj;
        }

        // This class acts as a proxy that passes ABI method calls
        return new Proxy(this, {
            get(obj, field: keyof Contract | string) {
                if (isNotProxied(obj, field)) return obj[field];
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
    static fromCode(bs58checkCode: string): Contract {
        const decoded = Contract.decodeCode(bs58checkCode);
        return new Contract({
            code: decoded
        });
    }

    /**
     * Create contract instance and set address
     * @param {Address} address 
     * @return {Contract} contract instance 
     */
    static atAddress(address: Address): Contract {
        const contract = new Contract({});
        contract.setAddress(address);
        return contract;
    }

    /**
     * Create contract instance from ABI
     * @param {obj} abi parsed JSON ABI
     * @return {Contract} contract instance
     */
    static fromAbi(abi: Abi): Contract {
        const contract = new Contract({});
        contract.loadAbi(abi);
        return contract;
    }

    /**
     * Set address of contract instance
     * @param {Address|string} address 
     * @return {Contract} contract instance
     */
    setAddress(address: Address|string): Contract {
        this.address = new Address(address);
        return this;
    }

    /**
     * Load contract ABI
     * @param {obj} abi parsed JSON ABI
     * @return {Contract} contract instance
     */
    loadAbi(abi: Abi): Contract {
        for (const definition of abi.functions) {
            this.functions[definition.name] = (...args: PrimitiveType[]) => new FunctionCall({
                address: this.address,
            }, definition, args);
        }
        return this;
    }

    /**
     * Return contract code as payload for transaction
     * @param {args}
     * @return {Buffer} a byte buffer
     */
    asPayload(args?: PrimitiveType[]): Buffer {
        if (!this.code || !this.code.length) {
            throw new Error('Code is required to generate payload');
        }
        // First 4 bytes are the length of code (incl. ABI)
        const len = Buffer.from(fromNumber(4 + this.code.length, 4));
        if (typeof args !== 'undefined') {
            const argsDecoded = Buffer.from(JSON.stringify(args));
            return Buffer.concat([len, this.code, argsDecoded]);
        }
        return Buffer.concat([len, this.code]);
    }

    /**
     * Create query object to query contract state.
     * @param keys list of keys, either strings or Buffer-like byte arrays
     * @param compressed return compressed proof (default: false)
     * @param root root hash
     */
    queryState(keys: string | BufferLike | string[] | BufferLike[], compressed?: boolean, root?: Uint8Array): StateQuery {
        function isBufferLike(arr: string[] | BufferLike | BufferLike[]): arr is BufferLike {
            return keys instanceof Buffer || keys instanceof Uint8Array || arr.length > 0 && typeof arr[0] === 'number';
        }
        const keyArray = (typeof keys === 'string' || isBufferLike(keys)) ? [keys] : keys;
        // `as any` is needed b/c https://github.com/microsoft/TypeScript/issues/14107#issuecomment-483995795
        return new StateQuery(this, keyArray as any, compressed, root);
    }

    static encodeCode(byteArray: Buffer): string {
        const buf = Buffer.from([constants.ADDRESS_PREFIXES.CONTRACT, ...byteArray]);
        return base58check.encode(buf);
    }

    static decodeCode(bs58checkCode: string): Buffer {
        return base58check.decode(bs58checkCode).slice(1);
    }
}

export default Contract;
