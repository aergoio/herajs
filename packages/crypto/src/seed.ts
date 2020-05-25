import hdkey from '@herajs/hdkey';
import { constants } from '@herajs/common';

// Re-export useful functions from bip39
import {
    generateMnemonic as _generateMnemonic,
    mnemonicToSeed as _mnemonicToSeed,
    validateMnemonic,
} from 'bip39';

export { validateMnemonic };

/**
 * Generate random mnemonic
 * @param strength in bits, default 128
 * @param rng optional, function to generate random bots
 * @param wordlist optional, custom wordlist
 */
export function generateMnemonic(strength?: number, rng?: (size: number) => Buffer, wordlist?: string[]): string {
    return _generateMnemonic(strength, rng, wordlist);
}

/**
 * Convert mnemonic string to seed
 * @param mnemonic
 * @param password optional
 */
export function mnemonicToSeed(mnemonic: string, password?: string): Promise<Buffer> {
    return _mnemonicToSeed(mnemonic, password);
}

/**
 * Key derivation options
 */
export interface Options {
    hdpath?: string;
    count?: number;
}

const defaultOptions = {
    hdpath: constants.WALLET_HDPATH,
    count: 1,
};

/**
 * Returns n private keys derived from seed
 * @param {Buffer} seed
 * @param {Options} options (optional) { count: number, hdpath: string }
 */
export function privateKeysFromSeed(seed: Buffer, options: Options = {}): Buffer[] {
    const opts = { ...defaultOptions, ...options };
    const hdwallet = hdkey.fromMasterSeed(seed);
    const privateKeys = [];
    for (let i = 0; i < opts.count; i++) {
        const key = hdwallet.derive(opts.hdpath + i);
        privateKeys.push(key.privateKey);
    }
    return privateKeys;
}

/**
 * Returns the first private key derived from seed
 * @param {Buffer} seed
 * @param {Options} options (optional) { hdpath: string }
 */
export async function privateKeyFromSeed(seed: Buffer, options: Options = {}): Promise<Buffer> {
    return privateKeysFromSeed(seed, options)[0];
}

/**
 * Returns n private keys derived from mnemonic
 * @param {string} mnemonic
 * @param {Options} options (optional) { count: number, hdpath: string }
 */
export async function privateKeysFromMnemonic(mnemonic: string, options: Options = {}): Promise<Buffer[]> {
    const seed = await mnemonicToSeed(mnemonic);
    return privateKeysFromSeed(seed, options);
}

/**
 * Returns the first private key derived from mnemonic
 * @param {string} mnemonic
 * @param {Options} options (optional) { hdpath: string }
 */
export async function privateKeyFromMnemonic(mnemonic: string, options: Options = {}): Promise<Buffer> {
    return (await privateKeysFromMnemonic(mnemonic, options))[0];
}

