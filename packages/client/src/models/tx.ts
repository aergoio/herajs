import { TxBody, Tx as GrpcTx, TxType, TxTypeMap } from '../../types/blockchain_pb';
import { encodeTxHash, decodeTxHash } from '../transactions/utils';
import Address from './address';
import Amount from './amount';
import { Buffer } from 'buffer';

type TxTypeValue = TxTypeMap[keyof TxTypeMap];

function bufferOrB58(input: string | Buffer | Uint8Array): Uint8Array {
    if (typeof input === 'string') {
        return Uint8Array.from(decodeTxHash(input));
    } else {
        return Uint8Array.from(Buffer.from(input));
    }
}

/**
 * Class for converting transaction data to and from network representation.
 * You usually don't need to interact with this class manually, you can pass simple JSON objects.
 * This class is used when passing transaction data to client methods.
 */
export default class Tx {
    /**
     * Map of tx types.
     * Use as Tx.Type.NORMAL, Tx.Type.GOVERNANCE, Tx.Type.REDEPLOY, Tx.Type.FEEDELEGATION
     */
    static readonly Type = TxType;

    hash: string /*bytes*/;
    nonce: number /*uint64*/;
    from: Address /*bytes*/;
    to: Address /*bytes*/;
    amount: Amount /*bytes*/;
    payload: Uint8Array /*bytes*/;
    sign: string /*bytes*/;
    type: TxTypeValue /*uint32*/;
    limit: number /*uint64*/;
    price: Amount /*uint64*/;
    chainIdHash: string /*bytes*/;

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
            price: new Amount(grpcObject.getBody().getGasprice_asU8()),
            chainIdHash: encodeTxHash(grpcObject.getBody().getChainidhash_asU8())
        });
    }
    toGrpc() {
        const msgtxbody = new TxBody();
        msgtxbody.setType(this.type ? this.type : 0);
        msgtxbody.setNonce(this.nonce);
        if (typeof this.from === 'undefined' || !this.from) {
            throw new Error('Missing required transaction parameter \'from\'');
        }
        msgtxbody.setAccount((new Address(this.from)).asBytes());
        if (typeof this.to !== 'undefined' && this.to !== null) {
            msgtxbody.setRecipient((new Address(this.to)).asBytes());
        }
        msgtxbody.setAmount(Uint8Array.from(this.amount.asBytes()));
        if (typeof this.price !== 'undefined') {
            msgtxbody.setGasprice(Uint8Array.from(this.price.asBytes()));
        }
        msgtxbody.setGaslimit(this.limit || 0);
        if (this.payload != null) {
            msgtxbody.setPayload(Buffer.from(this.payload));
        }
        if (typeof this.sign === 'string') {
            msgtxbody.setSign(Buffer.from(this.sign, 'base64'));
        } else {
            msgtxbody.setSign(this.sign);
        }
        if (typeof this.chainIdHash === 'undefined' || !this.chainIdHash) {
            const msg = 'Missing required transaction parameter \'chainIdHash\'. ' +
                        'Use aergoClient.getChainIdHash() to retrieve from connected node, ' +
                        'or hard-code for increased security and performance.';
            throw new Error(msg);
        }
        msgtxbody.setChainidhash(bufferOrB58(this.chainIdHash));

        const msgtx = new GrpcTx();
        if (this.hash != null) {
            msgtx.setHash(bufferOrB58(this.hash));
        }
        msgtx.setBody(msgtxbody);

        return msgtx;
    }
}
