import Accounts from '../accounts';
import { BlockchainStatus as GrpcBlockchainStatus } from '../../types/rpc_pb';
import Block from '../models/block';
import ChainInfo from '../models/chaininfo';
import { FunctionCall, StateQuery } from '../models/contract';
import FilterInfo from '../models/filterinfo';
declare const CommitStatus: any;
export { CommitStatus };
/**
 * Main aergo client controller.
 */
declare class AergoClient {
    config: object;
    client: any;
    accounts: Accounts;
    target: string;
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
    defaultProvider(): void;
    /**
     * Set a new provider
     * @param {Provider} provider
     */
    setProvider(provider: any): void;
    getConfig(): object;
    isConnected(): boolean;
    grpcMethod<I, O>(method: Function): (request: I) => Promise<O>;
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
     * Get transaction information in the aergo node.
     * If transaction is in the block return result with block hash and index.
     * @param {string} txhash transaction hash
     * @returns {Promise<object>} transaction details, object of tx: <Tx> and block: { hash, idx }
     */
    getTransaction(txhash: any): Promise<any>;
    /**
     * Retrieve information about a block.
     *
     * @param {string|number} hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @returns {Promise<Block>} block details
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
    getBlockStream(): {
        _stream: any;
        on: (ev: any, callback: any) => any;
        cancel: () => any;
    };
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
     * @param filter FilterInfo
     */
    getEventStream(filter: Partial<FilterInfo>): {
        _stream: any;
        on: (ev: any, callback: any) => any;
        cancel: () => any;
    };
    /**
     * Retrieve account state, including current balance and nonce.
     * @param {string} address Account address encoded in Base58check
     * @returns {Promise<object>} account state
     */
    getState(address: any): any;
    getNonce(address: any): any;
    verifyTransaction(): any;
    /**
     * Send a signed transaction to the network.
     * @param {Tx} tx signed transaction
     * @returns {Promise<string>} transaction hash
     */
    sendSignedTransaction(tx: any): Promise<{}>;
    /**
     * Return the top voted-for block producer
     * @param count number
     */
    getTopVotes(count: number): Promise<any>;
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
    getTransactionReceipt(txhash: any): any;
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
     * @param {StateQuery} stateQuery query details obtained from contract.queryState()
     * @returns {Promise<object>} result of query
     */
    getEvents(filter: Partial<FilterInfo>): any;
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
    getNameInfo(name: any): any;
}
export default AergoClient;
