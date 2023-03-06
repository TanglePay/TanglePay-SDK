import {JsonRpcError, JsonRpcRequest, JsonRpcRequestHandler, JsonRpcRequestMiddleware, JsonRpcResponse} from "./types";

export class JsonRpcEngine<T, U> {

    _middlewares: JsonRpcRequestMiddleware<T, U>[] = [];

    _handler?:JsonRpcRequestHandler<T, U> = undefined;

    static builder<T, U>() {
        return new JsonRpcEngine<T, U>;
    }

    add(middleware: JsonRpcRequestMiddleware<T, U>) {
        this._middlewares.push(middleware);
        return this;
    }

    build() {
        this._middlewares = this._middlewares.reverse();
        let pre: JsonRpcRequestHandler<T, U> | undefined = undefined;
        for (const middleware of this._middlewares) {
            const lcpre = pre
            const cur: JsonRpcRequestHandler<T, U> = async (req) => {
                try {
                    return await middleware(req, lcpre);
                } catch (e) {

                    const rpcError:JsonRpcError = {
                        code:99999,
                        name: 'unhandled exception',
                        message: 'unhandled exception',
                        data: e,
                    };
                    return { id:req.id!, version:0, error:rpcError };
                }
            };
            pre = cur;
        }
        this._handler = pre;
        return this;
    }

    async request(req:Partial<JsonRpcRequest<T>>):Promise<JsonRpcResponse<U>> {
        if (!this._handler) {
            const rpcError: JsonRpcError = {
                code: 99998,
                name: 'uninit',
                message: 'engine not initialized',
            };
            const resp = { id: req.id!, version: 0, error: rpcError };
            return resp;
        } else {
            return this._handler!(req);
        }
    }
}
