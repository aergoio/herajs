import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
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

const external = [
    'crypto',
    'buffer',
    'util'
];

const nodeExternal = Object.keys(pkg.dependencies);

export default ['node', 'web'].map(target => ({
    input: './src/index.ts',
    
    external: target === 'node' ? external.concat(...nodeExternal) : external,
    
    plugins: [
        // Allows node_modules resolution
        resolve({ extensions }),
        
        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs({ namedExports }),

        json(),
        
        // Compile TypeScript/JavaScript files
        babel({ extensions, include: ['src/**/*'] }),
    ],
    
    output: target === 'node' ? [{
        file: pkg.main,
        format: 'cjs',
        external: nodeExternal,
    }, {
        file: pkg.module,
        format: 'es',
        external: nodeExternal,
    }] : [{
        file: pkg.browser,
        format: 'iife',
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
}));
