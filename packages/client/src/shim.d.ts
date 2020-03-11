declare module 'bs58check' {
    export function decode(input: string): Buffer;
    export function encode(input: Buffer): string;
}

declare module 'hash.js/lib/hash/sha/256' {
    import { sha256 } from 'hash.js';
    export = sha256;
}