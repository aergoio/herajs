import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import json from 'rollup-plugin-json';
import { resolve as _resolve } from 'path';

const resolvePath = p => _resolve(__dirname, p);

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

const name = 'HerajsWallet';

const namedExports = {
    '../herajs-crypto/node_modules/elliptic/lib/elliptic.js': 'ec'.split(', '),
};

export default {
    input: './src/index.ts',
    
    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: [],
    
    plugins: [
        // Allows node_modules resolution
        resolve({ extensions }),
        
        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs({ namedExports }),

        json(),
        
        // Compile TypeScript/JavaScript files
        babel({ extensions, include: ['src/**/*'] }),
    ],
    
    output: [{
        file: pkg.main,
        format: 'cjs',
    }, {
        file: pkg.module,
        format: 'es',
    }, {
        file: pkg.browser,
        format: 'iife',
        name,
        
        // https://rollupjs.org/guide/en#output-globals-g-globals
        globals: {},
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
