/* eslint-disable */
const path = require('path');
const node_resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const progress = require('rollup-plugin-progress');
const version = process.env.VERSION || require('../package.json').version;

const banner =
  '/*!\n' +
  ' * herajs v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' AERGO\n' +
  ' * Released under the MIT License.\n' +
  ' */';

const resolve = p => path.resolve(__dirname, '../', p);

const external = [
    'grpc',
    'google-protobuf',
    'google-protobuf/google/protobuf/timestamp_pb.js',
    'base-58',
];

const builds = {
    // Runtime+compiler CommonJS build (CommonJS)
    'web-full-cjs': {
        entry: resolve('src/index.js'),
        dest: resolve('dist/herajs.common.js'),
        format: 'cjs',
        banner,
        external
    },
    // Runtime+compiler CommonJS build (ES Modules)
    'web-full-esm': {
        entry: resolve('src/index.js'),
        dest: resolve('dist/herajs.esm.js'),
        format: 'es',
        banner,
        external
    },
    /*
    // Runtime+compiler development build (Browser)
    'web-full-dev': {
        entry: resolve('src/index.js'),
        dest: resolve('dist/herajs.js'),
        format: 'umd',
        env: 'development',
        banner
    },
    // Runtime+compiler production build  (Browser)
    'web-full-prod': {
        entry: resolve('src/index.js'),
        dest: resolve('dist/herajs.min.js'),
        format: 'umd',
        env: 'production',
        banner
    },
    */
};

function genConfig (name) {
    const opts = builds[name];

    const namedExports = {
        [resolve('types/rpc_pb.js')]: 'Empty, Personal, Account, SingleBytes, TxList, TxBody, Tx, CommitStatus'.split(', ')
    };

    const config = {
        input: opts.entry,
        external: opts.external,
        plugins: [

            commonjs({
                include: [ 'types/**'  ], // "node_modules/**", 
                namedExports
            }),

            /*node_resolve({
        jsnext: true,
        preferBuiltins: false
      }),*/

            json(),

            //globals(),
            //builtins(),

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
        }
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