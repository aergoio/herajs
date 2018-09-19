import { Personal, Empty, Account, TxBody, Tx } from '../../types/rpc_pb.js';
import { txToTransaction } from '../transactions/utils.js';
import { errorMessageForCode } from '../utils.js';
import { encodeAddress, decodeAddress } from './utils.js';

/**
 * Accounts controller.
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
                        resolve(encodeAddress(createdAddress));
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
                        const addresses = accounts.map(account => encodeAddress(account.getAddress_asU8()));
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
            account.setAddress(decodeAddress(address));

            const personal = new Personal();
            personal.setPassphrase(passphrase);
            personal.setAccount(account);

            try {
                this.client.unlockAccount(personal, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const createdAddress = rsp.getAddress_asU8();
                        resolve(encodeAddress(createdAddress));
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
            account.setAddress(decodeAddress(address));

            const personal = new Personal();
            personal.setPassphrase(passphrase);
            personal.setAccount(account);

            try {
                this.client.lockAccount(personal, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const createdAddress = rsp.getAddress_asU8();
                        resolve(encodeAddress(createdAddress));
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
     * @param {object} tx transaction data
     * @returns {Promise<string>} transaction hash
     */
    sendTransaction (tx) {
        return new Promise((resolve, reject) => {
            const msgtxbody = new TxBody();
            msgtxbody.setAccount(decodeAddress(tx.from));
            msgtxbody.setRecipient(decodeAddress(tx.to));
            msgtxbody.setAmount(tx.amount);
            msgtxbody.setPayload(tx.payload);
            msgtxbody.setType(tx.type);

            const msgtx = new Tx();
            msgtx.setBody(msgtxbody);

            this.client.sendTX(msgtx, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.getHash_asB64());
                }
            });
        });
    }

    /**
     * Sign transaction.
     * @param {object} tx transaction data
     * @returns {Promise<object>} transaction data including signature
     */
    signTransaction (tx) {
        return new Promise((resolve, reject) => {
            const msgtxbody = new TxBody();
            msgtxbody.setNonce(tx.nonce);
            msgtxbody.setAccount(decodeAddress(tx.from));
            msgtxbody.setRecipient(decodeAddress(tx.to));
            msgtxbody.setAmount(tx.amount);
            msgtxbody.setPayload(tx.payload);
            msgtxbody.setType(tx.type);

            const msgtx = new Tx();
            msgtx.setBody(msgtxbody);

            this.client.signTX(msgtx, (err, signedtx) => {
                if (err == null) {
                    resolve(txToTransaction(signedtx));
                } else {
                    reject(err);
                }
            });
        });
    }
}



export default Accounts;