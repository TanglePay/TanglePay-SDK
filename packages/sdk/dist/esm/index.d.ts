/// <reference types="node" />
import { EventEmitter } from 'events';
import { EventCallback } from 'tanglepaysdk-common';
declare const IotaSDK: {
    isTanglePay: boolean;
    tanglePayVersion: string;
    _events: EventEmitter;
    _waitReady: {
        new (executor: (resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => void): Promise<void>;
        all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
        all<T_1 extends [] | readonly unknown[]>(values: T_1): Promise<{ -readonly [P in keyof T_1]: Awaited<T_1[P]>; }>;
        race<T_2>(values: Iterable<T_2 | PromiseLike<T_2>>): Promise<Awaited<T_2>>;
        race<T_3 extends [] | readonly unknown[]>(values: T_3): Promise<Awaited<T_3[number]>>;
        readonly prototype: Promise<any>;
        reject<T_4 = never>(reason?: any): Promise<T_4>;
        resolve(): Promise<void>;
        resolve<T_5>(value: T_5): Promise<Awaited<T_5>>;
        resolve<T_6>(value: T_6 | PromiseLike<T_6>): Promise<Awaited<T_6>>;
        allSettled<T_7 extends [] | readonly unknown[]>(values: T_7): Promise<{ -readonly [P_1 in keyof T_7]: PromiseSettledResult<Awaited<T_7[P_1]>>; }>;
        allSettled<T_8>(values: Iterable<T_8 | PromiseLike<T_8>>): Promise<PromiseSettledResult<Awaited<T_8>>[]>;
        readonly [Symbol.species]: PromiseConstructor;
    };
    request: ({ method, params, timeout }: {
        method: string;
        timeout?: number | undefined;
        params: unknown;
    }) => Promise<Partial<unknown> | undefined>;
    on: (event: string, callBack: EventCallback) => void;
    onLoad: () => void;
    removeListener(event: string, callBack: EventCallback): void;
    removeAllListener(event: string): void;
};
export default IotaSDK;
//# sourceMappingURL=index.d.ts.map