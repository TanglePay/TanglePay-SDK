import { checkIsPc } from './util';


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

