import { Personal, Empty, CommitResult } from '../../types/rpc_pb';
import { Account } from '../../types/account_pb';
import { Tx as GrpcTx } from '../../types/blockchain_pb';
import Tx from '../models/tx';
import { encodeTxHash } from '../transactions/utils';
import Address from '../models/address';
import promisify from '../promisify.js';
import { errorMessageForCode } from '../utils';

/**
 * Accounts controller. It is exposed at `aergoClient.accounts`.
 */
class Accounts {
    client: any;

    constructor (aergo) {
        this.client = aergo.client;
    }
    
    /**
     * Create a new account in the node.
     * @param {string} passphrase 
     * @returns {Promise<Address>} newly created account address
     */
    create (passphrase: string): Promise<Address> {
        return new Promise((resolve, reject) => {
            const personal = new Personal();
            personal.setPassphrase(passphrase);
            try {
                this.client.client.createAccount(personal, (err, rsp) => {
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
     * @returns {Promise<Address[]>} list of account addresses
     */
    get (): Promise<Address[]> {
        return new Promise((resolve, reject) => {
            const empty = new Empty();
            try {
                this.client.client.getAccounts(empty, (err, rsp) => {
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
     * @param {Address|string} address 
     * @param {Address|string} passphrase 
     * @returns {Promise<Address>} unlocked account address
     */
    unlock (address: Address|string, passphrase: string): Promise<Address> {
        return new Promise((resolve, reject) => {
            const account = new Account();
            account.setAddress((new Address(address)).asBytes());

            const personal = new Personal();
            personal.setPassphrase(passphrase);
            personal.setAccount(account);

            try {
                this.client.client.unlockAccount(personal, (err, rsp) => {
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
     * @param {Address|string} address 
     * @param {Address|string} passphrase 
     * @returns {Promise<Address>} locked account address
     */
    lock (address: Address|string, passphrase: string): Promise<Address> {
        return new Promise((resolve, reject) => {
            const account = new Account();
            account.setAddress((new Address(address)).asBytes());

            const personal = new Personal();
            personal.setPassphrase(passphrase);
            personal.setAccount(account);

            try {
                this.client.client.lockAccount(personal, (err, rsp) => {
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
    sendTransaction (tx): Promise<string> {
        if (!(tx instanceof Tx)) {
            tx = new Tx(tx);
        }
        return promisify(this.client.client.sendTX, this.client.client)(tx.toGrpc()).then((result: CommitResult) => {
            const obj = result.toObject();
            if (obj.error && obj.detail) {
                throw new Error(errorMessageForCode(obj.error) + ': ' + obj.detail);
            }
    
            return encodeTxHash(result.getHash_asU8())
        });
    }

    /**
     * Sign transaction.
     * @param {Tx} tx transaction data
     * @returns {Promise<Tx>} transaction data including signature
     */
    signTransaction (_tx: Tx|object): Promise<Tx> {
        let tx: Tx;
        if (!(_tx instanceof Tx)) {
            tx = new Tx(_tx);
        } else {
            tx = _tx;
        }
        return promisify(this.client.client.signTX, this.client.client)(tx.toGrpc()).then((signedtx: GrpcTx) => Tx.fromGrpc(signedtx));
    }
}

export default Accounts;