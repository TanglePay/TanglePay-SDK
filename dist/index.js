!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.iotaSdk=e():t.iotaSdk=e()}(this,(()=>(()=>{var t={264:(t,e,r)=>{t.exports=r(588)},588:(t,e,r)=>{function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}var o=function(t){"use strict";var e,r=Object.prototype,o=r.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof g?e:g,i=Object.create(o.prototype),a=new T(n||[]);return i._invoke=function(t,e,r){var n=d;return function(o,i){if(n===p)throw new Error("Generator is already running");if(n===y){if("throw"===o)throw i;return N()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=L(a,r);if(c){if(c===v)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===d)throw n=y,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=p;var u=f(t,e,r);if("normal"===u.type){if(n=r.done?y:h,u.arg===v)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n=y,r.method="throw",r.arg=u.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var d="suspendedStart",h="suspendedYield",p="executing",y="completed",v={};function g(){}function w(){}function m(){}var b={};s(b,a,(function(){return this}));var P=Object.getPrototypeOf,x=P&&P(P(k([])));x&&x!==r&&o.call(x,a)&&(b=x);var O=m.prototype=g.prototype=Object.create(b);function j(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function r(i,a,c,u){var s=f(t[i],t,a);if("throw"!==s.type){var l=s.arg,d=l.value;return d&&"object"===n(d)&&o.call(d,"__await")?e.resolve(d.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(d).then((function(t){l.value=t,c(l)}),(function(t){return r("throw",t,c,u)}))}u(s.arg)}var i;this._invoke=function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}}function L(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,L(t,r),"throw"===r.method))return v;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return v}var o=f(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,v;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,v):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,v)}function _(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function S(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(_,this),this.reset(!0)}function k(t){if(t){var r=t[a];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,i=function r(){for(;++n<t.length;)if(o.call(t,n))return r.value=t[n],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}return{next:N}}function N(){return{value:e,done:!0}}return w.prototype=m,s(O,"constructor",m),s(m,"constructor",w),w.displayName=s(m,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,s(t,u,"GeneratorFunction")),t.prototype=Object.create(O),t},t.awrap=function(t){return{__await:t}},j(E.prototype),s(E.prototype,c,(function(){return this})),t.AsyncIterator=E,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new E(l(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},j(O),s(O,u,"Generator"),s(O,a,(function(){return this})),s(O,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=k,T.prototype={constructor:T,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(S),!t)for(var r in this)"t"===r.charAt(0)&&o.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var u=o.call(a,"catchLoc"),s=o.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,v):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),v},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),S(r),v}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;S(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:k(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),v}},t}("object"===n(t=r.nmd(t))?t.exports:{});try{regeneratorRuntime=o}catch(t){"object"===("undefined"==typeof globalThis?"undefined":n(globalThis))?globalThis.regeneratorRuntime=o:Function("r","regeneratorRuntime = r")(o)}}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var i=e[n]={id:n,loaded:!1,exports:{}};return t[n](i,i.exports,r),i.loaded=!0,i.exports}r.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return r.d(e,{a:e}),e},r.d=(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.nmd=t=>(t.paths=[],t.children||(t.children=[]),t);var n={};return(()=>{"use strict";r.r(n),r.d(n,{default:()=>h});var t=r(264),e=r.n(t);function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function a(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}var c=function(t){t.cmd="injectToContent##".concat(t.cmd),t.origin=window.location.origin,"app"===window.TanglePayEnv?window.ReactNativeWebView.postMessage(JSON.stringify(t)):window.postMessage(t,"*")};window.addEventListener("message",(function(t){var e,r,n,o=((null==t||null===(e=t.data)||void 0===e?void 0:e.cmd)||"").replace("contentToInject##",""),i=null==t||null===(r=t.data)||void 0===r?void 0:r.data,a=null==t||null===(n=t.data)||void 0===n?void 0:n.code;switch(o){case"getTanglePayInfo":f.tanglePayVersion=null==i?void 0:i.version,window.dispatchEvent(new CustomEvent("iota-ready"));break;case"iota_request":case"iota_event":var c=window["".concat(o,"_").concat(i.method)];c&&c(i.response,a)}}),!1);var u,s,l=function(){for(var t=new Array("Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"),e=navigator.userAgent,r=!0,n=0;n<t.length;n++)if(e.indexOf(t[n])>0){r=!1;break}r?window.open("https://chrome.google.com/webstore/detail/tanglepay-iota-wallet/hbneiaclpaaglopiogfdhgccebncnjmc?hl=en-US","TanglePay-Extension"):console.error("Browser not supported")},f={isTanglePay:!1,tanglePayVersion:"",request:(u=e().mark((function t(r){var n,o,i;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=r.method,o=r.isKeepPopup,i=r.params,f.isTanglePay||l(),t.abrupt("return",new Promise((function(t,e){window["iota_request_".concat(n)]=function(r,o){if(200===o){if("iota_connect"===n){var i=r.address||"";window.curTanglePayAddress=i+"_"+r.nodeId}t(r)}else e(r)},c({cmd:"iota_request",data:{method:n,params:i},isKeepPopup:o})})));case 3:case"end":return t.stop()}}),t)})),s=function(){var t=this,e=arguments;return new Promise((function(r,n){var o=u.apply(t,e);function i(t){a(o,r,n,i,c,"next",t)}function c(t){a(o,r,n,i,c,"throw",t)}i(void 0)}))},function(t){return s.apply(this,arguments)}),on:function(t,e){window["iota_event_".concat(t)]=function(r){if("accountsChanged"===t){var n=r.address+"_"+r.nodeId;window.curTanglePayAddress!==n&&e&&e(function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(Object(r),!0).forEach((function(e){i(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},r)),window.curTanglePayAddress=n||""}else e&&e(r)}}},d=0;window.addEventListener("load",(function t(){var e=window.TanglePayEnv;if(!e&&++d<=10)setTimeout(t,300);else switch(e){case"app":case"chrome":f.isTanglePay=!0,c({cmd:"getTanglePayInfo"});break;default:window.dispatchEvent(new CustomEvent("iota-ready")),l()}})),window.iota=f;const h=f})(),n})()));