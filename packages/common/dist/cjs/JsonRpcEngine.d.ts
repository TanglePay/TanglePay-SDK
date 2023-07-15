import { JsonRpcRequest, JsonRpcRequestHandler, JsonRpcRequestMiddleware, JsonRpcResponse } from './types';
export declare class JsonRpcEngine<T, U> {
    _middlewares: JsonRpcRequestMiddleware<T, U>[];
    _handler?: JsonRpcRequestHandler<T, U>;
    static builder<T, U>(): JsonRpcEngine<T, U>;
    add(middleware: JsonRpcRequestMiddleware<T, U>): this;
    build(): this;
    request(req: Partial<JsonRpcRequest<T>>): Promise<JsonRpcResponse<U>>;
}
//# sourceMappingURL=JsonRpcEngine.d.ts.map