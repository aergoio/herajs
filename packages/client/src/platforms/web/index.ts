import 'regenerator-runtime/runtime';

import AergoClient from '../../client';
import GrpcWebProvider from '../../providers/grpc-web';
import { Amount, Address, constants } from '@herajs/common';
import Contract from '../../models/contract';
import Tx from '../../models/tx';

AergoClient.platform = 'web';
AergoClient.defaultProviderClass = GrpcWebProvider;

export {
    AergoClient,
    GrpcWebProvider,
    constants,
    Contract,
    Address,
    Amount,
    Tx,
    AergoClient as default
};