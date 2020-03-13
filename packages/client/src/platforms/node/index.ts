import 'regenerator-runtime/runtime';

import AergoClient from '../../client';
import GrpcProvider from '../../providers/grpc';
import { Amount, Address, constants } from '@herajs/common';
import Contract from '../../models/contract';
import Tx from '../../models/tx';

AergoClient.platform = 'node';
AergoClient.defaultProviderClass = GrpcProvider;

export {
    AergoClient,
    GrpcProvider,
    constants,
    Contract,
    Address,
    Amount,
    Tx,
    AergoClient as default
};
