import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import json from 'rollup-plugin-json';

import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

const name = 'HerajsWallet';

const namedExports = {
    'node_modules/elliptic/lib/elliptic.js': 'ec'.split(', '),
    '../herajs/dist/herajs.js': 'AergoClient, Amount, Address'.split(', '),
    '../herajs-crypto/dist/herajs-crypto.iife.js': [
        'encodeAddress',
        'decodeAddress',
        'encodePrivateKey',
        'decodePrivateKey',
        'createIdentity',
        'identifyFromPrivateKey',
        'addressFromPublicKey',
        'publicKeyFromAddress',
        'decryptPrivateKey',
        'encryptPrivateKey',
        'signMessage',
        'signTransaction',
        'verifySignature',
        'verifyTxSignature',
        'hashTransaction'
    ]
};

const nodeExternal = [
    'crypto',
    'buffer',
    'util'
];

const external = Object.keys(pkg.dependencies).concat(...nodeExternal);

export default ['node', 'web'].map(target => ({
    input: './src/index.ts',
    
    external: external,
    
    plugins: [
        commonjs({ namedExports }),

        resolve({
            extensions,
            browser: target === 'web'
        }),

        json(),

        babel({ extensions, include: ['src/**/*'] }),

        globals(),
        builtins(),
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
}));
