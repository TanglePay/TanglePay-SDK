/**
                       * @license
                       * author: TanglePay
                       * ethereum.js v0.1.10
                       * Released under the Apache-2.0 license.
                       */
var ethereum=function(e,t){"use strict";var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},n(e,t)};var r=function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},r.apply(this,arguments)};function i(e,t,n,r){return new(n||(n=Promise))((function(i,o){function s(e){try{a(r.next(e))}catch(e){o(e)}}function u(e){try{a(r.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,u)}a((r=r.apply(e,t||[])).next())}))}function o(e,t){var n,r,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(u){return function(a){return function(u){if(n)throw new TypeError("Generator is already executing.");for(;o&&(o=0,u[0]&&(s=0)),s;)try{if(n=1,r&&(i=2&u[0]?r.return:u[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,u[1])).done)return i;switch(r=0,i&&(u=[2&u[0],i.value]),u[0]){case 0:case 1:i=u;break;case 4:return s.label++,{value:u[1],done:!1};case 5:s.label++,r=u[1],u=[0];continue;case 7:u=s.ops.pop(),s.trys.pop();continue;default:if(!(i=s.trys,(i=i.length>0&&i[i.length-1])||6!==u[0]&&2!==u[0])){s=0;continue}if(3===u[0]&&(!i||u[1]>i[0]&&u[1]<i[3])){s.label=u[1];break}if(6===u[0]&&s.label<i[1]){s.label=i[1],i=u;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(u);break}i[2]&&s.ops.pop(),s.trys.pop();continue}u=t.call(e,s)}catch(e){u=[6,e],r=0}finally{n=i=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,a])}}}function s(){}function u(){u.init.call(this)}function a(e){return void 0===e._maxListeners?u.defaultMaxListeners:e._maxListeners}function c(e,t,n,r){var i,o,u,c;if("function"!=typeof n)throw new TypeError('"listener" argument must be a function');if((o=e._events)?(o.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),o=e._events),u=o[t]):(o=e._events=new s,e._eventsCount=0),u){if("function"==typeof u?u=o[t]=r?[n,u]:[u,n]:r?u.unshift(n):u.push(n),!u.warned&&(i=a(e))&&i>0&&u.length>i){u.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+u.length+" "+t+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=e,l.type=t,l.count=u.length,c=l,"function"==typeof console.warn?console.warn(c):console.log(c)}}else u=o[t]=n,++e._eventsCount;return e}function l(e,t,n){var r=!1;function i(){e.removeListener(t,i),r||(r=!0,n.apply(e,arguments))}return i.listener=n,i}function f(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function h(e,t){for(var n=new Array(t);t--;)n[t]=e[t];return n}s.prototype=Object.create(null),u.EventEmitter=u,u.usingDomains=!1,u.prototype.domain=void 0,u.prototype._events=void 0,u.prototype._maxListeners=void 0,u.defaultMaxListeners=10,u.init=function(){this.domain=null,u.usingDomains&&undefined.active,this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=new s,this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},u.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=e,this},u.prototype.getMaxListeners=function(){return a(this)},u.prototype.emit=function(e){var t,n,r,i,o,s,u,a="error"===e;if(s=this._events)a=a&&null==s.error;else if(!a)return!1;if(u=this.domain,a){if(t=arguments[1],!u){if(t instanceof Error)throw t;var c=new Error('Uncaught, unspecified "error" event. ('+t+")");throw c.context=t,c}return t||(t=new Error('Uncaught, unspecified "error" event')),t.domainEmitter=this,t.domain=u,t.domainThrown=!1,u.emit("error",t),!1}if(!(n=s[e]))return!1;var l="function"==typeof n;switch(r=arguments.length){case 1:!function(e,t,n){if(t)e.call(n);else for(var r=e.length,i=h(e,r),o=0;o<r;++o)i[o].call(n)}(n,l,this);break;case 2:!function(e,t,n,r){if(t)e.call(n,r);else for(var i=e.length,o=h(e,i),s=0;s<i;++s)o[s].call(n,r)}(n,l,this,arguments[1]);break;case 3:!function(e,t,n,r,i){if(t)e.call(n,r,i);else for(var o=e.length,s=h(e,o),u=0;u<o;++u)s[u].call(n,r,i)}(n,l,this,arguments[1],arguments[2]);break;case 4:!function(e,t,n,r,i,o){if(t)e.call(n,r,i,o);else for(var s=e.length,u=h(e,s),a=0;a<s;++a)u[a].call(n,r,i,o)}(n,l,this,arguments[1],arguments[2],arguments[3]);break;default:for(i=new Array(r-1),o=1;o<r;o++)i[o-1]=arguments[o];!function(e,t,n,r){if(t)e.apply(n,r);else for(var i=e.length,o=h(e,i),s=0;s<i;++s)o[s].apply(n,r)}(n,l,this,i)}return!0},u.prototype.addListener=function(e,t){return c(this,e,t,!1)},u.prototype.on=u.prototype.addListener,u.prototype.prependListener=function(e,t){return c(this,e,t,!0)},u.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.on(e,l(this,e,t)),this},u.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.prependListener(e,l(this,e,t)),this},u.prototype.removeListener=function(e,t){var n,r,i,o,u;if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');if(!(r=this._events))return this;if(!(n=r[e]))return this;if(n===t||n.listener&&n.listener===t)0==--this._eventsCount?this._events=new s:(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,o=n.length;o-- >0;)if(n[o]===t||n[o].listener&&n[o].listener===t){u=n[o].listener,i=o;break}if(i<0)return this;if(1===n.length){if(n[0]=void 0,0==--this._eventsCount)return this._events=new s,this;delete r[e]}else!function(e,t){for(var n=t,r=n+1,i=e.length;r<i;n+=1,r+=1)e[n]=e[r];e.pop()}(n,i);r.removeListener&&this.emit("removeListener",e,u||t)}return this},u.prototype.off=function(e,t){return this.removeListener(e,t)},u.prototype.removeAllListeners=function(e){var t,n;if(!(n=this._events))return this;if(!n.removeListener)return 0===arguments.length?(this._events=new s,this._eventsCount=0):n[e]&&(0==--this._eventsCount?this._events=new s:delete n[e]),this;if(0===arguments.length){for(var r,i=Object.keys(n),o=0;o<i.length;++o)"removeListener"!==(r=i[o])&&this.removeAllListeners(r);return this.removeAllListeners("removeListener"),this._events=new s,this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(t)do{this.removeListener(e,t[t.length-1])}while(t[0]);return this},u.prototype.listeners=function(e){var t,n=this._events;return n&&(t=n[e])?"function"==typeof t?[t.listener||t]:function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(t):[]},u.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):f.call(e,t)},u.prototype.listenerCount=f,u.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]};var p=new(function(s){function u(){var n=s.call(this)||this;n._version=101,n._seq=1;var u=function(e){return function(t,r){return i(n,void 0,void 0,(function(){var n;return o(this,(function(i){switch(i.label){case 0:return console.log("req:"+e,t),[4,r(t)];case 1:return n=i.sent(),console.log("resp:"+e,n),[2,n]}}))}))}};n._rpcEngine=t.JsonRpcEngine.builder().add((function(t,r){return i(n,void 0,void 0,(function(){var n;return o(this,(function(i){switch(i.label){case 0:if(null!=this._selectedAddress)return[3,4];i.label=1;case 1:return i.trys.push([1,3,,4]),[4,e.request({method:"iota_connect",params:{}})];case 2:if(!(n=i.sent())||!n.address)throw new Error("not connected");return this._selectedAddress=n.address,[3,4];case 3:throw i.sent();case 4:return[4,r(t)];case 5:return[2,i.sent()]}}))}))})).add(u("1")).add((function(e,t){return i(n,void 0,void 0,(function(){return o(this,(function(n){return e.id=this._seq++,e.version=this._version,[2,t(e)]}))}))})).add((function(e,t){return i(n,void 0,void 0,(function(){var n,i,s,u,a,c,l,f,h,p,d,v;return o(this,(function(o){switch(o.label){case 0:return n={eth_requestAccounts:"iota_accounts",eth_connect:"iota_connect"},i={eth_sign:function(e){return e.reverse()},personal_sign:function(e){return{content:e}},eth_sendTransaction:function(e){var t=e[0];return t.value=parseInt(t.value),t},eth_getBalance:function(){return{assetsList:["evm"],addressList:[]}}},s=function(e){return e},u=e.method,(a=r({},e)).method=null!==(p=n[u])&&void 0!==p?p:u,c=null!==(d=i[u])&&void 0!==d?d:s,a.params=c(a.params),[4,t(a)];case 1:return l=o.sent(),f=null!==(v={eth_connect:function(e){return[e.address]},eth_getBalance:function(e){return e.amount}}[u])&&void 0!==v?v:s,(h=r({},l)).data=f(l.data),[2,h]}}))}))})).add(u("2")).add((function(t){return i(n,void 0,void 0,(function(){var n,r,i,s;return o(this,(function(o){switch(o.label){case 0:return n=t.method,r=t.params,i=t.id,[4,e.request({method:n,params:r})];case 1:return s=o.sent(),[2,{id:i,version:100,data:s}]}}))}))})).build();for(var a={connect:n._handleConnect,disconnect:n._handleDisconnect,message:n._handleMessage,chainChanged:n._handleChainChanged,accountsChanged:n._handleAccountsChanged},c=0,l=Object.entries(a);c<l.length;c++){var f=l[c],h=f[0],p=f[1];e.on(h,p.bind(n))}return n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}(u,s),Object.defineProperty(u.prototype,"isTanglePay",{get:function(){return!0},enumerable:!1,configurable:!0}),Object.defineProperty(u.prototype,"selectedAddress",{get:function(){return this._selectedAddress},enumerable:!1,configurable:!0}),u.prototype._handleConnect=function(e){this.emit("connect",e)},u.prototype._handleDisconnect=function(e){this.emit("disconnect",e)},u.prototype._handleMessage=function(e){this.emit("message",e)},u.prototype._handleChainChanged=function(e){this.emit("chainChanged",e)},u.prototype._handleAccountsChanged=function(e){this.emit("accountsChanged",e)},u.prototype.request=function(e){return i(this,void 0,void 0,(function(){var t;return o(this,(function(n){switch(n.label){case 0:return[4,this._rpcEngine.request(e)];case 1:if((t=n.sent()).error)throw t.error;return[2,t.data]}}))}))},u}(u));return window.ethereum=p,p}(iota,tanglepaysdkCommon);
//# sourceMappingURL=index.js.map
