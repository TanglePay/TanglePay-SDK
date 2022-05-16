// send message to content-script
const sendToContentScript = (params) => {
    params.cmd = `injectToContent##${params.cmd}`
    params.origin = window.location.origin
    // params:{cmd,origin,data,isKeepPopup}
    if (window.TanglePayEnv === 'app') {
        window.ReactNativeWebView.postMessage(JSON.stringify(params))
    } else {
        window.postMessage(params, '*')
    }
}
// get message from content-script
window.addEventListener(
    'message',
    function (e) {
        const cmd = (e?.data?.cmd || '').replace('contentToInject##', '')
        const data = e?.data?.data
        const code = e?.data?.code
        switch (cmd) {
            case 'getTanglePayInfo':
                iotaSDK.tanglePayVersion = data?.version
                window.dispatchEvent(new CustomEvent('iota-ready'))
                break
            case 'iota_request':
            case 'iota_event':
                {
                    const callBack = window[`${cmd}_${data.method}`]
                    callBack && callBack(data.response, code)
                }
                break
            default:
                break
        }
    },
    false
)

// to install
const toInstall = () => {
    const agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod')
    const userAgentInfo = navigator.userAgent
    let isPc = true
    for (let v = 0; v < agents.length; v++) {
        if (userAgentInfo.indexOf(agents[v]) > 0) {
            isPc = false
            break
        }
    }
    if (isPc) {
        window.open(
            'https://chrome.google.com/webstore/detail/tanglepay-iota-wallet/hbneiaclpaaglopiogfdhgccebncnjmc?hl=en-US'
        )
    } else {
        console.error('Browser not supported')
    }
}

const iotaSDK = {
    isTanglePay: false,
    tanglePayVersion: '',
    request: async ({ method, isKeepPopup, params }) => {
        if (!iotaSDK.isTanglePay) {
            toInstall()
        }
        return new Promise((resolve, reject) => {
            window[`iota_request_${method}`] = function (res, code) {
                if (code === 200) {
                    // cache iota address
                    if (method === 'iota_connect') {
                        const address = res.address || ''
                        window.curTanglePayAddress = address
                    }
                    resolve(res)
                } else {
                    reject(res)
                }
            }
            sendToContentScript({
                cmd: 'iota_request',
                data: { method, params },
                isKeepPopup
            })
        })
    },
    on: (event, handler) => {
        window[`iota_event_${event}`] = (res) => {
            if (event === 'accountsChanged') {
                if (window.curTanglePayAddress !== res.address) {
                    handler &&
                        handler({
                            ...res
                        })
                }
                window.curTanglePayAddress = res.address || ''
            } else {
                handler && handler(res)
            }
        }
    }
}
window.addEventListener('load', () => {
    const env = window.TanglePayEnv
    switch (env) {
        case 'app':
        case 'chrome':
            {
                iotaSDK.isTanglePay = true
                // get info
                sendToContentScript({
                    cmd: 'getTanglePayInfo'
                })
            }
            break
        default:
            {
                window.dispatchEvent(new CustomEvent('iota-ready'))
                toInstall()
            }
            break
    }
})
window.iota = iotaSDK
export default iotaSDK
