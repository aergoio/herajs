import * as typesNode from '../../types/rpc_pb.js';
import * as typesWeb from '../../types/web/rpc_pb.js';

const platformWeb = typeof process === 'undefined' || process.env.TARGET == 'web';
const rpcTypes = platformWeb ? typesWeb : typesNode;
export default rpcTypes;