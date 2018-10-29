import rpcTypes from '../client/types.js';
import { encodeTxHash, decodeTxHash } from '../transactions/utils.js';
import Address from './address';

/*
rpcTypes.Tx = {
    hash : bytes 
    nonce : uint64
    from : bytes
    to : bytes
    amount : uint64
    payload : bytes
    sign : bytes
    type : int,
    limit: uint64;
    price: uint64;
}
*/

export default class Tx {
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    static fromGrpc(grpcObject) {
        return new Tx({
            hash: encodeTxHash(grpcObject.getHash()),
            nonce: grpcObject.getBody().getNonce(),
            from: new Address(grpcObject.getBody().getAccount_asU8()),
            to: new Address(grpcObject.getBody().getRecipient_asU8()),
            amount: grpcObject.getBody().getAmount(),
            payload: grpcObject.getBody().getPayload(),
            sign: grpcObject.getBody().getSign_asB64(),
            type: grpcObject.getBody().getType(),
            limit: grpcObject.getBody().getLimit(),
            price: grpcObject.getBody().getPrice()
        });
    }
    toGrpc() {
        const msgtxbody = new rpcTypes.TxBody();
        msgtxbody.setNonce(this.nonce);
        if (typeof this.from === 'undefined' || !this.from) {
            throw new Error('Missing required transaction parameter \'from\'');
        }
        msgtxbody.setAccount((new Address(this.from)).asBytes());
        if (typeof this.to !== 'undefined' && this.to !== null) {
            msgtxbody.setRecipient((new Address(this.to)).asBytes());
        }
        msgtxbody.setAmount(this.amount);
        if (this.payload != null) {
            msgtxbody.setPayload(Buffer.from(this.payload));
        }
        if (typeof this.sign === 'string') {
            msgtxbody.setSign(Buffer.from(this.sign, 'base64'));
        } else {
            msgtxbody.setSign(this.sign);
        }
        msgtxbody.setType(this.type);

        if (typeof this.limit !== 'undefined') {
            msgtxbody.setLimit(this.limit);
        }

        if (typeof this.price !== 'undefined') {
            msgtxbody.setPrice(this.price);
        }

        const msgtx = new rpcTypes.Tx();

        if (this.hash != null) {
            let hash = this.hash;
            if (typeof hash === 'string') {
                hash = decodeTxHash(hash);
            }
            msgtx.setHash(Buffer.from(hash));
        }
        msgtx.setBody(msgtxbody);

        return msgtx;
    }
}
