import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import MemoryStorage from '../src/storages/memory';
import { Data, Record } from '../src/models/record';

interface TestData extends Data {
    foo: number;
}
type TestRecord = Record<TestData>;

describe('MemoryStorage', () => {
    it('should work', async () => {
        const storage = new MemoryStorage();
        const record: TestRecord = { key: 'my-key', data: { foo: 1234 } };
        await storage.put(record);
        const result = await storage.get('my-key') as TestRecord;
        assert.equal(result.data.foo, 1234);
    });
});
