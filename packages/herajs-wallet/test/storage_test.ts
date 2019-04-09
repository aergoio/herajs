import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { Storage } from '../src/storages/storage';
import MemoryStorage from '../src/storages/memory';
import LevelDbStorage from '../src/storages/leveldb';
import { Data, Record } from '../src/models/record';
import { Wallet } from '../src/wallet';
import { Constructor } from '../src/utils';

interface TestData extends Data {
    foo: number;
}
type TestRecord = Record<TestData>;

interface TestDeepData extends Data {
    foo: {
        bar: string;
    };
}
type TestDeepRecord = Record<TestDeepData>;

interface Storages {
    [key: string]: Constructor<Storage>;
}
const storages: Storages = {
    'MemoryStorage': MemoryStorage,
    'LevelDbStorage': LevelDbStorage,
};

for (const key in storages) {
    const cls = storages[key] as Constructor<Storage>;

    describe(key, () => {
        it('sets and gets a record', async () => {
            const storage = new cls('test-1', 1);
            await storage.open();
            const record: TestRecord = { key: 'my-key', data: { foo: 1234 } };
            await storage.getIndex('records').put(record);
            const result = await storage.getIndex('records').get('my-key') as TestRecord;
            assert.equal(result.data.foo, 1234);
            await storage.close();
        });
        it('gets all records', async () => {
            const storage = new cls('test-2', 1);
            await storage.open();
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
            await storage.close();
        });
        it('supports fake index', async () => {
            const storage = new cls('test-3', 1);
            await storage.open();
            const records: TestRecord[] = [
                { key: 'my-key', data: { foo: 1234 } },
                { key: 'your-key', data: { foo: 4567 } },
                { key: 'our-key', data: { foo: 4567 } }
            ];
            for (const record of records) {
                await storage.getIndex('records').put(record);
            }
            const results = Array.from(await storage.getIndex('records').getAll(4567, 'foo')) as TestRecord[];
            assert.equal(results.length, 2);
            assert.equal(results[0].key, 'our-key');
            assert.equal(results[0].data.foo, 4567);
            assert.equal(results[1].key, 'your-key');
            assert.equal(results[1].data.foo, 4567);
            await storage.close();
        });
        it('index with dot path', async () => {
            const storage = new cls('test-4', 1);
            await storage.open();
            const records: TestDeepRecord[] = [
                { key: 'my-key', data: { foo: { bar: '1234' } } },
                { key: 'your-key', data: { foo: { bar: '2345' } } },
                { key: 'our-key', data: { foo: { bar: '1234' } } }
            ];
            for (const record of records) {
                await storage.getIndex('records').put(record);
            }
            const results = Array.from(await storage.getIndex('records').getAll('1234', 'foo.bar')) as TestDeepRecord[];
            assert.equal(results.length, 2);
            assert.equal(results[0].key, 'my-key');
            assert.equal(results[0].data.foo.bar, '1234');
            assert.equal(results[1].key, 'our-key');
            assert.equal(results[1].data.foo.bar, '1234');
            await storage.close();
        });
        it('doesnt store private key', async () => {
            const wallet = new Wallet();
            wallet.useStorage(cls);
            await wallet.setupAndUnlock('password');
            const account = await wallet.accountManager.createAccount();
            const key = await wallet.keyManager.getKey(account);
            assert.isNull(key.data.privateKey);
            await wallet.close();
        });
        it('works with Wallet', async () => {
            const wallet = new Wallet();
            wallet.useStorage(cls);
            const record: TestRecord = { key: 'my-key', data: { foo: 1234 } };
            if (!wallet.datastore) throw Error('datastore not set');
            await wallet.datastore.getIndex('foo').put(record);
            const check = await wallet.datastore.getIndex('foo').get(record.key);
            assert.equal(check.data.foo, 1234);
            await wallet.close();
        });
    });
}