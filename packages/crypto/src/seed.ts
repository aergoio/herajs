export { generateMnemonic } from 'bip39';
import { mnemonicToSeed } from 'bip39';
import hdkey from 'hdkey';
import { WALLET_HDPATH } from './constants';

/**
 * Returns n private keys derived from mnemonic
 */
export async function privateKeysFromMnemonic(mnemonic: string, count: number = 1, hdpath = WALLET_HDPATH): Promise<Buffer[]> {
    const seed = await mnemonicToSeed(mnemonic);
    const hdwallet = hdkey.fromMasterSeed(seed);
    
    const privateKeys = [];
    for (let i = 0; i < count; i++) {
        const key = hdwallet.derive(hdpath + i);
        privateKeys.push(key.privateKey);
    }
    
    return privateKeys;
}

/**
 * Returns the first private key derived from mnemonic
 */
export async function privateKeyFromMnemonic(mnemonic: string): Promise<Buffer> {
    return (await privateKeysFromMnemonic(mnemonic, 1))[0];
}