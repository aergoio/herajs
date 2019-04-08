import Accounts from '../accounts';
import { BlockchainStatus as GrpcBlockchainStatus } from '../../types/rpc_pb';
import Tx from '../models/tx';
import Block from '../models/block';
import Address from '../models/address';
import State from '../models/state';
import Amount from '../models/amount';
import ChainInfo from '../models/chaininfo';
import Event from '../models/event';
import { FunctionCall, StateQuery } from '../models/contract';
import FilterInfo from '../models/filterinfo';
declare const CommitStatus: any;
export { CommitStatus };
interface GetTxResult {
    block?: {
        hash: string;
        idx: number;
    };
    tx: Tx;
}
interface GetReceiptResult {
    contractaddress: Address;
    result: string;
    status: string;
    fee: Amount;
    cumulativefee: Amount;
    blockno: number;
    blockhash: string;
}
interface NameInfoResult {
    name: string;
    owner: Address;
    destination: Address;
}
interface ConsensusInfoResult {
    type: string;
    info: object;
    bpsList: object[];
}
interface ServerInfoResult {
    configMap: Map<string, Map<string, string>>;
    statusMap: Map<string, string>;
}
interface Stream<T> {
    on(eventName: string, callback: ((obj: T) => void)): void;
    cancel(): void;
    _stream: any;
}
/**
 * Main aergo client controller.
 */
declare class AergoClient {
    config: object;
    client: any;
    accounts: Accounts;
    target: string;
    private chainIdHash?;
    static defaultProviderClass?: {
        new (...args: any[]): any;
    };
    static platform: string;
    /**
     * Create a new auto-configured client with:
     *
     * .. code-block:: javascript
     *
     *     import AergoClient from '@herajs/client';
     *     const aergo = new AergoClient();
     *
     * @param [object] configuration. Unused at the moment.
     * @param [Provider] custom configured provider. By default a provider is configured automatically depending on the environment.
     */
    constructor(config?: {}, provider?: any);
    defaultProvider(): any;
    /**
     * Set a new provider
     * @param {Provider} provider
     */
    setProvider(provider: any): void;
    getConfig(): object;
    isConnected(): boolean;
    grpcMethod<I, O>(method: Function): (request: I) => Promise<O>;
    /**
     * Set the chain id hash to use for subsequent transactions.
     * @param hash string (base58 encoded) or byte array
     */
    setChainIdHash(hash: string | Uint8Array): void;
    /**
     * Request chain id hash. This automatically gathers the chain id hash
     * from the current node if not specified.
     * @param enc set to 'base58' to retrieve the hash encoded in base58. Otherwise returns a Uint8Array.
     * @returns {Promise<Uint8Array | string>} Uint8Array by default, base58 encoded string if enc = 'base58'.
     */
    getChainIdHash(enc?: string): Promise<Uint8Array | string>;
    /**
     * Request current status of blockchain.
     * @returns {Promise<object>} an object detailing the current status
     */
    blockchain(): Promise<GrpcBlockchainStatus.AsObject>;
    /**
     * Request current status of blockchain.
     * @returns {Promise<object>} an object detailing the current status
     */
    getChainInfo(): Promise<ChainInfo>;
    /**
     * Request current status of node.
     * @returns {Promise<any>} an object detailing the state of various node components
     */
    getNodeState(component?: string, timeout?: number): Promise<any>;
    /**
     * Get transaction information in the aergo node.
     * If transaction is in the block return result with block hash and index.
     * @param {string} txhash transaction hash
     * @returns {Promise<object>} transaction details, object of tx: <Tx> and block: { hash, idx }
     */
    getTransaction(txhash: any): Promise<GetTxResult>;
    /**
     * Retrieve information about a block.
     *
     * @param hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @returns block details
     */
    getBlock(hashOrNumber: string | number): Promise<Block>;
    /**
     * Retrieve the last n blocks, beginning from given block .
     *
     * @param {string|number} hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @param {number} size number of blocks to return
     * @returns {Promise<Block[]>} list of block headers (blocks without body)
     */
    getBlockHeaders(hashOrNumber: any, size?: number, offset?: number, desc?: boolean): any;
    getBlockStream(): Stream<Block>;
    getBlockMetadataStream(): {
        _stream: any;
        on: (ev: any, callback: any) => any;
        cancel: () => any;
    };
    /**
     * Returns a stream that yields new events matching the specified filter in real-time.
     *
     * .. code-block:: javascript
     *
     *      const stream = aergo.getEventStream({
     *          address: 'Am....'
     *      });
     *      stream.on('data', (event) => {
     *         console.log(event);
     *         stream.cancel();
     *      });
     *
     * @param {FilterInfo} filter :class:`FilterInfo`
     * @returns {Stream<Event>} event stream
     */
    getEventStream(filter: Partial<FilterInfo>): Stream<Event>;
    /**
     * Retrieve account state, including current balance and nonce.
     * @param {string} address Account address encoded in Base58check
     * @returns {Promise<object>} account state
     */
    getState(address: any): Promise<State>;
    getNonce(address: any): Promise<number>;
    verifyTransaction(): any;
    /**
     * Send a signed transaction to the network.
     * @param {Tx} tx signed transaction
     * @returns {Promise<string>} transaction hash
     */
    sendSignedTransaction(tx: any): Promise<string>;
    /**
     * Return the top voted-for block producer
     * @param count number
     */
    getTopVotes(count: number, id?: string): Promise<any>;
    /**
     * Return information for account name
     * @param {string} address Account address encoded in Base58check
     */
    getStaking(address: any): any;
    /**
     * Retrieve the transaction receipt for a transaction
     * @param {string} txhash transaction hash
     * @return {Promise<object>} transaction receipt
     */
    getTransactionReceipt(txhash: any): Promise<GetReceiptResult>;
    /**
     * Query contract ABI
     * @param {FunctionCall} functionCall call details
     * @returns {Promise<object>} result of query
     */
    queryContract(functionCall: FunctionCall): any;
    /**
     * Query contract state
     * This only works vor variables explicitly defines as state variables.
     * @param {StateQuery} stateQuery query details obtained from contract.queryState()
     * @returns {Promise<object>} result of query
     */
    queryContractState(stateQuery: StateQuery): any;
    /**
     * Query contract state
     * This only works vor variables explicitly defines as state variables.
     * @param {FilterInfo} filter :class:`FilterInfo`
     * @returns {Event[]} list of events
     */
    getEvents(filter: Partial<FilterInfo>): Event[];
    /**
     * Query contract ABI
     * @param {string} address of contract
     * @returns {Promise<object>} abi
     */
    getABI(address: any): any;
    /**
     * Get list of peers of connected node
     */
    getPeers(showself?: boolean, showhidden?: boolean): any;
    /**
     * Return information for account name
     * @param name
     */
    getNameInfo(name: any): Promise<NameInfoResult>;
    /**
     * Return consensus info. The included fields can differ by consensus type.
     */
    getConsensusInfo(): Promise<ConsensusInfoResult>;
    /**
     * Return server info
     */
    getServerInfo(keys?: string[]): Promise<ServerInfoResult>;
}
export default AergoClient;
