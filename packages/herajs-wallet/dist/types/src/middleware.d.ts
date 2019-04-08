declare type MiddlewareNextFuncNoInput<O> = () => O;
declare type MiddlewareNextFuncInput<I, O> = (input: I) => O;
export declare type MiddlewareNextFunc<I, O> = MiddlewareNextFuncInput<I, O> | MiddlewareNextFuncNoInput<O>;
export declare type MiddlewareFunc<I, O> = (next: MiddlewareNextFunc<I, O>) => MiddlewareNextFunc<I, O>;
declare type MiddlewareMainFunc<I, O> = (next?: MiddlewareNextFunc<I, O>) => MiddlewareNextFunc<I, O>;
export declare type MiddlewareMethod<I, O, ConsumerT = MiddlewareConsumer> = (consumer: ConsumerT) => MiddlewareFunc<I, O>;
export interface MiddlewareInterface<ConsumerT = MiddlewareConsumer> {
    readonly [key: string]: MiddlewareMethod<any, any, ConsumerT>;
}
export declare class Middleware<ConsumerT = MiddlewareConsumer> implements MiddlewareInterface<ConsumerT> {
    readonly [key: string]: MiddlewareMethod<any, any, ConsumerT>;
}
interface MiddlewareConstructor<ConsumerT = MiddlewareConsumer> {
    new (): MiddlewareInterface<ConsumerT>;
}
export declare class MiddlewareConsumer {
    middlewares: MiddlewareInterface<this>[];
    use(middleware: Middleware<this> | MiddlewareInterface<this> | MiddlewareConstructor<this>): void;
    applyMiddlewares<I, O>(functionName: string): MiddlewareMainFunc<I, O>;
}
export {};
