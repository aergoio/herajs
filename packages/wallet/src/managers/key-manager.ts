import { TypedEventEmitter } from '@elderapo/typed-event-emitter';
import { Wallet } from '../wallet';
import { Transaction, SignedTransaction } from '../models/transaction';
import { Key } from '../models/key';
import { Account } from '../models/account';
import { EncryptedIdSetting } from '../models/setting';
import {
    decryptPrivateKey,
    decodePrivateKey,
    encryptPrivateKey
} from '@herajs/crypto';
import { HashMap } from '../utils';

export interface Events {
    'add': Key;
    'update': Key;
    'change': Key[];
    'unlock': null;
    'lock': null;
}

/**
 * Specification for importing private keys
 */
interface ImportSpec {
    account: Account;
    b58encrypted?: string;
    password?: string;
    privateKey?: Buffer;
}

type Encoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex';

const TO_BE_SIGNED_EXTERNALLY = '';

/**
 * KeyManager manages keys for accounts.
 */
export default class KeyManager extends TypedEventEmitter<Events> {
    public wallet: Wallet;
    private keys: HashMap<string, Key> = new HashMap();
    private masterPassphrase?: string;
    public useExternalLedger = false;

    constructor(wallet: Wallet) {
        super();
        this.wallet = wallet;
    }

    /**
     * Adds a private key for an account to the keystore
     * @param account 
     * @param privateKey 
     */
    addKey(account: Account, privateKey: Uint8Array | number[]): Key {
        const address = account.data.spec.address;
        
        const key = new Key(address, {
            privateKey: Array.from(privateKey),
            address,
            privateKeyEncrypted: null
        });
        this.keys.set(address, key);
        if (this.wallet.keystore) {
            if (!this.masterPassphrase) throw new Error('unlock wallet before adding key');
            const privateKeyEncrypted = encryptPrivateKey(Uint8Array.from(privateKey), this.masterPassphrase);
            key.data.privateKeyEncrypted = Array.from(privateKeyEncrypted);
            key.data.privateKey = null;
            this.wallet.keystore.getIndex('keys').put(key);
        }
        return key;
    }

    async getKey(account: Account): Promise<Key> {
        const address = account.data.spec.address;
        if (!this.keys.has(address) && this.wallet.keystore) {
            try {
                const keyRecord = await this.wallet.keystore.getIndex('keys').get(address);
                const key = Key.fromRecord(keyRecord);
                this.keys.set(address, key);
                return key;
            } catch (e) {
                throw new Error(`missing key for account ${address}`);
            }
        }
        return this.keys.get(address) as Key;
    }

    async getUnlockedKey(account: Account): Promise<Key> {
        const key = await this.getKey(account);
        key.unlock(this.masterPassphrase);
        return key;
    }

    /**
     * Removes key for address from keystore
     * @param address 
     */
    async removeKey(address: string): Promise<void> {
        if (this.keys.has(address)) {
            this.keys.delete(address);
        }
        if (this.wallet.keystore) {
            await this.wallet.keystore.getIndex('keys').delete(address);
        }
    }

    /**
     * Signs a transaction using key or Ledger saved for account
     * @param account 
     * @param transaction 
     */
    async signTransaction(account: Account, transaction: Transaction): Promise<SignedTransaction> {
        if (account.type === 'ledger') {
            return this.signTransactionLedger(account, transaction);
        }
        const key = await this.getUnlockedKey(account);
        return key.signTransaction(transaction);
    }

    async signTransactionLedger(account: Account, tx: Transaction): Promise<SignedTransaction> {
        if (typeof tx.txBody === 'undefined') {
            throw new Error('cannot sign transaction without txBody. Did you use prepareTransaction?');
        }
        if (!this.wallet.ledger) {
            if (!this.useExternalLedger) {
                throw new Error('call wallet.connectLedger before signing transaction');
            }
            // This is a bit of a hack:
            // with this, we can use prepareTransaction but still provide signatures externally
            const signedTx = new SignedTransaction(tx.key, tx.data, { ...tx.txBody }, TO_BE_SIGNED_EXTERNALLY);
            signedTx.txBody.sign = TO_BE_SIGNED_EXTERNALLY;
            return signedTx;
        }
        const presignHash = await tx.getUnsignedHash();
        // need to call getAddress again to "prime" HW to this account
        await this.wallet.accountManager.getAddressFromLedger(account.data.derivationPath);
        const result = await this.wallet.ledger.signTransaction(tx.txBody);
        if (presignHash !== result.hash) {
            throw new Error(`presign hash returned by Ledger app does not match locally computed one (${result.hash} != ${presignHash})`);
        }
        const signedTx = new SignedTransaction(tx.key, tx.data, { ...tx.txBody }, result.signature);
        signedTx.txBody.sign = result.signature;
        // the hash returned by Ledger app is the pre-signature hash, so let's calculate our own now
        signedTx.txBody.hash = await signedTx.getHash();
        return signedTx;
    }

    /**
     * Signs a message using key saved for account
     * @param account 
     * @param transaction 
     */
    async signMessage(account: Account, message: Buffer, enc: Encoding = 'hex'): Promise<string> {
        if (account.type === 'ledger') {
            throw new Error('signing arbitrary messages is currently not supported in Aergo Ledger app');
        }
        const key = await this.getUnlockedKey(account);
        return await key.signMessage(message, enc);
    }

    /**
     * Imports a raw or encrypted private key and add it to the keystore.
     * @param importSpec 
     */
    async importKey(importSpec: ImportSpec): Promise<Key> {
        let rawKey = new Uint8Array([]);
        if (typeof importSpec.b58encrypted === 'string' && typeof importSpec.password === 'string') {
            const encryptedKey = decodePrivateKey(importSpec.b58encrypted);
            rawKey = await decryptPrivateKey(encryptedKey, importSpec.password);
        }
        if (typeof importSpec.privateKey !== 'undefined') {
            rawKey = importSpec.privateKey;
        }
        if (!rawKey.length) throw new Error('no key provided. Supply b58encrypted and password or privateKey');
        return this.addKey(importSpec.account, rawKey);
    }

    /*
    TODO
    - export
    */

    /**
     * True if keystore is currently unlocked, i.e. a master passphrase is saved in memory.
     */
    get unlocked(): boolean {
        return typeof this.masterPassphrase !== 'undefined'; 
    }

    /**
     * Unlocks keystore by saving passphrase in memory.
     * @param passphrase 
     */
    async unlock(passphrase: string): Promise<void> {
        if (!this.wallet.datastore) throw new Error('configure storage before accessing keystore');
        const encryptedId = await this.wallet.datastore.getIndex('settings').get('encryptedId') as EncryptedIdSetting;
        try {
            await decryptPrivateKey(Uint8Array.from(encryptedId.data.value), passphrase);
        } catch (e) {
            throw new Error('invalid passphrase');
        }
        this.masterPassphrase = passphrase;
        this.emit('unlock', null);
    }

    /**
     * Sets up keystore passphrase for the first time.
     * @param appId string to be saved encrypted with passphrase for later validity check
     * @param passphrase 
     */
    async setupAndUnlock(appId: string, passphrase: string): Promise<void> {
        if (!this.wallet.datastore) throw new Error('configure storage before accessing keystore');
        // save extension id encrypted using password for a quick check if passphrase is correct later
        const encryptedId = new EncryptedIdSetting('encryptedId', {
            value: Array.from(await encryptPrivateKey(Buffer.from(appId), passphrase))
        });
        await this.wallet.datastore.getIndex('settings').put(encryptedId);
        await this.unlock(passphrase);
    }

    /**
     * Checks if wallet is setup with a master passphrase
     */
    async isSetup(): Promise<boolean> {
        if (!this.wallet.datastore) throw new Error('configure storage before accessing keystore');
        try {
            return Boolean(await this.wallet.datastore.getIndex('settings').get('encryptedId'));
        } catch(e) {
            return false;
        }
    }

    /**
     * Removes all keys stored in keystore.
     */
    async clearKeys(): Promise<void> {
        this.keys.clear();
        if (this.wallet.keystore) {
            await this.wallet.keystore.getIndex('keys').clear();
        }
    }

    /**
     * Locks keystore by removing master passphrase from memory.
     */
    lock (): void {
        this.masterPassphrase = undefined;
        this.emit('lock', null);
    }
}