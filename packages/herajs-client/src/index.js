import { Empty, SingleBytes, TxList, TxBody, Tx, CommitStatus } from '../types/rpc_pb.js';
import { AergoRPCServiceClient } from '../types/rpc_grpc_pb.js';
import { fromHexString } from './utils.js';

import grpc from 'grpc';
import Base58 from 'base-58';

import Accounts from './accounts';

export {CommitStatus};

class Aergo {
    constructor (config) {
        this.version = 0.1;
        this.config = {
            url: '127.0.0.1:7845',
            ...config
        };
        this.client = new AergoRPCServiceClient(this.config.url, grpc.credentials.createInsecure());
        this.accounts = new Accounts(this);
    }

    getConfig () {
        return this.config;
    }

    isConnected () {
        return false;
    }

    blockchain () {
        return new Promise((resolve, reject) => {
            const empty = new Empty();
            this.client.blockchain(empty, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    getTransaction () {
        return new Promise((resolve, reject) => {
            const singleBytes = new SingleBytes();
            this.client.getTX(singleBytes, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    getBlock (hashOrNumber) {
        return new Promise((resolve, reject) => {
            /*if (typeof hashOrNumber === 'string') {
                hashOrNumber = fromHexString(hashOrNumber);
            } else if( hashOrNumber.constructor === Uint8Array) {
                hashOrNumber = new Uint8Array([hashOrNumber]);
            }*/
            const singleBytes = new SingleBytes();
            singleBytes.setValue(hashOrNumber);
            this.client.getBlock(singleBytes, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    getBlockTransactionCount () {
        return new Promise((resolve, reject) => {
            const singleBytes = new SingleBytes();
            this.client.getTX(singleBytes, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    verifyTransaction (tx) {
        return new Promise((resolve, reject) => {
            this.client.verifyTX(transactionToTx(tx), (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    sendTransaction (tx) {
        return new Promise((resolve, reject) => {
            const txs = new TxList();
            txs.addTxs(transactionToTx(tx), 0);
            this.client.commitTX(txs, (err, result) => {
                if (err == null && result.getResultsList()[0].getError()) {
                    err = new Error();
                    err.code = result.getResultsList()[0].getError(); 
                }
                if (err) {
                    reject(err);
                } else {
                    resolve(result.getResultsList()[0].getHash());
                }
            });
        });
    }

    getTransactionReceipt (hash, callback) { // eslint-disable-line
        return true;
    }
}

function transactionToTx(tx) {
    const msgtxbody = new TxBody();
    msgtxbody.setNonce(tx.nonce);
    msgtxbody.setAccount(Base58.decode(tx.from));
    msgtxbody.setRecipient(Base58.decode(tx.to));
    msgtxbody.setAmount(tx.amount);
    if (tx.payload != null) {
        msgtxbody.setPayload(tx.payload);
    }
    msgtxbody.setSign(tx.sign);
    const msgtx = new Tx();
    msgtx.setHash(tx.hash);
    msgtx.setBody(msgtxbody);

    return msgtx;
}

export default Aergo;
