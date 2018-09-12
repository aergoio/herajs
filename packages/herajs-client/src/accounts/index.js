import { Personal, Empty, Account, TxBody, Tx } from '../../types/rpc_pb.js';
import Base58 from 'base-58';
import { txToTransaction } from '../transactions/utils.js';

class Accounts {
    constructor (aergo) {
        this.client = aergo.client;
    }
    
    create (passphrase) {
        return new Promise((resolve, reject) => {
            const personal = new Personal();
            personal.setPassphrase(passphrase);
            try {
                this.client.createAccount(personal, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const createdAddress = rsp.getAddress();
                        resolve(Base58.encode(createdAddress));
                    }
                });
            } catch (exception) {
                reject(exception);
            }
        });
    }

    get () {
        return new Promise((resolve, reject) => {
            const empty = new Empty();
            try {
                this.client.getAccounts(empty, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const accounts = rsp.getAccountsList();
                        const addresses = accounts.map(account => Base58.encode(account.getAddress()));
                        resolve(addresses);
                    }
                });
            } catch (exception) {
                reject(exception);
            }
        });
    }

    unlock (address, passphrase) {
        return new Promise((resolve, reject) => {
            const account = new Account();
            account.setAddress(Base58.decode(address));

            const personal = new Personal();
            personal.setPassphrase(passphrase);
            personal.setAccount(account);

            try {
                this.client.unlockAccount(personal, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const createdAddress = rsp.getAddress();
                        resolve(Base58.encode(createdAddress));
                    }
                });
            } catch (exception) {
                reject(exception);
            }
        });
    }

    lock (address, passphrase) {
        return new Promise((resolve, reject) => {
            const account = new Account();
            account.setAddress(Base58.decode(address));

            const personal = new Personal();
            personal.setPassphrase(passphrase);
            personal.setAccount(account);

            try {
                this.client.lockAccount(personal, (err, rsp) => {
                    if (err) {
                        reject(err);
                    } else {
                        const createdAddress = rsp.getAddress();
                        resolve(Base58.encode(createdAddress));
                    }
                });
            } catch (exception) {
                reject(exception);
            }
        });
    }


    signTransaction (tx) {
        return new Promise((resolve, reject) => {
            const msgtxbody = new TxBody();
            msgtxbody.setNonce(tx.nonce);
            msgtxbody.setAccount(Base58.decode(tx.from));
            msgtxbody.setRecipient(Base58.decode(tx.to));
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