import { TypedEventEmitter } from '@elderapo/typed-event-emitter';
import { Wallet } from '../wallet';
import { Transaction, SignedTransaction } from '../models/transaction';
import { Key } from '../models/key';
import { Account } from '../models/account';
import { HashMap } from '../utils';
export interface Events {
    'add': Key;
    'update': Key;
    'change': Key[];
    'unlock': null;
    'lock': null;
}
interface ImportSpec {
    account: Account;
    b58encrypted?: string;
    password?: string;
    privateKey?: Buffer;
}
/**
 * KeyManager manages and tracks keys for accounts
 */
export default class KeyManager extends TypedEventEmitter<Events> {
    wallet: Wallet;
    keys: HashMap<string, Key>;
    masterPassphrase?: string;
    constructor(wallet: Wallet);
    addKey(account: Account, privateKey: Uint8Array | number[]): Key;
    getKey(account: Account): Promise<Key>;
    signTransaction(account: Account, transaction: Transaction): Promise<SignedTransaction>;
    signMessage(account: Account, message: Buffer, enc?: string): Promise<string>;
    importKey(importSpec: ImportSpec): Promise<Key>;
    readonly unlocked: boolean;
    unlock(passphrase: string): Promise<void>;
    setupAndUnlock(appId: string, passphrase: string): Promise<void>;
    lock(): void;
}
export {};
