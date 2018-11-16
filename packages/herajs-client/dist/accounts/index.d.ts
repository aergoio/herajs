import Tx from '../models/tx';
import Address from '../models/address';
/**
 * Accounts controller. It is exposed at `aergoClient.accounts`.
 */
declare class Accounts {
    client: any;
    constructor(aergo: any);
    /**
     * Create a new account in the node.
     * @param {string} passphrase
     * @returns {Promise<string>} newly created account address
     */
    create(passphrase: string): Promise<{}>;
    /**
     * Get list of accounts.
     * @returns {Promise<string[]>} list of account addresses
     */
    get(): Promise<{}>;
    /**
     * Unlock account.
     * @param {string} address
     * @param {string} passphrase
     * @returns {Promise<string>} unlocked account address
     */
    unlock(address: Address | string, passphrase: string): Promise<Address>;
    /**
     * Lock account.
     * @param {string} address
     * @param {string} passphrase
     * @returns {Promise<Address>} locked account address
     */
    lock(address: Address | string, passphrase: string): Promise<Address>;
    /**
     * Convenience method to send transaction from account.
     * This method automatically retrieves the nonce, signs the transaction, and sends it to the network.
     * @param {Tx} tx transaction data
     * @returns {Promise<string>} transaction hash
     */
    sendTransaction(tx: any): Promise<string>;
    /**
     * Sign transaction.
     * @param {Tx} tx transaction data
     * @returns {Promise<Tx>} transaction data including signature
     */
    signTransaction(_tx: Tx | object): Promise<Tx>;
}
export default Accounts;
