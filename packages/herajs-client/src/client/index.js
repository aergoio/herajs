import rpcTypes from './types.js';
import { fromHexString, fromNumber } from '../utils.js';
import promisify from '../promisify.js';

import Base58 from 'base-58';

import Accounts from '../accounts';

const CommitStatus = rpcTypes.CommitStatus;
export { CommitStatus };

class AergoClient {
    constructor (config) {
        this.version = 0.1;
        this.config = {
            url: '127.0.0.1:7845', // protocol is determined by client
            ...config
        };
        this.client = this.initClient(this.config);
        this.accounts = new Accounts(this);
    }

    initClient(config) {
        // override
    }

    getConfig () {
        return this.config;
    }

    isConnected () {
        return false;
    }

    blockchain () {
        const empty = new rpcTypes.Empty();
        return promisify(this.client.blockchain, this.client)(empty);
    }

    getTransaction () {
        const singleBytes = new rpcTypes.SingleBytes();
        return promisify(this.client.getTX, this.client)(singleBytes);
    }

    getBlock (hashOrNumber) {
        if (typeof hashOrNumber === 'string') {
            hashOrNumber = fromHexString(hashOrNumber);
        } else
        if (typeof hashOrNumber === 'number') {
            hashOrNumber = fromNumber(hashOrNumber);
        }
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(hashOrNumber);
        return promisify(this.client.getBlock, this.client)(singleBytes);
    }

    getBlockTransactionCount () {
        const singleBytes = new rpcTypes.SingleBytes();
        return promisify(this.client.getTX, this.client)(singleBytes);
    }

    verifyTransaction (tx) {
        return promisify(this.client.verifyTX, this.client)(transactionToTx(tx));
    }

    sendTransaction (tx) {        
        return new Promise((resolve, reject) => {
            const txs = new rpcTypes.TxList();
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
    const msgtxbody = new rpcTypes.TxBody();
    msgtxbody.setNonce(tx.nonce);
    msgtxbody.setAccount(Base58.decode(tx.from));
    msgtxbody.setRecipient(Base58.decode(tx.to));
    msgtxbody.setAmount(tx.amount);
    if (tx.payload != null) {
        msgtxbody.setPayload(tx.payload);
    }
    msgtxbody.setSign(tx.sign);
    const msgtx = new rpcTypes.Tx();
    msgtx.setHash(tx.hash);
    msgtx.setBody(msgtxbody);

    return msgtx;
}

export default AergoClient;
