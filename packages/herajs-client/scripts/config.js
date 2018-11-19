/* eslint-disable */
import { resolve as _resolve } from 'path';
import node_resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';

const globals = require('rollup-plugin-node-globals');
//import typescript from 'rollup-plugin-typescript2';

//import { plugin as analyze } from 'rollup-plugin-analyzer'

const version = process.env.VERSION || require('../package.json').version;


const banner =
  '/*!\n' +
  ' * herajs v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' AERGO\n' +
  ' * Released under MIT license.\n' +
  ' */';

const resolve = p => _resolve(__dirname, '../', p);

const external = [
    'grpc',
    'google-protobuf',
    'grpc-web-client',
    'bs58check',
    'bs58'
];

// Treating these as external as they are runtime requirements for node only
// Packages from `external` are inlined for the web distribution
const webExternal = [
    'http',
    'https',
    'url'
]

const builds = {
    // CommonJS build (CommonJS)
    'node-cjs': {
        entry: resolve('src/platforms/node/index.ts'),
        dest: resolve('dist/herajs.common.js'),
        format: 'cjs',
        banner,
        plugins: [
            node_resolve({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
            }),
            //analyze()
        ],
        external
    },
    // CommonJS build (ES Modules)
    'node-esm': {
        entry: resolve('src/platforms/node/index.ts'),
        dest: resolve('dist/herajs.esm.js'),
        format: 'es',
        banner,
        plugins: [
            node_resolve({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
            }),
        ],
        external
    },
    // Development build (Web, for browser or node)
    'web-dev': {
        entry: resolve('src/platforms/web/index.ts'),
        dest: resolve('dist/herajs.js'),
        format: 'umd',
        env: 'development',
        banner,
        plugins: [
            node_resolve({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
                jsnext: true,
                main: true,
                browser: true,
                preferBuiltins: false
            }),
            
        ],
        context: 'window',
        external: webExternal
    },
    // Production build (Web, for browser or node)
    'web-prod': {
        entry: resolve('src/platforms/web/index.ts'),
        dest: resolve('dist/herajs.min.js'),
        format: 'umd',
        env: 'production',
        banner,
        plugins: [
            node_resolve({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
                jsnext: true,
                main: true,
                browser: true,
                preferBuiltins: false
            }),
            terser(),
            //analyze()
        ],
        context: 'window',
        external: webExternal
    },
};

function genConfig (name) {
    const opts = builds[name];

    const namedExports = {
        [resolve('types/rpc_pb.js')]: 'Empty, Personal, SingleBytes, TxList, TxBody, Tx, CommitStatus, ListParams, Query'.split(', '),
        [resolve('types/blockchain_pb.js')]: 'TxList, TxBody, Tx, Block'.split(', '),
        [resolve('types/account_pb.js')]: 'Account'.split(', ')
    };

    const config = {
        input: opts.entry,
        external: opts.external || [],
        plugins: [

            commonjs({
                include: [ 'node_modules/**', 'types/**'  ],
                namedExports
            }),

            json(),

            builtins(),

            /*typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module: 'ES2015',
                        target: 'ESNext',
                    }
                }
            }),*/

            babel({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
                babelrc: false,
                exclude: 'node_modules/**',
                runtimeHelpers: true,
                plugins: [
                    '@babel/plugin-proposal-object-rest-spread',
                    '@babel/proposal-class-properties'
                ],
                presets: [
                    ["@babel/preset-env", {
                        "modules": false
                    }],
                    "@babel/typescript"
                ]
            }),

            globals(),

            progress(),
        ].concat(opts.plugins || []),
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: 'herajs',
            exports: 'named'
        },
        context: opts.context || 'undefined'
    };

    Object.defineProperty(config, '_name', {
        enumerable: false,
        value: name
    });

    return config;
}

if (process.env.TARGET) {
    module.exports = genConfig(process.env.TARGET);
} else {
    exports.getBuild = genConfig;
    exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}