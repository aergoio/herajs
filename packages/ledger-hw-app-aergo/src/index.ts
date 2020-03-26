import Transport from '@ledgerhq/hw-transport';
import { chunkBy, pathToBuffer } from './utils';
import { Address, } from '@herajs/common';
import { Tx } from '@herajs/client';

import { Buffer } from 'buffer';

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
    ERR_TX_UNSUPPORTED_TYPE: 0x6755,
};

function isErrorRange(e: any, rangeFrom: number): boolean {
    return e && e.statusCode && (e.statusCode & rangeFrom) === rangeFrom;
}

/**
 * Error message for errors thrown during tx validation.
 * For troubleshooting these errors, find the corresponding validation code in the Ledger app's code
 * at https://github.com/aergoio/ledger-app-aergo/blob/develop/src/transaction.h
 */
function errorRangeMessage(text: string, code: number, rangeFrom: number): string {
    return `Ledger device: ${text} at pos ${code - rangeFrom} (0x${rangeFrom.toString(16)} + ${code - rangeFrom})`;
}

async function wrapRetryStillInCall<T>(fn: (() => Promise<T>)): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (e && e.statusCode && e.statusCode === ErrorCodes.ERR_STILL_IN_CALL) {
            // Retry once
            return await fn();
        }
        if (e && e.statusCode && e.statusCode === ErrorCodes.ERR_TX_UNSUPPORTED_TYPE) {
            e.message = 'Ledger device: unsupported tx type';
        } else if (isErrorRange(e, ErrorCodes.ERR_TX_PARSE_INVALID)) {
            e.message = errorRangeMessage('failed to parse transaction data', e.statusCode, ErrorCodes.ERR_TX_PARSE_INVALID);
        } else if (isErrorRange(e, ErrorCodes.ERR_TX_INVALID)) {
            e.message = errorRangeMessage('transaction data invalid', e.statusCode, ErrorCodes.ERR_TX_INVALID);
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

const supportedTypes = [Tx.Type.TRANSFER, Tx.Type.GOVERNANCE, Tx.Type.CALL, Tx.Type.DEPLOY] as const;

export default class LedgerAppAergo {
    transport: Transport;
    lastAddress?: Address;

    constructor(transport: Transport, scrambleKey = 'AERGO') {
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

    private async sendChunkedTxData(data: Buffer, chunkSize = 200, singleChunkSize = 250): Promise<[Buffer, Buffer]> {
        const TX_REQUEST_NEXT_PART = '9000'; //0x9000
        //const total = Math.ceil(data.length / chunkSize);
        //let idx = 0;
        for (let offset = 0; offset < data.length; offset += chunkSize) {
            const chunkEnd = Math.min(data.length, offset + chunkSize);
            const dataChunk = data.slice(offset, chunkEnd);
            let mode = Mode.Single;
            if (data.length >= singleChunkSize) {
                mode = Mode.Begin;
                if (offset > 0) {
                    mode = Mode.Part;
                } else if (chunkEnd === data.length) {
                    mode = Mode.Finish;
                }
            }
            //console.log(`chunk ${++idx}/${total} (${offset}-${chunkEnd}) request`, Mode[mode], dataChunk);
            const response = await wrapRetryStillInCall(() =>
                this.transport.send(CLA, INS.SIGN_TX, mode, 0x00, dataChunk)
            );
            //console.log('chunk  ${++idx}/${total} response', response.toString('hex'));
            if (response.length && response.toString('hex') !== TX_REQUEST_NEXT_PART) {
                const [hash, signature] = chunkBy(response, [32, response.length - 32 - 2]);
                return [hash, signature];
            }
        }
        throw new Error('communication error: sent all data but did not receive response');
    }

    /**
     * Sign a transaction. Uses account from last getWalletAddress call.
     */
    async signTransaction(tx: any): Promise<SignTxResponse> {
        if (!(tx instanceof Tx)) {
            tx = new Tx(tx);
        }
        if (supportedTypes.indexOf(tx.type) === -1) {
            throw new Error('Aergo Ledger app currently only supports tx types Transfer, Call, Governance, and Deploy');
        }
        const txGrpc = tx.toGrpc().getBody();
        const serialized = Buffer.from(txGrpc.serializeBinary());
        const typeSerialized = Buffer.from(Uint8Array.from([tx.type]));
        const data = Buffer.concat([typeSerialized, serialized]);

        const chunkSize = 200;
        const [hash, signature] = await this.sendChunkedTxData(data, chunkSize);
        
        return {
            hash: Tx.encodeHash(hash),
            signature: signature.toString('base64'),
        };
    }
}