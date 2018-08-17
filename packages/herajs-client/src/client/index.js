import Accounts from '../accounts';
import rpcTypes from './types.js';
import { toHexString, fromHexString, fromNumber } from '../utils.js';
import promisify from '../promisify.js';
import { transactionToTx, txToTransaction } from '../transactions/utils.js';

const CommitStatus = rpcTypes.CommitStatus;
export { CommitStatus };

class AergoClient {
    constructor (config) {
        this.version = 0.1;
        this.config = {
            url: '127.0.0.1:7845', // Don't put http:// here, protocol is determined by client
            ...config
        };
        this.client = this.initClient(this.config);
        this.accounts = new Accounts(this);
    }

    initClient(config) {
        // platform-specific override
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

    getTransaction (txid) {
        const singleBytes = new rpcTypes.SingleBytes();
        singleBytes.setValue(fromHexString(txid));
        return promisify(this.client.getTX, this.client)(singleBytes).then(txToTransaction);
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
                    resolve(toHexString(result.getResultsList()[0].getHash()));
                }
            });
        });
    }

    getTransactionReceipt (hash, callback) { // eslint-disable-line
        return true;
    }
}





export default AergoClient;
