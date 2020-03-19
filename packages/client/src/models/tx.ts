import { TxBody as GrpcTxBody, Tx as GrpcTx, TxType, TxTypeMap } from '../../types/blockchain_pb';
import { encodeTxHash, decodeTxHash } from '../transactions/utils';
import Address from './address';
import { Amount, TxBody } from '@herajs/common';
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

    hash?: string /*bytes*/;
    nonce!: number /*uint64*/;
    from!: Address | string /*bytes*/;
    to!: Address | string | null /*bytes*/;
    amount!: Amount /*bytes*/;
    payload?: Uint8Array | string /*bytes*/;
    sign?: string /*bytes*/;
    type?: TxTypeValue /*uint32*/;
    limit?: number /*uint64*/;
    price!: Amount /*uint64*/;
    chainIdHash!: string /*bytes*/;

    constructor(data: TxBody) {
        Object.assign(this, data);
        this.amount = new Amount(this.amount as any || 0);
        this.price = new Amount(this.price as any || 0);
        if (!this.type) {
            this.type = this.inferType();
        }
    }

    static encodeHash(buf: Uint8Array): string {
        return encodeTxHash(buf);
    }

    static fromGrpc(grpcObject: GrpcTx): Tx {
        const body = grpcObject.getBody();
        const hash = Tx.encodeHash(grpcObject.getHash_asU8()); 
        if (!body) throw new Error('tx missing body');
        return new Tx({
            hash,
            nonce: body.getNonce(),
            from: new Address(body.getAccount_asU8()),
            to: new Address(body.getRecipient_asU8()),
            amount: new Amount(body.getAmount_asU8()),
            payload: body.getPayload_asU8(),
            sign: body.getSign_asB64(),
            type: body.getType(),
            limit: body.getGaslimit(),
            price: new Amount(body.getGasprice_asU8()),
            chainIdHash: Tx.encodeHash(body.getChainidhash_asU8())
        });
    }

    /**
     * Infer a tx type based on body. Can be overriden by exlicitly passing type.
     */
    private inferType(): TxTypeValue {
        if (!this.to) {
            return Tx.Type.DEPLOY;
        }
        if (`${this.to}` === 'aergo.system' || `${this.to}` === 'aergo.enterprise') {
            return Tx.Type.GOVERNANCE;
        }
        return Tx.Type.NORMAL;
    }

    toGrpc(): GrpcTx {
        const msgtxbody = new GrpcTxBody();

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
            msgtxbody.setPayload(Buffer.from(this.payload as any));
        }

        if (typeof this.sign === 'string') {
            msgtxbody.setSign(Buffer.from(this.sign, 'base64'));
        } else if (this.sign) {
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

export class SignedTx extends Tx {
    sign: string;
    hash: string;
}
