import AergoClient from '../src';
import { longPolling } from '../src/utils';

import { GetTxResult } from '../src/client/types';

export function waitFor(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export async function commitTestTransaction(aergo: AergoClient): Promise<GetTxResult> {
    const createdAddress = await aergo.accounts.create('testpass');
    const address = await aergo.accounts.unlock(createdAddress, 'testpass');
    const testtx = {
        nonce: 1,
        from: address,
        to: address,
        amount: '123 aer',
        payload: null,
        chainIdHash: await aergo.getChainIdHash()
    };
    const tx = await aergo.accounts.signTransaction(testtx);
    const txhash = await aergo.sendSignedTransaction(tx);
    await waitFor(500);
    return await longPolling(async () => {
        return await aergo.getTransaction(txhash);
    }, result => 'block' in result, 5000);
}