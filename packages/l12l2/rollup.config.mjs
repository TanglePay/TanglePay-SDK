import {createRollupConfig, decoratePlugin} from "../../rollup.config.mjs";
import copy from 'rollup-plugin-copy'
import pkg from './package.json' assert { type: "json" }
const config =  createRollupConfig(pkg)
decoratePlugin(config,copy({
    targets: [{
        src: '../../node_modules/@iota/client-wasm/web/wasm/client_wasm_bg.wasm', //
        dest: './',
        rename: 'client_wasm_bg.wasm'
    }]
}))
config[1].output = Object.assign(config[1].output,{globals: {
    '@iota/util.js': 'IotaUtil',
  },})
config[1].external = [
    '@iota/util.js'
  ]
console.log(config[1])
export default config
