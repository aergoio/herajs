import { TxBody, Tx as GrpcTx } from '../../types/blockchain_pb';
import { encodeTxHash, decodeTxHash } from '../transactions/utils.js';
import Address from './address';

export default class Tx {
    hash: string /*bytes*/;
    nonce: number /*uint64*/;
    from: Address /*bytes*/;
    to: Address /*bytes*/;
    amount: number /*uint64*/;
    payload: Buffer;
    sign: Buffer;
    type: number;
    limit: number /*uint64*/;
    price: number /*uint64*/;

    constructor(data: Partial<Tx>) {
        Object.assign(this, data);
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
        const msgtxbody = new TxBody();
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

        const msgtx = new GrpcTx();

        if (this.hash != null) {
            let hash = this.hash;
            let hashBuffer;
            if (typeof hash === 'string') {
                hashBuffer = Buffer.from(decodeTxHash(hash));
            } else {
                hashBuffer = Buffer.from(hash);
            }
            msgtx.setHash(hashBuffer);
        }
        msgtx.setBody(msgtxbody);

        return msgtx;
    }
}
