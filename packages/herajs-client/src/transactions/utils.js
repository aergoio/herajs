import bs58 from 'bs58';
import { Buffer } from 'buffer';

export function encodeTxHash(bytes) {
    return bs58.encode(Buffer.from(bytes));
}

export function decodeTxHash(bs58string) {
    return bs58.decode(bs58string);
}

