import { AccountSpec } from './models/account';
import { TypedEventEmitter } from '@elderapo/typed-event-emitter';
/**
 * Returns the next interval to use for exponential backoff.
 * This curve yields every value 4 times before doubling in the next step.
 * The intervals reach ca. 1 minute (total time elapsed ca. 4 minutes) after step 24,
 * so it is advised to declare a timeout after a certain number of steps.
 * @param n step on the interval curve
 */
export declare function backoffIntervalStep(n: number, multiplier?: number): number;
export declare function serializeAccountSpec(accountSpec: AccountSpec): string;
export declare function deserializeAccountSpec(serialized: string): AccountSpec;
/**
 * A simple extension of the native Map using stringified objects as keys.
 * The order of object properties matters.
 */
export declare class HashMap<K, V> {
    private map;
    private hash;
    set(key: K, value: V): this;
    get(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    values(): IterableIterator<V>;
    keys(): IterableIterator<string>;
    readonly size: number;
}
export declare class PausableTypedEventEmitter<T> extends TypedEventEmitter<T> {
    paused: boolean;
    resume(): void;
    pause(): void;
}
export interface Constructor<T> {
    new (...args: any[]): T;
}
export declare function isConstructor<T>(arg: T | Constructor<T>): arg is Constructor<T>;
/**
 * Access a property using dot syntax
 * Example: propPath({ a: { b: 1 }}, 'a.b') => 1
 * @param obj
 * @param path
 */
export declare function propPath(obj: any, path: string): any;
