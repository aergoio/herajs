import rpcTypes from '../client/types.js';
import { encodeAddress, decodeAddress } from '../accounts/utils.js';
import { encodeTxHash, decodeTxHash } from '../transactions/utils.js';

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
            from: encodeAddress(grpcObject.getBody().getAccount_asU8()),
            to: encodeAddress(grpcObject.getBody().getRecipient_asU8()),
            amount: grpcObject.getBody().getAmount(),
            payload: grpcObject.getBody().getPayload(),
            sign: grpcObject.getBody().getSign_asB64(),
            type: grpcObject.getBody().getType(),
        });
    }
    toGrpc() {
        const msgtxbody = new rpcTypes.TxBody();
        msgtxbody.setNonce(this.nonce);
        msgtxbody.setAccount(decodeAddress(this.from));
        msgtxbody.setRecipient(decodeAddress(this.to));
        msgtxbody.setAmount(this.amount);
        if (this.payload != null) {
            msgtxbody.setPayload(this.payload);
        }
        if (typeof this.sign === 'string') {
            msgtxbody.setSign(Buffer.from(this.sign, 'base64'));
        } else {
            msgtxbody.setSign(this.sign);
        }
        msgtxbody.setType(this.type);

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
