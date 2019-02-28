import Accounts from '../accounts';
import rpcTypes from './types';
import { TxInBlock, Tx as GrpcTx, StateQueryProof, ABI as GrpcABI, Block as GrpcBlock } from '../../types/blockchain_pb';
import {
    Empty, PeerList as GrpcPeerList, Peer as GrpcPeer,
    BlockchainStatus as GrpcBlockchainStatus, CommitResultList,
    Name, NameInfo, Staking, ChainInfo as GrpcChainInfo,
    SingleBytes
} from '../../types/rpc_pb';
import { fromNumber, toBytesUint32, errorMessageForCode } from '../utils';
import promisify from '../promisify';
import { decodeTxHash, encodeTxHash } from '../transactions/utils';
import Tx from '../models/tx';
import Block from '../models/block';
import BlockMetadata from '../models/blockmetadata';
import Address from '../models/address';
import Peer from '../models/peer';
import State from '../models/state';
import Amount from '../models/amount';
import ChainInfo from '../models/chaininfo';
import { FunctionCall, StateQuery } from '../models/contract';

import bs58 from 'bs58';

const CommitStatus = rpcTypes.CommitStatus;
export { CommitStatus };

type PromiseFunction = (n: any) => Promise<any>;
function waterfall(fns: PromiseFunction[]) {
    return async function(input: any): Promise<any> {
        let result = input;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    }
}
async function marshalEmpty(): Promise<Empty> {
    return new Empty();
}

/**
 * Main aergo client controller.
 */
class AergoClient {
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
    constructor (config = {}, provider = null) {
        this.config = {
            ...config
        };
        this.client = provider || this.defaultProvider();
        this.accounts = new Accounts(this);
    }

    defaultProvider() {
        // Platform-specific override, see ../platforms/**
        // for auto-configuration of a provider.
        // Can also manually pass provider to constructor.
    }

    /**
     * Set a new provider
     * @param {Provider} provider
     */
    setProvider(provider) {
        this.client = provider;
    }

    getConfig () {
        return this.config;
    }

    isConnected () {
        // FIXME
        return false;
    }

    grpcMethod<I, O>(method: Function): (request: I) => Promise<O> {
        return (request: I) => promisify(method, this.client.client)(request);
    }

    /**
     * Request current status of blockchain.
     * @returns {Promise<object>} an object detailing the current status
     */
    blockchain (): Promise<GrpcBlockchainStatus.AsObject> {
        return waterfall([
            marshalEmpty,
            this.grpcMethod<Empty, GrpcBlockchainStatus>(this.client.client.blockchain),
            async function unmarshal(response: GrpcBlockchainStatus): Promise<GrpcBlockchainStatus.AsObject> {
                return {
                    ...response.toObject(),
                    bestBlockHash: Block.encodeHash(response.getBestBlockHash_asU8())
                };
            }
        ])({});
    }

    /**
     * Request current status of blockchain.
     * @returns {Promise<object>} an object detailing the current status
     */
    getChainInfo (): Promise<ChainInfo> {
        return waterfall([
            marshalEmpty,
            this.grpcMethod<Empty, GrpcChainInfo>(this.client.client.getChainInfo),
            async function unmarshal(response: GrpcChainInfo): Promise<ChainInfo> {
                return ChainInfo.fromGrpc(response);
            }
        ])({});
    }

    /**
     * Get transaction information in the aergo node. 
     * If transaction is in the block return result with block hash and index.
     * @param {string} txhash transaction hash
     * @returns {Promise<object>} transaction details, object of tx: <Tx> and block: { hash, idx }
     */
    getTransaction (txhash): Promise<any> {
        const singleBytes = new rpcTypes.SingleBytes();
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
                    const res = <any>{};
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
     * @param {string|number} hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @returns {Promise<Block>} block details
     */
    getBlock (hashOrNumber: string | number): Promise<Block> {
        return waterfall([
            async function marshal(hashOrNumber: string | number): Promise<SingleBytes> {
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
            },
            this.grpcMethod<SingleBytes, GrpcBlock>(this.client.client.getBlock),
            async function unmarshal(response: GrpcBlock): Promise<Block> {
                return Block.fromGrpc(response);
            }
        ])(hashOrNumber);
    }

    /**
     * Retrieve the last n blocks, beginning from given block .
     * 
     * @param {string|number} hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @param {number} size number of blocks to return
     * @returns {Promise<Block[]>} list of block headers (blocks without body)
     */
    getBlockHeaders (hashOrNumber, size = 10, offset = 0, desc = true) {
        const params = new rpcTypes.ListParams();
        if (typeof hashOrNumber === 'string') {
            hashOrNumber = Block.decodeHash(hashOrNumber);
            if (hashOrNumber.length != 32) {
                throw new Error('Invalid block hash. Must be 32 byte encoded in bs58. Did you mean to pass a block number?');
            }
            params.setHash(Uint8Array.from(hashOrNumber));
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

    getBlockStream () {
        const empty = new rpcTypes.Empty();
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
        };
    }

    getBlockMetadataStream () {
        const empty = new rpcTypes.Empty();
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
        };
    }
    
    
    /**
     * Retrieve account state, including current balance and nonce.
     * @param {string} address Account address encoded in Base58check
     * @returns {Promise<object>} account state
     */
    getState (address) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.client.getState, this.client.client)(singleBytes).then(grpcObject => State.fromGrpc(grpcObject));
    }
    
    getNonce(address) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.client.getState, this.client.client)(singleBytes).then(grpcObject => grpcObject.getNonce());
    }

    verifyTransaction (/*tx*/) {
        // Untested
        return promisify(this.client.client.verifyTX, this.client.client)()(grpcObject => Tx.fromGrpc(grpcObject));
    }

    /**
     * Send a signed transaction to the network.
     * @param {Tx} tx signed transaction
     * @returns {Promise<string>} transaction hash
     */
    sendSignedTransaction (tx) {
        return new Promise((resolve, reject) => {
            const txs = new rpcTypes.TxList();
            if (!(tx instanceof Tx)) {
                tx = new Tx(tx);
            }
            txs.addTxs(tx.toGrpc(), 0);
            this.client.client.commitTX(txs, (err, result: CommitResultList) => {
                if (err == null && result.getResultsList()[0].getError()) {
                    const obj = result.getResultsList()[0].toObject();
                    err = new Error(errorMessageForCode(obj.error) + ': ' + obj.detail);
                }
                if (err) {
                    reject(err);
                } else {
                    resolve(encodeTxHash(result.getResultsList()[0].getHash_asU8()));
                }
            });
        });
    }

    /**
     * Return the top voted-for block producer
     * @param count number
     */
    getTopVotes(count: number): Promise<any> {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(new Uint8Array(toBytesUint32(count)));
        return promisify(this.client.client.getVotes, this.client.client)(singleBytes).then(
            state => state.getVotesList().map(item => ({
                amount: new Amount(item.getAmount_asU8()),
                candidate: bs58.encode(item.getCandidate_asU8())
            }))
        );
    }

    /**
     * Return information for account name
     * @param {string} address Account address encoded in Base58check
     */
    getStaking (address) {
        const singleBytes = new rpcTypes.SingleBytes();
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
    getTransactionReceipt (txhash) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(Uint8Array.from(decodeTxHash(txhash)));
        return promisify(this.client.client.getReceipt, this.client.client)(singleBytes).then(grpcObject => {
            const obj = grpcObject.toObject();
            return {
                contractaddress: new Address(grpcObject.getContractaddress_asU8()),
                result: obj.ret, //JSON.parse(obj.ret),
                status: obj.status
            };
        });
    }

    /**
     * Query contract ABI
     * @param {FunctionCall} functionCall call details
     * @returns {Promise<object>} result of query
     */
    queryContract (functionCall: FunctionCall) {
        const query = functionCall.toGrpc();
        return promisify(this.client.client.queryContract, this.client.client)(query).then(
            grpcObject => JSON.parse(Buffer.from(grpcObject.getValue()).toString())
        );
    }

    /**
     * Query contract state
     * This only works vor variables explicitly defines as state variables.
     * @param {StateQuery} stateQuery query details obtained from contract.queryState()
     * @returns {Promise<object>} result of query
     */
    queryContractState (stateQuery: StateQuery) {
        const query = stateQuery.toGrpc();
        return promisify(this.client.client.queryContractState, this.client.client)(query).then(
            (grpcObject: StateQueryProof) => {
                const varProof = grpcObject.getVarproofsList()[0];
                if (varProof.getInclusion() === false) {
                    const addr = new Address(query.getContractaddress_asU8());
                    throw Error(`queried variable ${query.getStoragekeysList()[0]} does not exists in state at address ${addr.toString()}`);
                }
                const value = varProof.getValue_asU8();
                if (value.length > 0) {
                    return JSON.parse(Buffer.from(varProof.getValue_asU8()).toString());
                }
                return null;
            }
        );
    }

    /**
     * Query contract ABI
     * @param {string} address of contract
     * @returns {Promise<object>} abi
     */
    getABI (address) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.client.getABI, this.client.client)(singleBytes).then(
            (grpcObject: GrpcABI) => {
                const obj = grpcObject.toObject();
                return {
                    language: obj.language,
                    version: obj.version,
                    functions: obj.functionsList.map(item => ({
                        name: item.name,
                        arguments: item.argumentsList
                    })),
                    state_variables: obj.stateVariablesList
                };
            }
        );
    }

    /**
     * Get list of peers of connected node
     */
    getPeers () {
        const empty = new rpcTypes.Empty();
        return promisify(this.client.client.getPeers, this.client.client)(empty).then(
            (grpcObject: GrpcPeerList): Array<Peer> => grpcObject.getPeersList().map(
                (peer: GrpcPeer): Peer => Peer.fromGrpc(peer)
            )
        );
    }

    /**
     * Return information for account name
     * @param name 
     */
    getNameInfo (name) {
        const nameObj = new Name();
        nameObj.setName(name);
        return promisify(this.client.client.getNameInfo, this.client.client)(nameObj).then(
            (grpcObject: NameInfo) => {
                const obj = grpcObject.toObject();
                return {
                    name: obj.name.name,
                    owner: new Address(grpcObject.getOwner_asU8())
                };
            }
        );
    }

    
}

export default AergoClient;