import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import { builtinModules } from 'module';
import pkg from './package.json';
import visualizer from 'rollup-plugin-visualizer';

import { include as tsInclude } from './tsconfig.json';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

const name = 'LedgerHwAppAergo';

const namedExports = {
};

function genConfig(browser = false, output) {
    const external = browser ? [] : Object.keys(pkg.dependencies).concat(...builtinModules);

    return {
        input: './src/index.ts',
        
        external,
        
        plugins: [
            visualizer(),
            
            resolve({ extensions, preferBuiltins: true, }),

            commonjs({ namedExports }),

            json(),
            
            babel({ extensions, include: tsInclude }),

            globals(),
            builtins(),

            terser({
                include: [/^.+\.min\.js$/], 
            }),
        ],
        
        output,
    
        onwarn(warning, warn) {
            const ignoredCircular = ['elliptic', 'readable-stream', 'rimraf',];
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
        exports: 'named',
    }, {
        file: pkg.module,
        format: 'es',
    }]),
    /*
    // UMD build with bundled dependencies
    genConfig(true, [{
        file: pkg.browser,
        format: 'umd',
        name,
        exports: 'named',
    }, {
        file: pkg.browser.replace(/\.js$/, '.min.js'),
        format: 'umd',
        name,
        exports: 'named',
    }])*/
];
