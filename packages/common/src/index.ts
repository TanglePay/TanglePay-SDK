import {
  JsonRpcError,
  JsonRpcRequest,
  JsonRpcRequestHandler,
  JsonRpcRequestMiddleware,
  JsonRpcResponse, MobileWindowSharedContext,
} from './types';
import { Duplex, DuplexOptions } from 'stream';

export * from './types';
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
      const cur: JsonRpcRequestHandler<T, U> = async (req) => {
        try {
          return await middleware(req, pre);
        } catch (e) {

          const rpcError:JsonRpcError = {
            code:99999,
            name: 'unhandled exception',
            message: 'unhandled exception',
            data: e,
          };
          return { id:req.id, version:0, error:rpcError };
        }
      };
      pre = cur;
    }
    this._handler = pre;
    return this;
  }

  async request(req:JsonRpcRequest<T>):Promise<JsonRpcResponse<U>> {
    if (!this._handler) {
      const rpcError: JsonRpcError = {
        code: 99998,
        name: 'uninit',
        message: 'engine not initialized',
      };
      const resp = { id: req.id, version: 0, error: rpcError };
      return resp;
    } else {
      return this._handler!(req);
    }
  }
}


export class WindowPostStream extends Duplex {
  _isMobile = false;

  set isMobile(v:boolean) {
    this._isMobile = v;
  }

  constructor( opts?: DuplexOptions) {
    const merged = Object.assign(opts ?? {}, {
      readableObjectMode:true, writableObjectMode:true });
    super(merged);

    window.addEventListener('message', (e)=>{
      const data = e.data;
      this.push(data);
    }, false);
  }

  _write(chunk: any, encoding: BufferEncoding, callback: (error?: (Error | null)) => void) {
    const sharedContext = window as unknown as MobileWindowSharedContext;
    if (this._isMobile && sharedContext.ReactNativeWebView) {
      sharedContext.ReactNativeWebView.postMessage(JSON.stringify(chunk));
    } else {
      window.postMessage(chunk, '*');
    }
    callback();
  }

  _read(size: number) {
    return undefined;
  }


}
