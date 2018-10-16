import bs58 from 'bs58';

/*
tansaction = {
    hash : byte of base64 
    nonce : uint
    from : byte of base58
    to : byte of base58
    amount : uint
    payload : byte of base64
    sign : byte of base64
    type : int
}
*/

export function encodeTxHash(bytes) {
    return bs58.encode(bytes);
}

export function decodeTxHash(bs58string) {
    return bs58.decode(bs58string);
}

