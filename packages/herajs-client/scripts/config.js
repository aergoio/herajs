/* eslint-disable */
import { resolve as _resolve } from 'path';
import node_resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
//const typescript = require('rollup-plugin-typescript');
//const globals = require('rollup-plugin-node-globals');
const version = process.env.VERSION || require('../package.json').version;


const banner =
  '/*!\n' +
  ' * herajs v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' AERGO\n' +
  ' * Released under _resolvense.\n' +
  ' */';

const resolve = p => _resolve(__dirname, '../', p);

const external = [
    'grpc',
    'google-protobuf',
    'google-protobuf/google/protobuf/timestamp_pb.js',
    'grpc-web-client',
    'bs58check'
];

// Treating these as external as they are runtime requirements for node only
const webExternal = [
    'http',
    'https',
    'url'
]

const builds = {
    // CommonJS build (CommonJS)
    'node-cjs': {
        entry: resolve('src/platforms/node/index.js'),
        dest: resolve('dist/herajs.common.js'),
        format: 'cjs',
        banner,
        external
    },
    // CommonJS build (ES Modules)
    'node-esm': {
        entry: resolve('src/platforms/node/index.js'),
        dest: resolve('dist/herajs.esm.js'),
        format: 'es',
        banner,
        external
    },
    // Development build (Web, for browser or node)
    'web-dev': {
        entry: resolve('src/platforms/web/index.js'),
        dest: resolve('dist/herajs.js'),
        format: 'umd',
        env: 'development',
        banner,
        plugins: [
            node_resolve({
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
        entry: resolve('src/platforms/web/index.js'),
        dest: resolve('dist/herajs.min.js'),
        format: 'umd',
        env: 'production',
        banner,
        plugins: [
            node_resolve({
                jsnext: true,
                main: true,
                browser: true,
                preferBuiltins: false
            }),
            terser()
        ],
        context: 'window',
        external: webExternal
    },
};

function genConfig (name) {
    const opts = builds[name];

    const namedExports = {
        [resolve('types/rpc_pb.js')]: 'Empty, Personal, Account, SingleBytes, TxList, TxBody, Tx, CommitStatus'.split(', ')
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

            //typescript(),

            babel({
                babelrc: false,
                exclude: 'node_modules/**',
                plugins: ['external-helpers', 'transform-object-rest-spread'],
                presets: [
                    ["env", {
                        "modules": false
                    }]
                ]
            }),

            progress(),
        ].concat(opts.plugins || []),
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: 'herajs'
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