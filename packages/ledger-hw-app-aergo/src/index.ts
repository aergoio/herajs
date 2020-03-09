import Transport from '@ledgerhq/hw-transport';
import { chunkBy, pathToBuffer } from './utils';
import { Tx, Address } from '@herajs/client';

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
};

function isTxParseError(e: any): boolean {
    return e && e.statusCode && (e.statusCode & 0x6720) === 0x6720;
}

async function wrapRetryStillInCall<T>(fn: (() => Promise<T>)): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (e && e.statusCode && e.statusCode === ErrorCodes.ERR_STILL_IN_CALL) {
            // Retry
            return await fn();
        }
        if (isTxParseError(e)) {
            e.message = `Ledger device: transaction data invalid at field ${e.statusCode - 0x6720} (0x${e.statusCode.toString(16)})`;
        }
        // TODO: add after 0x6740: on_new_transaction_part
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

export default class LedgerAppAergo {
    transport: Transport;

    constructor(transport: Transport, scrambleKey: string = 'AERGO') {
        this.transport = transport;
        const methods = [
            'getVersion',
            'getWalletPublicKey',
            /*'signTransaction',
            'deriveAddress',
            'showAddress'*/
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
        return new Address(pubkey);
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
            /*
            TODO:
            mode 0x01 for first, 0x02 for last, 0x00 for in-between
            */
        }
        const mode = 0x03; // data fits into one transfer
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