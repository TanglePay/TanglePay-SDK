/// <reference types="node" />
import { EventEmitter } from 'events';
export interface Stream extends EventEmitter {
}
export type JsonRpcId = number | string;
export interface JsonRpcRequest<T> {
    version: number;
    method: string;
    id: JsonRpcId;
    params?: T;
}
export interface JsonRpcError extends Error {
    code: number;
    data?: unknown;
}
export interface JsonRpcResponse<T> {
    version: number;
    id: JsonRpcId;
    data?: Partial<T>;
    error?: JsonRpcError;
}
export interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | object;
}
export type JsonRpcRequestHandler<T, U> = (req: Partial<JsonRpcRequest<T>>) => Promise<JsonRpcResponse<U>>;
export type JsonRpcRequestMiddleware<T, U> = (req: Partial<JsonRpcRequest<T>>, next?: JsonRpcRequestHandler<T, U>) => Promise<JsonRpcResponse<U>>;
export type EventCallback = (...args: any[]) => void;
export interface MobileWindowSharedContext {
    ReactNativeWebView?: {
        postMessage(msg: string): void;
    };
}
//# sourceMappingURL=types.d.ts.map