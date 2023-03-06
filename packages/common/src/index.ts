import {
  JsonRpcError,
  JsonRpcRequest,
  JsonRpcRequestHandler,
  JsonRpcRequestMiddleware,
  JsonRpcResponse, MobileWindowSharedContext,
} from './types';
import { Duplex, DuplexOptions } from 'stream';

export * from './types';
export * from './JsonRpcEngine'
export * from './EthereumWeb3Impl'

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
