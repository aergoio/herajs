/*
 * The default export when importing 'src' is the Node.js target.
 * To import the Web target, either use a build or import 'src/platforms/web'
*/

export { AergoClient as default } from './platforms/node';
