import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
import ignore from 'rollup-plugin-ignore';
import { terser } from 'rollup-plugin-terser';
//import visualizer from 'rollup-plugin-visualizer';
import { builtinModules } from 'module';
import pkg from './package.json';

import { resolve as _resolve } from 'path';

const resolvePath = p => _resolve(__dirname, p);

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

const name = 'HerajsCrypto';

const namedExports = {
    [resolvePath('../../node_modules/elliptic/lib/elliptic.js')]: 'ec, rand'.split(', '),
};

// Ignore bip39 wordlists except english
const ignored = [
    '\0./wordlists/chinese_simplified.json?commonjs-proxy',
    '\0./wordlists/chinese_traditional.json?commonjs-proxy',
    '\0./wordlists/korean.json?commonjs-proxy',
    '\0./wordlists/french.json?commonjs-proxy',
    '\0./wordlists/italian.json?commonjs-proxy',
    '\0./wordlists/spanish.json?commonjs-proxy',
    '\0./wordlists/japanese.json?commonjs-proxy',
];

function genConfig(browser = false, output) {
    const external = browser ? [] : Object.keys(pkg.dependencies).concat(...builtinModules);

    return {
        input: './src/index.ts',
        
        external,
        
        plugins: [
            //visualizer(),
            
            browser
                ? resolve({ extensions, preferBuiltins: true, browser: true })
                : resolve({ extensions, preferBuiltins: true }),

            browser ? ignore(ignored) : undefined,

            commonjs({ namedExports, ignore: ['crypto'] }),

            json(),
            
            babel({ extensions, include: ['src/**/*'] }),

            globals(),
            builtins(),

            terser({
                include: [/^.+\.min\.js$/], 
            }),
        ],
        
        output,
    
        onwarn(warning, warn) {
            const ignoredCircular = [
                'elliptic', 'readable-stream',
            ];
            if (
                warning.code === 'CIRCULAR_DEPENDENCY' &&
                ignoredCircular.some(d => warning.importer.includes(d))
            ) {
                return;
            }
            warn(warning);
        },
    };
}

export default [
    // CJS and ES builds with external dependencies
    genConfig(false, [{
        file: pkg.main,
        format: 'cjs',
    }, {
        file: pkg.module,
        format: 'es',
    }]),
    // UMD build with bundled dependencies
    genConfig(true, [{
        file: pkg.browser,
        format: 'umd',
        name,
    }, {
        file: pkg.browser.replace(/\.js$/, '.min.js'),
        format: 'umd',
        name,
    }])
];
