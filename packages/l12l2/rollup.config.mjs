import {createRollupConfig, decoratePlugin} from "../../rollup.config.mjs";
import copy from 'rollup-plugin-copy'
import pkg from './package.json' assert { type: "json" }
const config =  createRollupConfig(pkg)
decoratePlugin(config,copy({
    targets: [{
        src: '../../node_modules/@iota/client-wasm/web/wasm/iota-client-wasm_bg.wasm', //
        dest: './',
        rename: 'iota-client-wasm_bg.wasm'
    }]
}))
console.log(config)
export default config
