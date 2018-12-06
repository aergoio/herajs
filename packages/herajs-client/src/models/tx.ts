import { TxBody, Tx as GrpcTx } from '../../types/blockchain_pb';
import { encodeTxHash, decodeTxHash } from '../transactions/utils';
import { fromHexString, toHexString } from '../utils';
import Address from './address';
import JSBI from 'jsbi';

export default class Tx {
    hash: string /*bytes*/;
    nonce: number /*uint64*/;
    from: Address /*bytes*/;
    to: Address /*bytes*/;
    amount: JSBI /*bytes*/;
    payload: Uint8Array /*bytes*/;
    sign: string /*bytes*/;
    type: number /*uint32*/;
    limit: number /*uint64*/;
    price: JSBI /*uint64*/;

    constructor(data: Partial<Tx>) {
        Object.assign(this, data);
        this.amount = JSBI.BigInt(this.amount || 0);
        this.price = JSBI.BigInt(this.price || 0);
    }

    static fromGrpc(grpcObject: GrpcTx) {
        return new Tx({
            hash: encodeTxHash(grpcObject.getHash()),
            nonce: grpcObject.getBody().getNonce(),
            from: new Address(grpcObject.getBody().getAccount_asU8()),
            to: new Address(grpcObject.getBody().getRecipient_asU8()),
            amount: JSBI.BigInt('0x' + toHexString(grpcObject.getBody().getAmount_asU8())),
            payload: grpcObject.getBody().getPayload_asU8(),
            sign: grpcObject.getBody().getSign_asB64(),
            type: grpcObject.getBody().getType(),
            limit: grpcObject.getBody().getLimit(),
            price: JSBI.BigInt(toHexString(grpcObject.getBody().getPrice_asU8()))
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
        msgtxbody.setAmount(fromHexString(this.amount.toString(16)));
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
            msgtxbody.setPrice(fromHexString(this.price.toString(16)));
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
