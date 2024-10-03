import {createRollupConfig, decoratePlugin, decorateIifeExternal} from "../../rollup.config.mjs";
import pkg from './package.json' assert { type: "json" }
const config =  createRollupConfig(pkg)
import copy from 'rollup-plugin-copy'

decoratePlugin(config,copy({
    targets: [{
        src: '../../node_modules/@iota/client-wasm/web/wasm/client_wasm_bg.wasm', //
        dest: './',
        rename: 'client_wasm_bg.wasm'
    }]
}))
decorateIifeExternal(config,{
  '@iota/util.js': 'IotaUtil',
  'big-integer':'bigInt'
})
export default config
