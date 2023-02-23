import { IEthereumProvider, RequestArguments } from './types';
import { EventEmitter } from 'events';
import iota from '@tanglepaysdk/core';
import { JsonRpcEngine } from '@tanglepaysdk/common';

class EthereumProvider extends EventEmitter implements IEthereumProvider {

  _version = 101;

  _rpcEngine:JsonRpcEngine<RequestArguments, unknown>;

  _seq:number;

  constructor() {
    super();
    this._seq = 1;
    this._rpcEngine = JsonRpcEngine
      .builder<RequestArguments, unknown>()
      .add(async (req, next)=>{
        req.id = this._seq++;
        req.version = this._version;
        return next!(req);
      })
      .add(async (req) => {
        const { method, params, id } = req;
        const resp = await iota.request({ method, params }) as any;
        return { id, version:100, data: resp };
      })
      .build();

    // prepare event
    // message chainChanged accountsChanged
    const eventMap = {
      connect:this._handleConnect,
      disconnect: this._handleDisconnect,
      message: this._handleMessage,
      chainChanged: this._handleChainChanged,
      accountsChanged: this._handleAccountsChanged,
    };
    for ( const [event, handle] of Object.entries(eventMap)) {
      iota.on(event, handle.bind(this));
    }
  }

  _handleConnect(data:any) {
    this.emit('connect',data)
  }

  _handleDisconnect(data:any) {
    this.emit('disconnect',data)
  }

  _handleMessage(data:any) {
    this.emit('message',data)
  }

  _handleChainChanged(data:any) {
    this.emit('chainChanged',data)
  }

  _handleAccountsChanged(data:any) {
    this.emit('accountsChanged',data)
  }

  async request(args: RequestArguments): Promise<unknown> {
    // @ts-ignore
    const resp = await this._rpcEngine.request(args);
    if (resp.error) {
      throw resp.error;
    } else {
      return resp.data;
    }
  }
}

const instance = new EthereumProvider;

// @ts-ignore
window.ethereum = instance;

export default instance;

