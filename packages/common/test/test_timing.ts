import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { backoffIntervalStep, retryIfErrorMatch } from '../src/timing';

describe('backoffIntervalStep()', () => {
    it('should calculate correctly', () => {
        const expected = [1000, 1000, 1000, 1000, 2000, 2000, 2000, 2000, 4000];
        for (const n of [...Array(expected.length).keys()]) {
            assert.equal(backoffIntervalStep(n), expected[n]);
        }
    });
});

describe('retryIfErrorMatch()', () => {
    it('should retry', async () => {
        const started = + new Date();
        const result = await retryIfErrorMatch(
            async () => {
                if ((+new Date() - started) < 250) throw new Error('not yet');
                return 1;
            },
            (e: Error) => e.message.match(/not yet/) !== null,
            // test timeout = 0 (default branch)
        );
        assert.equal(result, 1);
    });
    it('should timeout', async () => {
        await assert.isRejected(
            retryIfErrorMatch(
                async () => {
                    throw new Error('not yet');
                },
                (e: Error) => e.message.match(/not yet/) !== null,
                250,
                50,
            ),
            Error,
            'timeout'
        );
    });
    it('should timeout after 1s', async () => {
        await assert.isRejected(
            retryIfErrorMatch(
                async () => {
                    throw new Error('not yet');
                },
                (e: Error) => e.message.match(/not yet/) !== null,
                1250,
            ),
            Error,
            'timeout'
        );
    });
    it('should throw non-matching error', async () => {
        await assert.isRejected(
            retryIfErrorMatch(
                async () => {
                    throw new Error('unrelated error');
                },
                () => false,
                250,
                50,
            ),
            Error,
            'unrelated error'
        );
    });
});
