import { IEthereumProvider, RequestArguments } from './types';
import { EventEmitter } from 'events';
import iota from '@tanglepaysdk/core';
import {JsonRpcEngine, JsonRpcRequest, JsonRpcRequestHandler, JsonRpcRequestMiddleware} from '@tanglepaysdk/common';

class EthereumProvider extends EventEmitter implements IEthereumProvider {

  _version = 101;

  _rpcEngine:JsonRpcEngine<unknown[] | object, unknown>;

  _seq:number;

  _selectedAddress?:string;

  get isTanglePay(){
      return true
  }

  get selectedAddress(){
      return this._selectedAddress
  }
  constructor() {
    super();
    this._seq = 1;
    const log = (tag:string):JsonRpcRequestMiddleware<unknown[] | object, unknown> => async (req,next)=>{
      console.log('req:'+tag,req)
      const resp = await next!(req)
      console.log('resp:'+tag,resp)
      return resp
    }

    this._rpcEngine = JsonRpcEngine
      .builder<unknown[] | object, unknown>()
        .add(async (req,next)=>{
            if (this._selectedAddress == undefined) {
                try {
                    const res = await iota.request({ method: 'iota_connect', params: {}}) as { address: string }
                    if (res && res.address) {
                        this._selectedAddress = res.address
                    } else {
                        throw new Error('not connected')
                    }
                } catch (e) {
                    throw e;
                }
            }
            return await next!(req)
        })
        .add(log('1'))
      .add(async (req, next)=>{
        req.id = this._seq++;
        req.version = this._version;
        return next!(req);
      })
        .add(async (req,next)=>{
          const methodMapping:Record<string, string> = {
            'eth_requestAccounts':'iota_accounts',
            'eth_connect':'iota_connect',
          };
          const requestMapping:Record<string, Function> = {
              'eth_sign':(data:undefined[])=> data.reverse()),
              'personal_sign':(data:unknown)=> ({
                  content:data
              }),
              'eth_sendTransaction': (arr:unknown[]) => {
                  const pl = arr[0] as {value:string|number,data:any}
                  pl.value = parseInt(pl.value as string)
                  return pl
              },
              'eth_getBalance':()=>({assetsList : ['evm'], addressList:[]})
          }
            const noop = (data:any)=>data
          const method = req.method!
          const reqcp = {...req}
            reqcp.method = methodMapping[method] ?? method
            const reqTransform = requestMapping[method] ?? noop
            reqcp.params = reqTransform(reqcp.params)
          const resp = await next!(reqcp)

          const responseMapping:Record<string, Function> = {
            'eth_connect':(data:{address:string})=>[data.address],
              'eth_getBalance':(data:{amount:number})=>data.amount
          }
          const respTransform = responseMapping[method] ?? noop;
          const respcp = {...resp}
          respcp.data = respTransform(resp.data)
          return respcp
        })
        .add(log('2'))
        .add(async (req) => {
        const { method, params, id } = req;
        const resp = await iota.request({ method:method!, params }) as any;
        return { id:id!, version:100, data: resp };
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

