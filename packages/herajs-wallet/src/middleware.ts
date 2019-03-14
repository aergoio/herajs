// execute with npx babel-node middleware.js

type MiddlewareNextFuncNoInput<O> = () => O;
type MiddlewareNextFuncInput<I, O> = (input: I) => O;
export type MiddlewareNextFunc<I, O> = MiddlewareNextFuncInput<I, O> | MiddlewareNextFuncNoInput<O>;
export type MiddlewareFunc<I, O> = (next: MiddlewareNextFunc<I, O>) => MiddlewareNextFunc<I, O>;
type MiddlewareMainFunc<I, O> = (next?: MiddlewareNextFunc<I, O>) => MiddlewareNextFunc<I, O>;
export type MiddlewareMethod<I, O, ConsumerT = MiddlewareConsumer> = (consumer: ConsumerT) => MiddlewareFunc<I, O>;

export interface MiddlewareInterface<ConsumerT = MiddlewareConsumer> {
    readonly [key: string]: MiddlewareMethod<any, any, ConsumerT>
}
export class Middleware<ConsumerT = MiddlewareConsumer> implements MiddlewareInterface<ConsumerT> {
    readonly [key: string]: MiddlewareMethod<any, any, ConsumerT>
}
interface MiddlewareConstructor<ConsumerT = MiddlewareConsumer> {
    new (): MiddlewareInterface<ConsumerT>;
}
function isMiddlewareConstructor<ConsumerT = MiddlewareConsumer>(
    arg: Middleware<ConsumerT> | MiddlewareInterface<ConsumerT> | MiddlewareConstructor<ConsumerT>
    ): arg is MiddlewareConstructor<ConsumerT> {
    return (typeof arg === 'function');
}

export class MiddlewareConsumer {
    middlewares: MiddlewareInterface<this>[] = [];

    use(middleware: Middleware<this> | MiddlewareInterface<this> | MiddlewareConstructor<this>) {
        if (isMiddlewareConstructor<this>(middleware)) {
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
