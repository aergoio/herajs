import 'regenerator-runtime/runtime';

import AergoClient from '../../client';
import GrpcWebProvider from '../../providers/grpc-web';
import constants from '../../constants';
import Contract from '../../models/contract';
import Address from '../../models/address';
import Amount from '../../models/amount';

AergoClient.prototype.target = 'web';

AergoClient.prototype.defaultProvider = () => {
    return new GrpcWebProvider(); 
};

export { AergoClient, GrpcWebProvider, constants, Address, Amount, Contract, AergoClient as default };
