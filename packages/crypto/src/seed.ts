import { mnemonicToSeed } from 'bip39';
import hdkey from '@herajs/hdkey';
import { WALLET_HDPATH } from './constants';

// Re-export useful functions from bip39
export { generateMnemonic, mnemonicToSeed } from 'bip39';

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

