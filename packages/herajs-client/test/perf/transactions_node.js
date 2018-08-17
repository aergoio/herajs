/*
Run this with
./node_modules/.bin/babel-node test/perf/transactions_node.js
*/

import AergoNodeClient from '../../src/platforms/node';
import { main } from './transactions_base.js';

main(new AergoNodeClient());