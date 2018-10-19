import bs58 from 'bs58';

export function encodeTxHash(bytes) {
    return bs58.encode(bytes);
}

export function decodeTxHash(bs58string) {
    return bs58.decode(bs58string);
}

