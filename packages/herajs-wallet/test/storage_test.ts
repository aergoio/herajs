import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import MemoryStorage from '../src/storages/memory';
import { Data, Record } from '../src/models/record';
import { Wallet } from '../src/wallet';

interface TestData extends Data {
    foo: number;
}
type TestRecord = Record<TestData>;

describe('MemoryStorage', () => {
    it('sets and gets a record', async () => {
        const storage = new MemoryStorage('test', 1);
        const record: TestRecord = { key: 'my-key', data: { foo: 1234 } };
        await storage.getIndex('records').put(record);
        const result = await storage.getIndex('records').get('my-key') as TestRecord;
        assert.equal(result.data.foo, 1234);
    });
    it('gets all records', async () => {
        const storage = new MemoryStorage('test', 1);
        const records: TestRecord[] = [
            { key: 'my-key', data: { foo: 1234 } },
            { key: 'your-key', data: { foo: 4567 } }
        ];
        for (const record of records) {
            await storage.getIndex('records').put(record);
        }
        const results = Array.from(await storage.getIndex('records').getAll());
        assert.equal(results[0].key, 'my-key');
        assert.equal(results[0].data.foo, 1234);
        assert.equal(results[1].key, 'your-key');
        assert.equal(results[1].data.foo, 4567);
    });
    it('supports fake index', async () => {
        const storage = new MemoryStorage('test', 1);
        const records: TestRecord[] = [
            { key: 'my-key', data: { foo: 1234 } },
            { key: 'your-key', data: { foo: 4567 } },
            { key: 'our-key', data: { foo: 4567 } }
        ];
        for (const record of records) {
            await storage.getIndex('records').put(record);
        }
        const results = Array.from(await storage.getIndex('records').getAll(4567, 'foo'));
        assert.equal(results.length, 2);
        assert.equal(results[0].key, 'your-key');
        assert.equal(results[0].data.foo, 4567);
        assert.equal(results[1].key, 'our-key');
        assert.equal(results[1].data.foo, 4567);
    });
    it('works with Wallet', async () => {
        const wallet = new Wallet();
        wallet.useStorage(MemoryStorage);
        const record: TestRecord = { key: 'my-key', data: { foo: 1234 } };
        if (!wallet.datastore) throw Error('datastore not set');
        await wallet.datastore.getIndex('foo').put(record);
        const check = await wallet.datastore.getIndex('foo').get(record.key);
        assert.equal(check.data.foo, 1234);
    });
});
