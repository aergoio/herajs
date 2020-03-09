import bs58 from 'bs58';
import { Buffer } from 'buffer';

export function encodeTxHash(bytes: Buffer | Uint8Array): string {
    return bs58.encode(Buffer.from(bytes));
}

export function decodeTxHash(bs58string: string): Buffer {
    return bs58.decode(bs58string);
}

