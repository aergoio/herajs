/*
Run this with
./node_modules/.bin/babel-node test/scripts/blocks-realtime.js
*/

import { AergoClient } from '../../src/platforms/node';
//import { AergoClient } from '../../src/platforms/web';


const aergo = new AergoClient();

aergo.getBlockHeaderStream().on('data', (blockHeader) => {
    const obj = blockHeader.toObject();
    console.log(obj.blockno, obj.timestamp);
});