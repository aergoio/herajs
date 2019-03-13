import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { Counter } from '../src/counter/counter';
import { MiddlewareConsumer, Middleware, MiddlewareNextFunc, MiddlewareMethod, MiddlewareFunc } from '../src/middleware';

interface KeymanagerMiddleware {
    getSomeValue: MiddlewareMethod<string, number>;
}
interface SomeOtherMiddleware {
    middlewareRequired: MiddlewareMethod<string, boolean>;
}
class LocalstorageKeyManager extends Middleware implements KeymanagerMiddleware {
    getSomeValue(): MiddlewareFunc<string, number> {
        return (next: MiddlewareNextFunc<string, number>) => (key: string) => {
            console.log('middleware was here');
            return next(key);
        };
    }
}
// a middleware that provides a value, it doesn't call next.
class TestMiddleware extends Middleware implements SomeOtherMiddleware {
    middlewareRequired(): MiddlewareFunc<string, boolean> {
        return () => (key?: string) => {
            if (key === 'bar') return true;
            return false;
        };
    }
}
class Client extends MiddlewareConsumer {
    getSomeValue(key: string): number {
        return this.applyMiddlewares<string, number>('getSomeValue')(
            (key: string) => key.length
        )(key);
    }
    middlewareRequired(key: string): number {
        return this.applyMiddlewares<string, number>('middlewareRequired')()(key);
    }
    get keystore() {
        return this.applyMiddlewares<undefined, Record<string, any>>('keystore')()(undefined);
    }
}
const logger = () => (next: MiddlewareNextFunc<any, any>) => (arg: any): any => {
    console.log('calling func', arg);
    const result = next(arg);
    console.log('result', result);
    return result;
};

describe('Middleware', () => {
    it('should work', () => {
        const client = new Client();
        client.use(LocalstorageKeyManager);
        client.use({
            getSomeValue: logger as MiddlewareMethod<any, any>
        });
        const result = client.getSomeValue('bar');
        console.log(result);
        assert.throws(() => {
            client.middlewareRequired('bar');
        });
        client.use(TestMiddleware);
        client.use({
            middlewareRequired: logger as MiddlewareMethod<any, any>
        });
        const result2 = client.middlewareRequired('bar');
        console.log(result2);
        client.use({
            keystore() {
                return () => () => {
                    return { key: 'value' };
                };
            }
        });
        console.log(client.keystore);
    });
});



describe('Counter', () => {
    it('should work', () => {
        const counter = new Counter();
        counter.add();
        counter.add();
        counter.add();

        assert.equal(counter.getValue(), 3);

        counter.subtract();
        counter.subtract();
        
        assert.equal(counter.getValue(), 1);
    });
});

/*
describe('Account', () => {
    it('should work', () => {
        const account = new Account('Abcdef');
        account.data.balance = new Amount('1 aergo');
    });
});
*/

/*
describe('Wallet', () => {
    it('should work', () => {
        const client = new AergoClient({});
        const wallet = new Wallet({
            client
        });
        wallet.use(LocalStorageKeymanager);
    });
});*/