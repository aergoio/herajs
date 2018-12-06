import Accounts from '../accounts';
import rpcTypes from './types';
import { Empty, PeerList as GrpcPeerList, Peer as GrpcPeer } from '../../types/rpc_pb';
import { BlockchainStatus as GrpcBlockchainStatus } from '../../types/rpc_pb';
import { fromNumber, toBytesUint32, errorMessageForCode } from '../utils';
import promisify from '../promisify';
import { decodeTxHash, encodeTxHash } from '../transactions/utils';
import Tx from '../models/tx';
import Block from '../models/block';
import Address from '../models/address';
import Peer from '../models/peer';
import State from '../models/state';

const CommitStatus = rpcTypes.CommitStatus;
export { CommitStatus };

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
    constructor (config, provider = null) {
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
        return false;
    }

    /**
     * Request current status of blockchain.
     * @returns {Promise<object>} an object detailing the current status
     */
    blockchain (): Promise<GrpcBlockchainStatus.AsObject> {
        const empty = new Empty();
        return promisify(this.client.blockchain, this.client)(empty).then(result => ({
            ...result.toObject(),
            bestBlockHash: Block.encodeHash(result.getBestBlockHash_asU8())
        }));
    }

    /**
     * Get transaction information in the aergo node. 
     * If transaction is in the block return result with block hash and index.
     * @param {string} txhash transaction hash
     * @returns {Promise<object>} transaction details, object of tx: <Tx> and block: { hash, idx }
     */
    getTransaction (txhash) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(Uint8Array.from(decodeTxHash(txhash)));
        return new Promise((resolve, reject) => {
            this.client.getBlockTX(singleBytes, (err, result) => {
                if (err) {
                    this.client.getTX(singleBytes, (err, result) => {
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
    getBlock (hashOrNumber) {
        if (typeof hashOrNumber === 'undefined') {
            throw new Error('Missing argument block hash or number');
        }
        if (typeof hashOrNumber === 'string') {
            hashOrNumber = Block.decodeHash(hashOrNumber);
        } else
        if (typeof hashOrNumber === 'number') {
            hashOrNumber = fromNumber(hashOrNumber);
        }
        if (hashOrNumber.length != 32 && hashOrNumber.length != 8) {
            throw new Error('Invalid block hash. Must be 32 byte encoded in bs58. Did you mean to pass a block number?');
        }
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(Uint8Array.from(hashOrNumber));
        return promisify(this.client.getBlock, this.client)(singleBytes).then(result => Block.fromGrpc(result));
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
        return promisify(this.client.listBlockHeaders, this.client)(params).then(result => {
            return result.getBlocksList().map(item => Block.fromGrpc(item));
        });
    }

    getBlockStream () {
        const empty = new rpcTypes.Empty();
        const stream = this.client.listBlockStream(empty);
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
    
    /**
     * Retrieve account state, including current balance and nonce.
     * @param {string} address Account address encoded in Base58check
     * @returns {Promise<object>} account state
     */
    getState (address) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.getState, this.client)(singleBytes).then(grpcObject => State.fromGrpc(grpcObject));
    }
    
    getNonce(address) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(Uint8Array.from((new Address(address)).asBytes()));
        return promisify(this.client.getState, this.client)(singleBytes).then(grpcObject => grpcObject.getNonce());
    }

    verifyTransaction (/*tx*/) {
        // Untested
        return promisify(this.client.verifyTX, this.client)()(grpcObject => Tx.fromGrpc(grpcObject));
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
            this.client.commitTX(txs, (err, result) => {
                if (err == null && result.getResultsList()[0].getError()) {
                    err = new Error();
                    err.code = result.getResultsList()[0].getError(); 
                    err.message = errorMessageForCode(err.code);
                }
                if (err) {
                    reject(err);
                } else {
                    resolve(encodeTxHash(result.getResultsList()[0].getHash()));
                }
            });
        });
    }

    getVoteResult(count) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(new Uint8Array(toBytesUint32(count)));
        return promisify(this.client.getVotes, this.client)(singleBytes).then(state => state.getVotesList());
    }

    /**
     * Retrieve the transaction receipt for a transaction
     * @param {string} txhash transaction hash
     * @return {Promise<object>} transaction receipt
     */
    getTransactionReceipt (txhash) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(Uint8Array.from(decodeTxHash(txhash)));
        return promisify(this.client.getReceipt, this.client)(singleBytes).then(grpcObject => {
            const obj = grpcObject.toObject();
            return {
                contractaddress: new Address(grpcObject.getContractaddress_asU8()),
                result: obj.ret, //JSON.parse(obj.ret),
                status: obj.status
            };
        });
    }

    /**
     * Query contract state
     * @param {FunctionCall} functionCall call details
     * @returns {Promise<object>} result of query
     */
    queryContract (functionCall) {
        const query = new rpcTypes.Query();
        query.setContractaddress(Uint8Array.from((new Address(functionCall.contractInstance.address)).asBytes()));
        query.setQueryinfo(Uint8Array.from(Buffer.from(JSON.stringify(functionCall.asQueryInfo()))));
        return promisify(this.client.queryContract, this.client)(query).then(
            grpcObject => JSON.parse(Buffer.from(grpcObject.getValue()).toString())
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
        return promisify(this.client.getABI, this.client)(singleBytes).then(
            grpcObject => {
                const obj = grpcObject.toObject();
                return {
                    language: obj.language,
                    version: obj.version,
                    functions: obj.functionsList.map(item => ({
                        name: item.name,
                        arguments: item.argumentsList
                    }))
                };
            }
        );
    }

    /**
     * Get list of peers of connected node
     */
    getPeers () {
        const empty = new rpcTypes.Empty();
        return promisify(this.client.getPeers, this.client)(empty).then(
            (grpcObject: GrpcPeerList): Array<Peer> => grpcObject.getPeersList().map(
                (peer: GrpcPeer): Peer => Peer.fromGrpc(peer)
            )
        );
    }
}

export default AergoClient;