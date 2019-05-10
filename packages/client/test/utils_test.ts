import chai from 'chai';
const assert = chai.assert;

import { toHexString } from '../src/utils';

describe('toHexString', () => {

    it('should convert byte arrays to plain hex string', () => {
        assert.equal(toHexString([123, 123]), '7b7b');
        assert.equal(toHexString([0]), '00');
        assert.equal(toHexString([]), '');
    });

    it('should convert byte arrays to formatted hex string', () => {
        assert.equal(toHexString([123, 123], true), '0x7b7b');
        assert.equal(toHexString([0], true), '0x0');
        assert.equal(toHexString([], true), '0x0');
    });

});