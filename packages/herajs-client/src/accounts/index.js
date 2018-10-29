import { Personal, Empty, Account, } from '../../types/rpc_pb.js';
import Tx from '../models/tx';
import { encodeTxHash } from '../transactions/utils';
import Address from '../models/address';
import promisify from '../promisify.js';

/**
 * Accounts controller. It is exposed at `aergoClient.accounts`.
 */
class Accounts {
    constructor (aergo) {
        this.client = aergo.client;
    }
    
    /**
     * Create a new account in the node.
     * @param {string} passphrase 
     * @returns {Promise<string>} newly created account address
     */
    create (passphrase) {
        return new Promise((resolve, reject) => {
            const personal = new Personal();
            personal.setPassphrase(passphrase);
            try {
                this.client.createAccount(personal, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const createdAddress = rsp.getAddress_asU8();
                        resolve(new Address(createdAddress));
                    }
                });
            } catch (exception) {
                reject(exception);
            }
        });
    }

    /**
     * Get list of accounts.
     * @returns {Promise<string[]>} list of account addresses
     */
    get () {
        return new Promise((resolve, reject) => {
            const empty = new Empty();
            try {
                this.client.getAccounts(empty, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const accounts = rsp.getAccountsList();
                        const addresses = accounts.map(account => new Address(account.getAddress_asU8()));
                        resolve(addresses);
                    }
                });
            } catch (exception) {
                reject(exception);
            }
        });
    }

    /**
     * Unlock account.
     * @param {string} address 
     * @param {string} passphrase 
     * @returns {Promise<string>} unlocked account address
     */
    unlock (address, passphrase) {
        return new Promise((resolve, reject) => {
            const account = new Account();
            account.setAddress((new Address(address)).asBytes());

            const personal = new Personal();
            personal.setPassphrase(passphrase);
            personal.setAccount(account);

            try {
                this.client.unlockAccount(personal, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const createdAddress = rsp.getAddress_asU8();
                        resolve(new Address(createdAddress));
                    }
                });
            } catch (exception) {
                reject(exception);
            }
        });
    }

    /**
     * Lock account.
     * @param {string} address 
     * @param {string} passphrase 
     * @returns {Promise<string>} locked account address
     */
    lock (address, passphrase) {
        return new Promise((resolve, reject) => {
            const account = new Account();
            account.setAddress((new Address(address)).asBytes());

            const personal = new Personal();
            personal.setPassphrase(passphrase);
            personal.setAccount(account);

            try {
                this.client.lockAccount(personal, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const createdAddress = rsp.getAddress_asU8();
                        resolve(new Address(createdAddress));
                    }
                });
            } catch (exception) {
                reject(exception);
            }
        });
    }

    /**
     * Convenience method to send transaction from account.
     * This method automatically retrieves the nonce, signs the transaction, and sends it to the network.
     * @param {Tx} tx transaction data
     * @returns {Promise<string>} transaction hash
     */
    sendTransaction (tx) {
        if (!(tx instanceof Tx)) {
            tx = new Tx(tx);
        }
        return promisify(this.client.sendTX, this.client)(tx.toGrpc()).then(result => encodeTxHash(result.getHash()));
    }

    /**
     * Sign transaction.
     * @param {Tx} tx transaction data
     * @returns {Promise<Tx>} transaction data including signature
     */
    signTransaction (tx) {
        if (!(tx instanceof Tx)) {
            tx = new Tx(tx);
        }
        return promisify(this.client.signTX, this.client)(tx.toGrpc()).then(signedtx => Tx.fromGrpc(signedtx));
    }
}



export default Accounts;