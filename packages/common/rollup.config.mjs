import {createRollupConfig} from "../../rollup.config.mjs";
import pkg from './package.json' assert { type: "json" }
export default createRollupConfig(pkg)
