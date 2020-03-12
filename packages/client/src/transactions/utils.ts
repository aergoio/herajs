import { base58 } from '@herajs/common';
import { Buffer } from 'buffer';

export function encodeTxHash(bytes: Buffer | Uint8Array): string {
    return base58.encode(Buffer.from(bytes));
}

export function decodeTxHash(bs58string: string): Buffer {
    return base58.decode(bs58string);
}

