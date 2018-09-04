import Base58 from 'base-58';
import rpcTypes from '../client/types.js';
import { toHexString, fromHexString, fromB64String } from '../utils.js';

/*
tansaction = {
    hash : byte of base64 
    nonce : uint
    from : byte of base58
    to : byte of base58
    amount : uint
    payload : byte of base64
    sign : byte of base64
    type : int
}
*/

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
    msgtxbody.setType(tx.type);
    const msgtx = new rpcTypes.Tx();
    //msgtx.setHash(fromHexString(tx.hash));

    if (tx.hash != null) {
        msgtx.setHash(tx.hash);
    }
    msgtx.setBody(msgtxbody);

    return msgtx;
}

export function txToTransaction(tx) {
    const transaction = {};
    //transaction.hash = toHexString(tx.getHash());
    transaction.hash = tx.getHash_asB64();
    transaction.nonce = tx.getBody().getNonce();
    transaction.from = Base58.encode(tx.getBody().getAccount());
    transaction.to = Base58.encode(tx.getBody().getRecipient());
    transaction.amount = tx.getBody().getAmount();
    transaction.payload = tx.getBody().getPayload();
    transaction.sign = tx.getBody().getSign_asB64();
    transaction.type = tx.getBody().getType();
    return transaction;
}

