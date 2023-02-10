
import { sendToContentScript, toInstall } from './service';
import { IotaEventCapsule, IotaResponse, WindowSharedContext } from './interface';

// context objects
const iotaEvents: Record<string, IotaEventCapsule[]> = {};
const context:{ curTanglePayAddress?:string } = {};
const iotaRequests: Record<string, Function> = {};

const IotaSDK = {
  redirectAppStoreIfNotInstalled: false,
  isTanglePay: false,
  tanglePayVersion: '',
  request: async ({ method, params, timeout = 30000 }:{ method: string, timeout: number, params: unknown }) => {
    if (!IotaSDK.isTanglePay) {
      toInstall(IotaSDK.redirectAppStoreIfNotInstalled);
    }
    method = !['eth_sign', 'personal_sign'].includes(method) ? method : 'iota_sign';
    return new Promise((resolve, reject) => {
      iotaRequests[`iota_request_${method}`] = function (res: IotaResponse<any>, code:number) {
        if (code === 200) {
          // cache iota address
          if (method === 'iota_connect') {
            const address = res.address || '';
            context.curTanglePayAddress = address + '_' + res.nodeId;
          }
          resolve(res);
        } else {
          reject(res);
        }
      };
      // timeout in case of no response coming back
      setTimeout(()=>{
        reject();
      }, timeout);
      sendToContentScript({
        cmd: 'iota_request',
        data: { method, params },
      });
    });
  },
  on: (event: string, callBack : Function) => {
    const key = `iota_event_${event}`;
    const handler = (res: IotaResponse<any>) => {
      if (event === 'accountsChanged') {
        const address = res.address + '_' + res.nodeId;
        if (context.curTanglePayAddress !== address && callBack) {
          if (callBack) callBack({
            ...res,
          });
        }
        context.curTanglePayAddress = address || '';
      } else {
        if (callBack) callBack(res);
      }
    };
    const id = `${new Date().getTime()}${Math.round(Math.random() * 1000)}`;
    iotaEvents[key] = iotaEvents[key] || [];
    iotaEvents[key].push({
      id,
      handler,
      callBack,
    });
  },
  removeListener(event: string, callBack: Function) {
    const key = `iota_event_${event}`;
    const list = iotaEvents[key] || [];
    const index = list.findIndex((e) => e.callBack === callBack);
    if (index >= 0) {
      list.splice(index, 1);
    }
  },
  removeAllListener(event: string) {
    const key = `iota_event_${event}`;
    iotaEvents[key] = [];
  },
};


// get message from content-script
window.addEventListener(
  'message',
  function (e) {
    const cmd = (e?.data?.cmd || '').replace('contentToInject##', '');
    const data = e?.data?.data;
    const code = e?.data?.code;
    switch (cmd) {
      case 'getTanglePayInfo':
        IotaSDK.tanglePayVersion = data?.version;
        window.dispatchEvent(new CustomEvent('iota-ready'));
        break;
      case 'iota_request':
        {
          const callBack = iotaRequests[`iota_request_${data.method}`];
          if (callBack) callBack(data.response, code);
        }
        break;
      case 'iota_event':
        {
          const list = iotaEvents[`${cmd}_${data.method}`] || [];
          list.forEach((cap) => {
            if (cap.handler) cap.handler(data.response, code);
          });
        }
        break;
      default:
        break;
    }
  },
  false,
);


let loadNum = 0;
const onLoad = () => {
  const sharedContext = window as unknown as WindowSharedContext;
  const env = sharedContext.TanglePayEnv;
  if (!env) {
    loadNum++;
    if (loadNum <= 10) {
      setTimeout(onLoad, 300);
      return;
    }
  }
  switch (env) {
    case 'app':
    case 'chrome':
      {
        IotaSDK.isTanglePay = true;
        // get info
        sendToContentScript({
          cmd: 'getTanglePayInfo',
        });
      }
      break;
    default:
      {
        window.dispatchEvent(new CustomEvent('iota-ready'));
        toInstall(IotaSDK.redirectAppStoreIfNotInstalled);
      }
      break;
  }
};

window.addEventListener('load', onLoad);

export default IotaSDK;
