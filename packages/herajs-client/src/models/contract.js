import { ADDRESS_PREFIXES } from '../constants.js';
import bs58check from 'bs58check';
import { fromNumber } from '../utils';

export default class Contract {
    constructor(data) {
        this.functions = {};
        
        for (const key in data) {
            this[key] = data[key];
        }

        // This class acts as a proxy that passes ABI method calls
        return new Proxy(this, {
            get(obj, field) {
                if (field in obj) return obj[field];
                if (field in obj.functions) return obj.functions[field];
                return undefined;
            }
        });
    }
    static fromGrpc(grpcObject) {
        return new Contract({});
    }
    static fromCode(bs58checkCode) {
        const decoded = Contract.decodeCode(bs58checkCode);
        return new Contract({
            code: decoded
        });
    }
    static atAddress(address) {
        const contract = new Contract();
        contract.setAddress(address);
        return contract;
    }
    static fromAbi(abi) {
        const contract = new Contract();
        contract.loadAbi(abi);
        return contract;
    }
    setAddress(address) {
        this.address = address;
        return this;
    }
    loadAbi(abi) {
        for (const definition of abi.functions) {
            this.functions[definition.name] = (txdata, ...args) => {
                const payload = JSON.stringify({
                    Name: definition.name,
                    Args: args
                });
                const tx = {
                    from: txdata.from,
                    to: this.address,
                    amount: 0,
                    payload
                };
                return tx;
            };
        }
        return this;
    }
    toGrpc() {

    }
    asPayload() {
        // First 4 bytes are the length
        return Buffer.concat([Buffer.from(fromNumber(4 + this.code.length, 4)), this.code]);
    }
    static encodeCode(byteArray) {
        const buf = Buffer.from([ADDRESS_PREFIXES.CONTRACT, ...byteArray]);
        return bs58check.encode(buf);
    }
    static decodeCode(bs58checkCode) {
        return bs58check.decode(bs58checkCode).slice(1);
        //return bs58.decode(bs58checkCode);
    }
}
