import Tx from './tx';
import bs58 from 'bs58';

export default class Block {
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    static fromGrpc(grpcObject) {
        const obj = grpcObject.toObject();
        obj.hash = Block.encodeHash(grpcObject.getHash_asU8());
        obj.header.prevblockhash = Block.encodeHash(grpcObject.getHeader().getPrevblockhash_asU8());
        if (obj.body) {
            obj.body.txsList = grpcObject.getBody().getTxsList().map(tx => Tx.fromGrpc(tx));
        }
        return new Block(obj);
    }
    toGrpc() {
        throw new Error('Not implemented');
    }
    static encodeHash(bytes) {
        return bs58.encode(bytes);
    }
    static decodeHash(bs58string) {
        return bs58.decode(bs58string);
    }
}
