import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser'
import nodePolyfills from 'rollup-plugin-polyfill-node';
import filesize from 'rollup-plugin-filesize'

/*
config[1].output[0] = Object.assign(config[1].output[0],{globals: {
    '@iota/util.js': 'IotaUtil',
    'big-integer':'bigInt'
  },})
config[1].external = [
    '@iota/util.js',
    'big-integer'
  ]
*/

export function decoratePlugin(configs,plug,isFront = false){
    configs.forEach((c)=>{
        if (isFront) {
            c.plugins.unshift(plug);
        } else {
            c.plugins.push(plug);
        }
    })
}
export function decorateIifeExternal(config,obj){
    config.output[0] = Object.assign(config.output[0],{globals: obj})
    config.external = Object.keys(obj)
}

export function createRollupConfig(pkg) {
    const moduleName = pkg.name;
    const moduleNameIife = pkg.moduleNameIife;
    const inputFileName = "src/index.ts";
    const author = pkg.author;
    const banner = `/**
                       * @license
                       * author: ${author}
                       * ${moduleName}.js v${pkg.version}
                       * Released under the ${pkg.license} license.
                       */
                    `;
    return [{
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
            typescript({"declaration": false,
                "declarationMap": false}),// parse typeScript
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
                nodePolyfills(),
                resolve(), // lookup and bundle third party packages
                terser(), // compress
                filesize(), // log size of output files to console
            ],
        }];

}
