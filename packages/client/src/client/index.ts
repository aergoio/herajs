import { Buffer } from 'buffer';
import bs58 from 'bs58';
import promisify from '../promisify';
import { fromNumber, errorMessageForCode, waterfall } from '../utils';
import { decodeTxHash, encodeTxHash } from '../transactions/utils';
import { TransactionError } from '../errors';
import Accounts from '../accounts';
import {
    TxInBlock, Tx as GrpcTx,
    TxList,
    StateQueryProof as GrpcStateQueryProof,
    ABI as GrpcABI,
    Block as GrpcBlock,
    Receipt as GrpcReceipt,
} from '../../types/blockchain_pb';
import {
    Empty, PeerList as GrpcPeerList, Peer as GrpcPeer,
    BlockchainStatus as GrpcBlockchainStatus, CommitResultList,
    Name, NameInfo, Staking, ChainInfo as GrpcChainInfo,
    SingleBytes,
    ListParams,
    EventList,
    PeersParams,
    ConsensusInfo,
    ServerInfo, KeyParams,
    VoteParams, Vote,
    NodeReq,
    BlockMetadata as GrpcBlockMetadata,
    BlockBodyParams, PageParams, BlockBodyPaged as GrpcBlockBodyPaged,
    CommitStatus,
    AccountAddress,
} from '../../types/rpc_pb';
import {
    Tx, Block, BlockMetadata, Address,
    Peer, State, Amount, ChainInfo, Event, StateQueryProof, FilterInfo
} from '../models';
import { AddressInput } from '../models/address';
import { FunctionCall, StateQuery } from '../models/contract';
import {
    GetTxResult, GetReceiptResult, NameInfoResult, ConsensusInfoResult,
    ServerInfoResult, BlockBodyPaged, Stream, BasicType, JsonData
} from './types';

export { CommitStatus };

async function marshalEmpty(): Promise<Empty> {
    return new Empty();
}

async function marshalHashOrNumberToSingleBytes(hashOrNumber: string | number): Promise<SingleBytes> {
    if (typeof hashOrNumber === 'undefined') {
        throw new Error('Missing argument block hash or number');
    }
    let input;
    if (typeof hashOrNumber === 'string') {
        input = Block.decodeHash(hashOrNumber);
    } else
    if (typeof hashOrNumber === 'number') {
        input = fromNumber(hashOrNumber);
    }
    if (input.length != 32 && input.length != 8) {
        throw new Error('Invalid block hash. Must be 32 byte encoded in bs58. Did you mean to pass a block number?');
    }
    const singleBytes = new SingleBytes();
    singleBytes.setValue(Uint8Array.from(input));
    return singleBytes;
}

/**
 * Main aergo client controller.
 */
class AergoClient {
    config: object;
    client: any;
    accounts: Accounts;
    target: string;
    private chainIdHash?: Uint8Array;
    private defaultLimit: number;
    static defaultProviderClass?: {new (...args : any[]): any;};
    static platform: string = '';

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
    constructor (config = {}, provider = null) {
        this.config = {
            ...config
        };
        this.client = provider || this.defaultProvider();
        this.accounts = new Accounts(this);
    }

    defaultProvider() {
        // returns a new instance of defaultProviderClass
        // which will be overriden during build according to platform
        return new AergoClient.defaultProviderClass();
    }

    /**
     * Set a new provider
     * @param {Provider} provider
     */
    setProvider(provider) {
        this.client = provider;
        this.chainIdHash = undefined;
    }

    getConfig() {
        return this.config;
    }

    isConnected() {
        // Legacy code for backwards compatability
        return false;
    }

    grpcMethod<I, O>(method: Function): (request: I) => Promise<O> {
        return (request: I) => promisify(method, this.client.client)(request);
    }

    /**
     * Set the chain id hash to use for subsequent transactions.
     * @param hash string (base58 encoded) or byte array
     */
    setChainIdHash(hash: string | Uint8Array) {
        if (typeof hash === 'string') {
            this.chainIdHash = bs58.decode(hash);
        } else {
            this.chainIdHash = hash;
        }
    }

    /**
     * Set the default gas limit to use for transactions that do not define their own.
     */
    setDefaultLimit(limit: number): void {
        this.defaultLimit = limit;
    }

    /**
     * Request chain id hash. This automatically gathers the chain id hash
     * from the current node if not specified.
     * @param enc set to 'base58' to retrieve the hash encoded in base58. Otherwise returns a Uint8Array.
     * @returns {Promise<Uint8Array | string>} Uint8Array by default, base58 encoded string if enc = 'base58'.
     */
    //async getChainIdHash(enc?: 'base58'): Promise<string>;
    //async getChainIdHash(enc?: '' | undefined): Promise<Uint8Array>;
    async getChainIdHash(enc?: string): Promise<Uint8Array | string> {
        let hash: Uint8Array;
        if (typeof this.chainIdHash === 'undefined') {
            // Fetch blockchain data to set chainIdHash
            await this.blockchain();
        }
        hash = this.chainIdHash;
        if (enc === 'base58') {
            return bs58.encode(Buffer.from(hash));
        }
        return hash;
    }

    /**
     * Request current status of blockchain.
     * @returns {Promise<object>} an object detailing the current status
     */
    blockchain(): Promise<GrpcBlockchainStatus.AsObject> {
        const _this = this;
        return waterfall([
            marshalEmpty,
            this.grpcMethod<Empty, GrpcBlockchainStatus>(this.client.client.blockchain),
            async function unmarshal(response: GrpcBlockchainStatus): Promise<GrpcBlockchainStatus.AsObject> {
                if (typeof _this.chainIdHash === 'undefined') {
                    // set chainIdHash automatically
                    _this.setChainIdHash(Buffer.from(response.getBestChainIdHash_asU8()));
                }
                return {
                    ...response.toObject(),
                    bestBlockHash: Block.encodeHash(response.getBestBlockHash_asU8()),
                    bestChainIdHash: Block.encodeHash(response.getBestChainIdHash_asU8())
                };
            },
        ])(null);
    }

    /**
     * Request current status of blockchain.
     * @returns {Promise<object>} an object detailing the current status
     */
    getChainInfo(): Promise<ChainInfo> {
        return waterfall([
            marshalEmpty,
            this.grpcMethod<Empty, GrpcChainInfo>(this.client.client.getChainInfo),
            async function unmarshal(response: GrpcChainInfo): Promise<ChainInfo> {
                return ChainInfo.fromGrpc(response);
            }
        ])(null);
    }

    /**
     * Request current status of node.
     * @returns {Promise<any>} an object detailing the state of various node components
     */
    getNodeState(component?: string, timeout = 5): Promise<any> {
        return waterfall([
            async function marshal(component?: string): Promise<NodeReq> {
                const params = new NodeReq();
                params.setTimeout(fromNumber(timeout));
                if (typeof component !== 'undefined') {
                    params.setComponent(Buffer.from(component));
                }
                return params;
            },
            this.grpcMethod<NodeReq, SingleBytes>(this.client.client.nodeState),
            async function unmarshal(response: SingleBytes): Promise<any> {
                return JSON.parse(Buffer.from(response.getValue_asU8()).toString());
            }
        ])(component);
    }

    /**
     * Get transaction information in the aergo node. 
     * If transaction is in the block return result with block hash and index.
     * @param {string} txhash transaction hash
     * @returns {Promise<object>} transaction details, object of tx: <Tx> and block: { hash, idx }
     */
    getTransaction(txhash: string): Promise<GetTxResult> {
        const singleBytes = new SingleBytes();
        singleBytes.setValue(Uint8Array.from(decodeTxHash(txhash)));
        return new Promise((resolve, reject) => {
            this.client.client.getBlockTX(singleBytes, (err, result: TxInBlock) => {
                if (err) {
                    this.client.client.getTX(singleBytes, (err, result: GrpcTx) => {
                        if (err) {
                            reject(err);
                        } else {
                            const res = <any>{};
                            res.tx = Tx.fromGrpc(result);
                            resolve(res);
                        }
                    });
                } else {
                    const res = <GetTxResult>{};
                    res.block = {
                        hash: Block.encodeHash(result.getTxidx().getBlockhash_asU8()),
                        idx: result.getTxidx().getIdx()
                    };
                    res.tx = Tx.fromGrpc(result.getTx());
                    resolve(res);
                }
            });
        });
    }

    /**
     * Retrieve information about a block.
     * 
     * @param hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @returns block details
     */
    getBlock(hashOrNumber: string | number): Promise<Block> {
        return waterfall([
            marshalHashOrNumberToSingleBytes,
            this.grpcMethod<SingleBytes, GrpcBlock>(this.client.client.getBlock),
            async function unmarshal(response: GrpcBlock): Promise<Block> {
                return Block.fromGrpc(response);
            }
        ])(hashOrNumber);
    }

    /**
     * Retrieve block metadata (excluding body).
     * 
     * @param hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @returns block metadata
     */
    getBlockMetadata(hashOrNumber: string | number): Promise<BlockMetadata> {
        return waterfall([
            marshalHashOrNumberToSingleBytes,
            this.grpcMethod<SingleBytes, GrpcBlockMetadata>(this.client.client.getBlockMetadata),
            async function unmarshal(response: GrpcBlockMetadata): Promise<BlockMetadata> {
                return BlockMetadata.fromGrpc(response);
            }
        ])(hashOrNumber);
    }

    /**
     * Retrieve the last n blocks, beginning from given block
     * 
     * @param {string|number} hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @param {number} size number of blocks to return
     * @param {number} offset number of blocks to skip
     * @param {boolean} desc order of blocks
     * @returns {Promise<Block[]>} list of block headers (blocks without body)
     */
    getBlockHeaders(hashOrNumber: string | number, size = 10, offset = 0, desc = true): Promise<Block[]> {
        const params = new ListParams();
        if (typeof hashOrNumber === 'string') {
            const decodedHash = Block.decodeHash(hashOrNumber)
            if (decodedHash.length != 32) {
                throw new Error('Invalid block hash. Must be 32 byte encoded in bs58. Did you mean to pass a block number?');
            }
            params.setHash(Uint8Array.from(decodedHash));
        } else
        if (typeof hashOrNumber === 'number') {
            params.setHeight(hashOrNumber);
        } else {
            throw new Error('Block hash or number required.');
        }
        params.setSize(size);
        params.setOffset(offset);
        params.setAsc(!desc);
        return promisify(this.client.client.listBlockHeaders, this.client.client)(params).then(result => {
            return result.getBlocksList().map(item => Block.fromGrpc(item));
        });
    }

    getBlockStream(): Stream<Block> {
        const empty = new Empty();
        const stream = this.client.client.listBlockStream(empty);
        try {
            stream.on('error', (error) => {
                if (error.code === 1) { // grpc.status.CANCELLED
                    return;
                }
            });
        } catch (e) {
            // ignore. 'error' does not work on grpc-web implementation
        }
        return {
            _stream: stream,
            on: (ev, callback) => stream.on(ev, data => callback(Block.fromGrpc(data))),
            cancel: () => stream.cancel()
        } as Stream<Block>;
    }

    /**
     * Returns a stream of block metadata
     */
    getBlockMetadataStream(): Stream<BlockMetadata> {
        const empty = new Empty();
        const stream = this.client.client.listBlockMetadataStream(empty);
        try {
            stream.on('error', (error) => {
                if (error.code === 1) { // grpc.status.CANCELLED
                    return;
                }
            });
        } catch (e) {
            // ignore. 'error' does not work on grpc-web implementation
        }
        return {
            _stream: stream,
            on: (ev, callback) => stream.on(ev, data => callback(BlockMetadata.fromGrpc(data))),
            cancel: () => stream.cancel()
        } as Stream<BlockMetadata>;
    }

    /**
     * Get the transactions of a block in a paged manner
     * @param hash 
     * @param offset 
     * @param size 
     */
    async getBlockBody(hashOrNumber: string|number, offset = 0, size = 10): Promise<BlockBodyPaged> {
        const paging = new PageParams();
        paging.setOffset(offset);
        paging.setSize(size);
        const params = new BlockBodyParams();
        params.setHashornumber((await marshalHashOrNumberToSingleBytes(hashOrNumber)).getValue());
        params.setPaging(paging);
        return await promisify(this.client.client.getBlockBody, this.client.client)(params).then((grpcObject: GrpcBlockBodyPaged) => {
            const obj = grpcObject.toObject();
            if (obj.body && obj.body.txsList) {
                obj.body.txsList = grpcObject.getBody().getTxsList().map(tx => Tx.fromGrpc(tx));
            }
            return obj as BlockBodyPaged;
        });
    }

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
    getEventStream(filter: Partial<FilterInfo>): Stream<Event> {
        const fi = new FilterInfo(filter);
        const query = fi.toGrpc();
        const stream = this.client.client.listEventStream(query);
        try {
            stream.on('error', (error) => {
                if (error.code === 1) { // grpc.status.CANCELLED
                    return;
                }
            });
        } catch (e) {
            // ignore. 'error' does not work on grpc-web implementation
        }
        return {
            _stream: stream,
            on: (ev, callback) => stream.on(ev, data => callback(Event.fromGrpc(data))),
            cancel: () => stream.cancel()
        } as Stream<Event>;
    }
    
    
    /**
     * Retrieve account state, including current balance and nonce.
     * @param {string} address Account address encoded in Base58check
     * @returns {Promise<object>} account state
     */
    getState(address: AddressInput): Promise<State> {
        const singleBytes = new SingleBytes();
        singleBytes.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.client.getState, this.client.client)(singleBytes).then(grpcObject => State.fromGrpc(grpcObject));
    }
    
    /**
     * Retrieve account's most recenlty used nonce.
     * This is a shortcut function as the same information is also returned by getState.
     * @param {string} address Account address encoded in Base58check
     * @returns {Promise<object>} account state
     */
    getNonce(address: AddressInput): Promise<number> {
        const singleBytes = new SingleBytes();
        singleBytes.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.client.getState, this.client.client)(singleBytes).then(grpcObject => grpcObject.getNonce());
    }

    /**
     * Send a signed transaction to the network.
     * @param {Tx} tx signed transaction
     * @returns {Promise<string>} transaction hash
     */
    sendSignedTransaction(tx): Promise<string> {
        return new Promise((resolve, reject) => {
            const txs = new TxList();
            if (!(tx instanceof Tx)) {
                tx = new Tx(tx);
            }
            txs.addTxs(tx.toGrpc(), 0);
            this.client.client.commitTX(txs, (err: Error, result: CommitResultList) => {
                if (err == null && result.getResultsList()[0].getError()) {
                    const obj = result.getResultsList()[0].toObject();
                    err = new TransactionError(errorMessageForCode(obj.error) + ': ' + obj.detail);
                }
                if (err) {
                    reject(new TransactionError(err.message));
                } else {
                    resolve(encodeTxHash(result.getResultsList()[0].getHash_asU8()));
                }
            });
        });
    }

    /**
     * Return the top {count} result for a vote
     * @param count number
     * @param id vote identifier, default: voteBP
     */
    getTopVotes(count: number, id: string = "voteBP"): Promise<any> {
        const params = new VoteParams();
        params.setCount(count);
        params.setId(id);
        return promisify(this.client.client.getVotes, this.client.client)(params).then(
            state => state.getVotesList().map((item: Vote) => ({
                amount: new Amount(item.getAmount_asU8()),
                candidate: id === "voteBP" ? bs58.encode(Buffer.from(item.getCandidate_asU8())) : Buffer.from(item.getCandidate_asU8()).toString(),
            }))
        );
    }
    /**
     * Return the top voted-for block producer or system parameter
     * @param address string
     */
    getAccountVotes(address: AddressInput): Promise<any> {
        const accountAddress = new AccountAddress();
        accountAddress.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.client.getAccountVotes, this.client.client)(accountAddress);
    }

    /**
     * Return information for account name
     * @param {string} address Account address encoded in Base58check
     */
    getStaking(address: AddressInput) {
        const singleBytes = new SingleBytes();
        singleBytes.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.client.getStaking, this.client.client)(singleBytes).then(
            (grpcObject: Staking) => {
                return {
                    amount: new Amount(grpcObject.getAmount_asU8()),
                    when: grpcObject.getWhen()
                };
            }
        );
    }

    /**
     * Retrieve the transaction receipt for a transaction
     * @param {string} txhash transaction hash
     * @return {Promise<object>} transaction receipt
     */
    getTransactionReceipt(txhash: string): Promise<GetReceiptResult> {
        const singleBytes = new SingleBytes();
        singleBytes.setValue(Uint8Array.from(decodeTxHash(txhash)));
        return promisify(this.client.client.getReceipt, this.client.client)(singleBytes).then((grpcObject: GrpcReceipt) => {
            const obj = grpcObject.toObject();
            return {
                contractaddress: new Address(grpcObject.getContractaddress_asU8()),
                result: obj.ret,
                status: obj.status,
                fee: new Amount(grpcObject.getFeeused_asU8()),
                cumulativefee: new Amount(grpcObject.getCumulativefeeused_asU8()),
                blockno: obj.blockno,
                blockhash: Block.encodeHash(grpcObject.getBlockhash_asU8()),
                feeDelegation: obj.feedelegation,
                gasused: obj.gasused,
            } as GetReceiptResult;
        });
    }

    /**
     * Query contract ABI
     * @param {FunctionCall} functionCall call details
     * @returns {Promise<object>} result of query
     */
    queryContract(functionCall: FunctionCall) {
        const query = functionCall.toGrpc();
        return promisify(this.client.client.queryContract, this.client.client)(query).then(
            grpcObject => JSON.parse(Buffer.from(grpcObject.getValue()).toString())
        );
    }

    /**
     * Query contract state.
     * This only works for variables explicitly defines as state variables.
     * Throws when contract do not exist, or when variable does not exist when requesting single key.
     * @param {StateQuery} stateQuery query details obtained from contract.queryState()
     * @returns {Promise<JsonData>} result of query: single value if requesting one key, list of values when requesting multiple keys.
     */
    queryContractState(stateQuery: StateQuery): Promise<JsonData | BasicType> {
        const query = stateQuery.toGrpc();
        return promisify(this.client.client.queryContractState, this.client.client)(query).then(
            (grpcObject: GrpcStateQueryProof) => {
                const addr = new Address(query.getContractaddress_asU8());
                if (grpcObject.getContractproof().getInclusion() === false) {
                    throw Error(`contract does not exist at address ${addr.toString()}`);
                }
                const list = grpcObject.getVarproofsList();
                if (list.length === 1) {
                    const varProof = list[0];
                    if (varProof.getInclusion() === false) {
                        throw Error(`queried variable 0x${Buffer.from(stateQuery.storageKeys[0] as any).toString('hex')} does not exist in state at address ${addr.toString()}`);
                    }
                    const value = varProof.getValue_asU8();
                    if (value.length > 0) {
                        return JSON.parse(Buffer.from(value).toString());
                    }
                }
                return list.map(varProof => {
                    const value = varProof.getValue_asU8();
                    if (value.length > 0) {
                        return JSON.parse(Buffer.from(value).toString());
                    }
                    return void 0;
                });
            }
        );
    }

    /**
     * Query contract state, including proofs.
     * This only works vor variables explicitly defines as state variables.
     * @param {StateQuery} stateQuery query details obtained from contract.queryState()
     * @returns {Promise<StateQueryProof>} result of query, including account and var proofs
     */
    queryContractStateProof(stateQuery: StateQuery): Promise<StateQueryProof> {
        const query = stateQuery.toGrpc();
        return promisify(this.client.client.queryContractState, this.client.client)(query).then(
            (grpcObject: GrpcStateQueryProof) => StateQueryProof.fromGrpc(grpcObject)
        );
    }

    /**
     * Query contract state
     * This only works vor variables explicitly defines as state variables.
     * @param {FilterInfo} filter :class:`FilterInfo`
     * @returns {Event[]} list of events
     */
    getEvents(filter: Partial<FilterInfo>): Promise<Event[]> {
        const fi = new FilterInfo(filter);
        const query = fi.toGrpc();
        return promisify(this.client.client.listEvents, this.client.client)(query).then(
            (grpcObject: EventList) => {
                const list = grpcObject.getEventsList();
                return list.map(item => Event.fromGrpc(item));
            }
        );
    }

    /**
     * Query contract ABI
     * @param {string} address of contract
     * @returns {Promise<object>} abi
     */
    getABI(address: AddressInput) {
        const singleBytes = new SingleBytes();
        singleBytes.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.client.getABI, this.client.client)(singleBytes).then(
            (grpcObject: GrpcABI) => {
                const obj = grpcObject.toObject();
                return {
                    language: obj.language,
                    version: obj.version,
                    functions: obj.functionsList.map(item => ({
                        name: item.name,
                        arguments: item.argumentsList,
                        view: item.view,
                        payable: item.payable,
                        feeDelegation: item.feeDelegation,
                    })),
                    state_variables: obj.stateVariablesList
                };
            }
        );
    }

    /**
     * Get list of peers of connected node
     */
    getPeers(showself = true, showhidden = true) {
        const query = new PeersParams();
        query.setNohidden(!showhidden);
        query.setShowself(showself);
        return promisify(this.client.client.getPeers, this.client.client)(query).then(
            (grpcObject: GrpcPeerList): Array<Peer> => grpcObject.getPeersList().map(
                (peer: GrpcPeer): Peer => Peer.fromGrpc(peer)
            )
        );
    }

    /**
     * Return information for account name
     * @param name 
     */
    getNameInfo(name: string): Promise<NameInfoResult> {
        const nameObj = new Name();
        nameObj.setName(name);
        return promisify(this.client.client.getNameInfo, this.client.client)(nameObj).then(
            (grpcObject: NameInfo): NameInfoResult => {
                const obj = grpcObject.toObject();
                return {
                    name: obj.name.name,
                    owner: new Address(grpcObject.getOwner_asU8()),
                    destination: new Address(grpcObject.getDestination_asU8())
                };
            }
        );
    }

    /**
     * Return consensus info. The included fields can differ by consensus type.
     */
    getConsensusInfo(): Promise<ConsensusInfoResult> {
        return waterfall([
            marshalEmpty,
            this.grpcMethod<Empty, ConsensusInfo>(this.client.client.getConsensusInfo),
            async function unmarshal(response: ConsensusInfo): Promise<ConsensusInfoResult> {
                const obj = response.toObject();
                const result: ConsensusInfoResult = {
                    type: obj.type,
                    info: obj.info ? JSON.parse(obj.info) : {},
                    bpsList: obj.bpsList.map(info => JSON.parse(info))
                };
                return result;
            }
        ])(null);
    }

    /**
     * Return server info
     */
    getServerInfo(keys?: string[]): Promise<ServerInfoResult> {
        return waterfall([
            async function marshal(keys?: string[]): Promise<KeyParams> {
                const params = new KeyParams();
                if (typeof keys !== 'undefined') {
                    params.setKeyList(keys);
                }
                return params;
            },
            this.grpcMethod<KeyParams, ServerInfo>(this.client.client.getServerInfo),
            async function unmarshal(response: ServerInfo): Promise<ServerInfoResult> {
                const obj = response.toObject();
                const result: ServerInfoResult = {
                    configMap: new Map<string, Map<string, string>>(),
                    statusMap: new Map<string, string>(obj.statusMap)
                };
                const configMap = new Map(obj.configMap);
                for (const [key, item] of configMap) {
                    result.configMap.set(key, new Map(item.propsMap));
                }
                return result;
                
            }
        ])(keys);
    }
}

export default AergoClient;
