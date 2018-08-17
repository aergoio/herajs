import Base58 from 'base-58';
import rpcTypes from '../client/types.js';
import { toHexString, fromHexString } from '../utils.js';

export function transactionToTx(tx) {
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
    msgtx.setHash(fromHexString(tx.hash));
    msgtx.setBody(msgtxbody);

    return msgtx;
}

export function txToTransaction(tx) {
    const transaction = {};
    transaction.hash = toHexString(tx.getHash());
    transaction.nonce = tx.getBody().getNonce();
    transaction.from = Base58.encode(tx.getBody().getAccount());
    transaction.to = Base58.encode(tx.getBody().getRecipient());
    transaction.amount = tx.getBody().getAmount();
    transaction.payload = tx.getBody().getPayload();
    transaction.sign = tx.getBody().getSign();
    return transaction;
}