import Transport from '@ledgerhq/hw-transport';
import { chunkBy, pathToBuffer } from './utils';
import { Address } from '@herajs/common';
import { Tx } from '@herajs/client';

const CLA = 0xAE;

const INS = {
    GET_VERSION: 0x01,
    GET_PUBLIC_KEY: 0x02,
    SIGN_TX: 0x04,
};

export const ErrorCodes = {
    ERR_STILL_IN_CALL: 0x6e04,
    ERR_INVALID_DATA: 0x6e07,
    ERR_INVALID_BIP_PATH: 0x6e08,
    ERR_REJECTED_BY_USER: 0x6e09,
    ERR_REJECTED_BY_POLICY: 0x6e10,
    ERR_DEVICE_LOCKED: 0x6e11,
    ERR_CLA_NOT_SUPPORTED: 0x6e00,
    ERR_TX_PARSE_INVALID: 0x6720,
    ERR_TX_INVALID: 0x6740,
    ERR_TX_PARSE_SIZE: 0x6700,
};

function isErrorRange(e: any, rangeFrom: number): boolean {
    return e && e.statusCode && (e.statusCode & rangeFrom) === rangeFrom;
}

async function wrapRetryStillInCall<T>(fn: (() => Promise<T>)): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (e && e.statusCode && e.statusCode === ErrorCodes.ERR_STILL_IN_CALL) {
            // Retry once
            return await fn();
        }
        if (isErrorRange(e, ErrorCodes.ERR_TX_PARSE_INVALID)) {
            e.message = `Ledger device: failed to parse transaction data at field ${e.statusCode - 0x6720} (0x${e.statusCode.toString(16)})`;
        } else if (isErrorRange(e, ErrorCodes.ERR_TX_INVALID)) {
            e.message = `Ledger device: transaction data invalid at field ${e.statusCode - 0x6700} (0x${e.statusCode.toString(16)})`;
        }
        throw e;
    }
}

interface GetVersionResponse {
    major: number;
    minor: number;
}

interface SignTxResponse {
    hash: string;
    signature: string;
}

enum Mode {
    Part = 0x00,
    Begin = 0x01,
    Finish = 0x02,
    Single = 0x03,
}

export default class LedgerAppAergo {
    transport: Transport;
    lastAddress?: Address;

    constructor(transport: Transport, scrambleKey: string = 'AERGO') {
        this.transport = transport;
        const methods = [
            'getVersion',
            'getWalletPublicKey',
            'signTransaction',
        ];
        this.transport.decorateAppAPIMethods(this, methods, scrambleKey);
    }

    /**
     * Get version of Aergo Ledger app
     */
    async getVersion(): Promise<GetVersionResponse> {
        const response = await wrapRetryStillInCall(() =>
            this.transport.send(CLA, INS.GET_VERSION, 0x00, 0x00)
        );
        const [major, minor] = response;
        return { major, minor };
    }

    /**
     * Get an Aergo address from Ledger given a BIP44 path
     * @param path BIP44 path, e.g. "m/44'/441'/0'/0/0"
     */
    async getWalletAddress(path: string): Promise<Address> {
        const data = pathToBuffer(path);
        const response = await wrapRetryStillInCall(() =>
            this.transport.send(CLA, INS.GET_PUBLIC_KEY, 0x00, 0x00, data)
        );
        const [pubkey] = chunkBy(response, [33]);
        this.lastAddress = new Address(pubkey);
        return this.lastAddress;
    }

    /**
     * Sign a transaction. Uses account from last getWalletAddress call.
     */
    async signTransaction(tx: any): Promise<SignTxResponse> {
        if (!(tx instanceof Tx)) {
            tx = new Tx(tx);
        }
        const txGrpc = tx.toGrpc().getBody();
        const data = Buffer.from(txGrpc.serializeBinary());
        if (data.length > 250) {
            throw new Error('currently only transactions with less than 250 bytes in size are supported');
            // TODO: Split tx into Mode.Begin -> Mode.Part -> Mode.Finish
        }
        const mode = Mode.Single;
        const response = await wrapRetryStillInCall(() =>
            this.transport.send(CLA, INS.SIGN_TX, mode, 0x00, data)
        );
        const [hash, signature] = chunkBy(response, [32, response.length - 32 - 2]);
        return {
            hash: Tx.encodeHash(hash),
            signature: signature.toString('base64'),
        };
    }
}