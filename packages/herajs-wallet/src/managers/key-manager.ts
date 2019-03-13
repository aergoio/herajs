import { TypedEventEmitter } from '@elderapo/typed-event-emitter';
import { Wallet } from '../wallet';
import { Transaction, SignedTransaction } from '../models/transaction';
import { Key } from '../models/key';
import { Account } from '../models/account';
import {
    decryptPrivateKey,
    decodePrivateKey,
} from '@herajs/crypto';
import { HashMap } from '../utils';

export interface Events {
    'add': Key;
    'update': Key;
    'change': Key[];
}

interface ImportSpec {
    account: Account;
    b58encrypted?: string;
    password?: string;
}

/**
 * KeyManager manages and tracks keys for accounts
 */
export default class KeyManager extends TypedEventEmitter<Events> {
    wallet: Wallet;
    keys: HashMap<string, Key> = new HashMap();

    constructor(wallet: Wallet) {
        super();
        this.wallet = wallet;
    }

    addKey(account: Account, privateKey: Uint8Array | number[]): Key {
        const address = account.data.spec.address;
        const key = new Key(address, {
            privateKey: Array.from(privateKey),
            address
        });
        this.keys.set(address, key);
        return key;
    }

    signTransaction(account: Account, transaction: Transaction): Promise<SignedTransaction> {
        // Get key for account
        const address = account.address.toString();
        if (!this.keys.has(address)) {
            throw new Error(`missing key for account ${address}`);
        }
        const key = this.keys.get(address) as Key;
        // Sign transaction
        return key.signTransaction(transaction);
    }

    async importKey(importSpec: ImportSpec): Promise<Key> {
        let rawKey = new Uint8Array([]);
        if (typeof importSpec.b58encrypted === 'string' && typeof importSpec.password === 'string') {
            const encryptedKey = decodePrivateKey(importSpec.b58encrypted);
            rawKey = await decryptPrivateKey(encryptedKey, importSpec.password);
        }
        if (!rawKey.length) throw new Error('no key provided. Supply b58encrypted and password');
        return this.addKey(importSpec.account, rawKey);
    }

    /*
    import

    export
    */
}