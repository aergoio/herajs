declare module 'bs58check' {
    export function decode(input: string): Buffer;
    export function encode(input: Buffer): string;
}