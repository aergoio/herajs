// execute with npx babel-node middleware.js

type MiddlewareNextFuncNoInput<O> = () => O;
type MiddlewareNextFuncInput<I, O> = (input: I) => O;
export type MiddlewareNextFunc<I, O> = MiddlewareNextFuncInput<I, O> | MiddlewareNextFuncNoInput<O>;
export type MiddlewareFunc<I, O> = (next: MiddlewareNextFunc<I, O>) => MiddlewareNextFunc<I, O>;
type MiddlewareMainFunc<I, O> = (next?: MiddlewareNextFunc<I, O>) => MiddlewareNextFunc<I, O>;
export type MiddlewareMethod<I, O> = (consumer: MiddlewareConsumer) => MiddlewareFunc<I, O>;

export interface MiddlewareInterface {
    readonly [key: string]: MiddlewareMethod<any, any>
}
export class Middleware implements MiddlewareInterface {
    readonly [key: string]: MiddlewareMethod<any, any>
}
interface MiddlewareConstructor {
    new (): MiddlewareInterface;
}
function isMiddlewareConstructor(arg: Middleware | MiddlewareInterface | MiddlewareConstructor): arg is MiddlewareConstructor {
    return (typeof arg === 'function');
}


export class MiddlewareConsumer {
    middlewares: MiddlewareInterface[] = [];

    use(middleware: Middleware | MiddlewareInterface | MiddlewareConstructor) {
        if (isMiddlewareConstructor(middleware)) {
            middleware = new middleware();
        }
        this.middlewares.push(middleware);
    }
    applyMiddlewares<I, O>(functionName: string): MiddlewareMainFunc<I, O> {
        return (next: MiddlewareNextFunc<I, O> | undefined): MiddlewareNextFunc<I, O> => {
            let fn: MiddlewareNextFunc<I, O>;
            if (typeof next === 'undefined') {
                fn = () => {
                    throw new Error(`Method ${functionName} has no fallback implementation. Did you forget to load a middleware?`);
                };
            } else {
                fn = next;
            }
            if (this.middlewares) {
                for (const middleware of this.middlewares) {
                    if (typeof middleware[functionName] === 'function') {
                        fn = middleware[functionName](this)(fn);
                    }
                }
            }
            return fn;
        };
    }   
}
