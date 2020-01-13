declare module 'bs58check' {
    export function decode(input: string): Buffer;
    export function encode(input: Buffer): string;
}

declare module '@web3-js/scrypt-shim' {
    export default function scrypt(key: string | Buffer, salt: string | Buffer, N: number, r: number, p: number, dkLen: number): Buffer;
}