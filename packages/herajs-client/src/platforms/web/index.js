import AergoClient from '../../client';
import { AergoRPCServiceClient as WebClient } from '../../../types/web/rpc_pb_service.js';

AergoClient.prototype.target = 'web';

AergoClient.prototype.initClient = (config) => {
    return new WebClient('http://' + config.url); 
};

export default AergoClient;
