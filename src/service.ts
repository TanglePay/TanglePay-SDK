import { checkIsPc } from './util';
import { SendToScriptParam, WindowSharedContext } from './interface';


export const toInstall = (redirectAppStoreIfNotInstalled:boolean) => {
  const isPc = checkIsPc();
  if (isPc) {
    if (redirectAppStoreIfNotInstalled) {
      window.open(
        'https://chrome.google.com/webstore/detail/tanglepay-iota-wallet/hbneiaclpaaglopiogfdhgccebncnjmc?hl=en-US',
        'TanglePay-Extension',
      );
    }
  } else {
    window.open('https://tanglepay.com/', 'TanglePay');
    // console.error('Browser not supported')
  }
};
// send message to content-script
export const sendToContentScript = (params: SendToScriptParam) => {
  params.cmd = `injectToContent##${params.cmd}`;
  params.origin = window.location.origin;
  // params:{cmd,origin,data}
  const sharedContext = window as unknown as WindowSharedContext;
  if (sharedContext.TanglePayEnv === 'app' && sharedContext.ReactNativeWebView) {
    sharedContext.ReactNativeWebView.postMessage(JSON.stringify(params));
  } else {
    window.postMessage(params, '*');
  }
};
