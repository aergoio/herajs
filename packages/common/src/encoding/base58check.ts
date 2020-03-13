/**
 * This is a Typescript port of the bs58check package
 */
import base58 from './base58';
import { BaseEncoder } from './base-x';
import { Buffer } from 'buffer';
import createHash from 'create-hash';

function bs58checkBase(checksumFn: ((data: Buffer) => Buffer)): BaseEncoder {
    // Encode a buffer as a base58-check encoded string
    function encode(payload: Buffer): string {
        const checksum = checksumFn(payload);
        return base58.encode(Buffer.concat([
            payload,
            checksum,
        ], payload.length + 4));
    }

    function decodeRaw(buffer: Buffer): Buffer | undefined {
        const payload = buffer.slice(0, -4);
        const checksum = buffer.slice(-4);
        const newChecksum = checksumFn(payload);

        if (checksum[0] ^ newChecksum[0] |
                checksum[1] ^ newChecksum[1] |
                checksum[2] ^ newChecksum[2] |
                checksum[3] ^ newChecksum[3]) return;

        return payload;
    }

    // Decode a base58-check encoded string to a buffer, no result if checksum is wrong
    function decodeUnsafe(string: string): Buffer | undefined {
        const buffer = base58.decodeUnsafe(string);
        if (!buffer) return;
        return decodeRaw(buffer);
    }

    function decode(string: string): Buffer {
        const buffer = base58.decode(string);
        const payload = decodeRaw(buffer);
        if (!payload) throw new Error('Invalid checksum');
        return payload;
    }

    return {
        encode: encode,
        decode: decode,
        decodeUnsafe: decodeUnsafe,
    };
}

// SHA256(SHA256(buffer))
function sha256x2(buffer: Buffer): Buffer {
    const tmp = createHash('sha256').update(buffer).digest();
    return createHash('sha256').update(tmp).digest();
}

export default bs58checkBase(sha256x2);
