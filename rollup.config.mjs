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
const inputIifeFileName = "src/index-iife.ts";
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
    input: inputFileName, // 打包入口
    output: {
        // 打包出口
        file: pkg.module,
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
        typescript(),// 解析TypeScript
        commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
        babel({
            exclude: '**/node_modules/**',
            babelHelpers: "bundled"
        }),
        resolve(), // 查找和打包node_modules中的第三方模块
        terser(),
        filesize(),
    ],
},
    {
        input: inputFileName, // 打包入口
        output: [{
            // 打包出口
            file: pkg.browser,
            format: "iife",
            name: moduleNameIife,
            banner,
            sourcemap: "inline",
            extend: true
        }],
        plugins: [
            typescript(),// 解析TypeScript
            commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
            babel({
                exclude: '**/node_modules/**',
                babelHelpers: "bundled"
            }),
            resolve(), // 查找和打包node_modules中的第三方模块
            terser(),
            filesize(),
        ],
    }];
