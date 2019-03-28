import { TxBody, Tx as GrpcTx } from '../../types/blockchain_pb';
import { encodeTxHash, decodeTxHash } from '../transactions/utils';
import Address from './address';
import Amount from './amount';
import { Buffer } from 'buffer';

export default class Tx {
    hash: string /*bytes*/;
    nonce: number /*uint64*/;
    from: Address /*bytes*/;
    to: Address /*bytes*/;
    amount: Amount /*bytes*/;
    payload: Uint8Array /*bytes*/;
    sign: string /*bytes*/;
    type: number /*uint32*/;
    limit: number /*uint64*/;
    price: Amount /*uint64*/;

    constructor(data: Partial<Tx>) {
        Object.assign(this, data);
        this.amount = new Amount(<any>this.amount || 0);
        this.price = new Amount(<any>this.price || 0);
    }

    static fromGrpc(grpcObject: GrpcTx) {
        return new Tx({
            hash: encodeTxHash(grpcObject.getHash_asU8()),
            nonce: grpcObject.getBody().getNonce(),
            from: new Address(grpcObject.getBody().getAccount_asU8()),
            to: new Address(grpcObject.getBody().getRecipient_asU8()),
            amount: new Amount(grpcObject.getBody().getAmount_asU8()),
            payload: grpcObject.getBody().getPayload_asU8(),
            sign: grpcObject.getBody().getSign_asB64(),
            type: grpcObject.getBody().getType(),
            limit: grpcObject.getBody().getGaslimit(),
            price: new Amount(grpcObject.getBody().getGasprice_asU8())
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
        msgtxbody.setAmount(this.amount.asBytes());
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
            msgtxbody.setGaslimit(this.limit);
        }

        if (typeof this.price !== 'undefined') {
            msgtxbody.setGasprice(this.price.asBytes());
        }

        const msgtx = new GrpcTx();

        if (this.hash != null) {
            let hash = this.hash;
            let hashBuffer;
            if (typeof hash === 'string') {
                hashBuffer = new Uint8Array(Buffer.from(decodeTxHash(hash)));
            } else {
                hashBuffer = new Uint8Array(Buffer.from(hash));
            }
            msgtx.setHash(hashBuffer);
        }
        msgtx.setBody(msgtxbody);

        return msgtx;
    }
}
