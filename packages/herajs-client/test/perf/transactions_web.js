/*
Run this with
./node_modules/.bin/babel-node test/perf/transactions_web.js
*/

import AergoWebClient from '../../src/platforms/web';
import { main } from './transactions_base.js';

main(new AergoWebClient());