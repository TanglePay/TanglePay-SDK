import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import pkg from "./package.json" assert { type: "json" };

const moduleName = pkg.name.replace(/^@.*\//, "");
const moduleNameIife = 'iota'; //moduleName.split('-').map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join('')

const inputFileName = "src/index.ts";
const author = pkg.author;
const banner = `
  /**
   * @license
   * author: ${author}
   * ${moduleName}.js v${pkg.version}
   * Released under the ${pkg.license} license.
   */
`;
export default [{
    input: inputFileName, // bundle entry point
    output: {
        file: pkg.module, // output destination
        format: "es",
        name: moduleName,
        sourcemap: "inline",
        banner
    },
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
        typescript(),// parse typeScript
        commonjs(), // transform commonjs to ES2015 module for rollup to proceed
        babel({
            exclude: '**/node_modules/**',
            babelHelpers: "bundled"
        }),
        resolve(), // lookup and bundle third party packages
        terser(), // compress
        filesize(), // log size of output files to console
    ],
},
    {
        input: inputFileName, // bundle entry point
        output: [{
            file: pkg.browser,
            format: "iife",
            name: moduleNameIife,
            banner,
            sourcemap: "inline",
            extend: true
        }],
        plugins: [
            typescript(), // parse typeScript
            commonjs(), // transform commonjs to ES2015 module for rollup to proceed
            babel({
                exclude: '**/node_modules/**',
                babelHelpers: "bundled"
            }),
            resolve(), // lookup and bundle third party packages
            terser(), // compress
            filesize(), // log size of output files to console
        ],
    }];
