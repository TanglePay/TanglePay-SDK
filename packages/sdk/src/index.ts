
import { IotaReadyEventData, IotaResponse, SendToScriptParam, WindowSharedContext } from './types';
import { EventEmitter } from 'events';
import {EventCallback, JsonRpcEngine, JsonRpcId, JsonRpcResponse, WindowPostStream} from 'tanglepaysdk-common';

// context objects
const context:{ curTanglePayAddress?:string } = {};
const iotaRequests: Record<string, EventCallback> = {};
let _seq = 1;
const _rpcVersion = 101;
const _stream = new WindowPostStream();
const _rpcEngine = JsonRpcEngine
  .builder<SendToScriptParam, unknown>()
  .add(async (req, next)=>{
    req.id = _seq++
    req.version = _rpcVersion
    req.params!.cmd = `injectToContent##${req.params!.cmd}`;
    req.params!.origin = window.location.origin;
    req.params!.id = req.id
    return next!(req);
  })
  .add(async (req) => {

    const { cmd, data, id } = req.params!;
    _stream.write(req.params!);
    if (cmd == 'injectToContent##iota_request') { // case request
      const { method } = data;
      return new Promise<JsonRpcResponse<unknown>>((resolve, reject)=>{
        iotaRequests[`iota_request_${method}_${req.id??0}`] =  (res: IotaResponse<any>, code:number) => {
          if (code === 200) {
            // cache iota address
            if (method === 'iota_connect') {
              const address = res.address || '';
              context.curTanglePayAddress = address + '_' + res.nodeId;
            }
            resolve({ id, version:100, data: res });
          } else {
            reject(res);
          }
        };
      });
    } else {
      return { id:req.id!, version:100, data: undefined };
    }
  })
  .build();
const IotaSDK = {
  //redirectAppStoreIfNotInstalled: false,
  isTanglePay: false,
  tanglePayVersion: '',
  _events: new EventEmitter(),
  _waitReady:Promise<void>,

  request: async ({ method, params, timeout = 30000 }:{ method: string, timeout?: number, params: unknown }) => {
    if (!IotaSDK.isTanglePay) {
      console.log('tanglepay not installed');
      return
      //toInstall(IotaSDK.redirectAppStoreIfNotInstalled);
    }
    method = !['eth_sign', 'personal_sign'].includes(method) ? method : 'iota_sign';
    // @ts-ignore
    const res = await _rpcEngine.request({ params:{
      cmd: 'iota_request',
      data: { method, params },
    } });
    if(res.error) {
      throw res.error
    }
    return res.data;
  },
  on: (event: string, callBack : EventCallback) => {
    const key = `iota_event_${event}`;
    IotaSDK._events.on(key, callBack);
  },
  removeListener(event: string, callBack: EventCallback) {
    const key = `iota_event_${event}`;
    IotaSDK._events.removeListener(event, callBack);
  },
  removeAllListener(event: string) {
    const key = `iota_event_${event}`;
    IotaSDK._events.removeAllListeners(event);
  },
};


// get message from content-script

_stream.on('data', (data_?:any)=>{
  const cmd = (data_?.cmd || '').replace('contentToInject##', '');
  const data = data_?.data;
  const code = data_?.code;
  const reqId = data_?.id;
  switch (cmd) {
    case 'getTanglePayInfo':
      IotaSDK.tanglePayVersion = data?.version;
      const eventData:IotaReadyEventData = {
        isTanglePayInstalled: true,
        tanglePayVersion: data?.version,
        environment: _stream.isMobile ? 'app' : 'chrome',
      }
      window.dispatchEvent(new CustomEvent('iota-ready',{detail:eventData}));
      IotaSDK._events.emit('iota-ready', eventData);
      break;
    case 'iota_request':
      {
        const callBack = iotaRequests[`iota_request_${data.method}_${reqId??0}`];
        if (callBack) callBack(data.response, code);
      }
      break;
    case 'iota_event':
      {
        const event = data.method;
        const key = `iota_event_${data.method}`;
        const res:IotaResponse<any> = data.response;
        if (event === 'accountsChanged') {
          const address = res.address + '_' + res.nodeId;
          if (context.curTanglePayAddress !== address) {
            IotaSDK._events.emit(key, res);
          }
          context.curTanglePayAddress = address || '';
        } else {
          IotaSDK._events.emit(key, res);
        }
      }
      break;
    default:
      break;
  }
});

let loadNum = 0;
export const onLoad = () => {
  console.log('onLoad', loadNum);
  /*
  let readyResolve:(value:unknown)=>void;
  
  IotaSDK._waitReady = new Promise((resolve, reject)=>{
    readyResolve = resolve;
    setTimeout(()=>{
      reject('timeout');
    },15000);
  })
*/
  const sharedContext = window as unknown as WindowSharedContext;
  const env = sharedContext.TanglePayEnv;
  if (!env) {
    loadNum++;
    if (loadNum <= 10) {
      setTimeout(onLoad, 300);
      return;
    }
  }
  console.log('onLoad for env:', env);
  switch (env) {
    case 'app':
    case 'chrome':
      {
        IotaSDK.isTanglePay = true;
        _stream.isMobile = env == 'app';

        // @ts-ignore
        _rpcEngine.request({ params:{
          cmd: 'getTanglePayInfo',
        } });
      }
      break;
    default:
      {
        console.log('not tanglepay');
        const eventData:IotaReadyEventData = {
          isTanglePayInstalled: false,
          tanglePayVersion: '',
          environment: 'unknown',
        }

        window.dispatchEvent(new CustomEvent('iota-ready',{detail:eventData}));
        IotaSDK._events.emit('iota-ready', eventData);
        //toInstall(IotaSDK.redirectAppStoreIfNotInstalled);
      }
      break;
  }
};
window.addEventListener('load', onLoad);

export default IotaSDK;
