import hdkey from '@herajs/hdkey';
import { WALLET_HDPATH } from './constants';

// Re-export useful functions from bip39
import { generateMnemonic as _generateMnemonic, mnemonicToSeed as _mnemonicToSeed } from 'bip39';

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
 * @param mnemonic in bits, default 128
 * @param password optional
 */
export function mnemonicToSeed(mnemonic: string, password?: string): Promise<Buffer> {
    return _mnemonicToSeed(mnemonic, password);
}

interface Options {
    hdpath?: string;
    count?: number;
}

const defaultOptions = {
    hdpath: WALLET_HDPATH,
    count: 1,
};

/**
 * Returns n private keys derived from seed
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
 */
export async function privateKeyFromSeed(seed: Buffer, options: Options = {}): Promise<Buffer> {
    return privateKeysFromSeed(seed, options)[0];
}

/**
 * Returns n private keys derived from mnemonic
 */
export async function privateKeysFromMnemonic(mnemonic: string, options: Options = {}): Promise<Buffer[]> {
    const seed = await mnemonicToSeed(mnemonic);
    return privateKeysFromSeed(seed, options);
}

/**
 * Returns the first private key derived from mnemonic
 */
export async function privateKeyFromMnemonic(mnemonic: string, options: Options = {}): Promise<Buffer> {
    return (await privateKeysFromMnemonic(mnemonic, options))[0];
}

