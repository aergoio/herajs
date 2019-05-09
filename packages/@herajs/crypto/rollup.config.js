import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import pkg from './package.json';

import { resolve as _resolve } from 'path';

const resolvePath = p => _resolve(__dirname, p);

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

const name = 'HerajsCrypto';

const namedExports = {
    [resolvePath('node_modules/elliptic/lib/elliptic.js')]: 'ec'.split(', '),
};

const builtinExternal = [
    'crypto'
];

const external = Object.keys(pkg.dependencies).concat(...builtinExternal);

export default {
    input: './src/index.ts',
    
    external,
    
    plugins: [
        resolve({ extensions }),
        
        commonjs({ namedExports }),

        json(),
        
        babel({ extensions, include: ['src/**/*'] }),

        builtins(),
        globals(),
    ],
    
    output: [{
        file: pkg.main,
        format: 'cjs',
    }, {
        file: pkg.module,
        format: 'es',
    }, {
        file: pkg.browser,
        format: 'umd',
        name,
        globals: external.reduce((prev, cur) => {
            prev[cur] = cur; return prev;
        }, {}),
    }],

    onwarn(warning, warn) {
        const ignoredCircular = [
            'elliptic'
        ];
        if (
            warning.code === 'CIRCULAR_DEPENDENCY' &&
            ignoredCircular.some(d => warning.importer.includes(d))
        ) {
            return;
        }
        warn(warning.message);
    },
};
