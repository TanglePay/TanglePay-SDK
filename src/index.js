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
                {
                    const callBack = window[`${cmd}_${data.method}`]
                    callBack && callBack(data.response, code)
                }
                break
            case 'iota_event':
                {
                    const list = window.iota_events[`${cmd}_${data.method}`]
                    list.forEach((e) => {
                        e.handler && e.handler(data.response, code)
                    })
                }
                break
            default:
                break
        }
    },
    false
)

window.iota_events = {}
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
            'https://chrome.google.com/webstore/detail/tanglepay-iota-wallet/hbneiaclpaaglopiogfdhgccebncnjmc?hl=en-US',
            'TanglePay-Extension'
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
                        window.curTanglePayAddress = address + '_' + res.nodeId
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
    on: (event, callBack) => {
        const key = `iota_event_${event}`
        const handler = (res) => {
            if (event === 'accountsChanged') {
                const address = res.address + '_' + res.nodeId
                if (window.curTanglePayAddress !== address) {
                    callBack &&
                        callBack({
                            ...res
                        })
                }
                window.curTanglePayAddress = address || ''
            } else {
                callBack && callBack(res)
            }
        }
        const id = `${new Date().getTime()}${parseInt(Math.random() * 1000)}`
        window.iota_events[key] = window.iota_events[key] || []
        window.iota_events[key].push({
            id,
            handler,
            callBack
        })
    },
    removeListener(event, callBack) {
        const key = `iota_event_${event}`
        const list = window.iota_events[key] || []
        const index = list.find((e) => e.callBack === callBack)
        if (index >= 0) {
            list.splice(index, 1)
        }
    },
    removeAllListener(event) {
        const key = `iota_event_${event}`
        window.iota_events[key] = []
    }
}
let loadNum = 0
const onLoad = () => {
    const env = window.TanglePayEnv
    if (!env) {
        loadNum++
        if (loadNum <= 10) {
            setTimeout(onLoad, 300)
            return
        }
    }
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
}

window.addEventListener('load', onLoad)
window.iota = iotaSDK
export default iotaSDK
