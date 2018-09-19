/*
Run this with
./node_modules/.bin/babel-node test/perf/transactions_node.js
*/

import { AergoClient } from '../../src/platforms/node';
import { main } from './transactions_base.js';

main(new AergoClient());