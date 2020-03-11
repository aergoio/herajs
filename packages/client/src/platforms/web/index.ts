import 'regenerator-runtime/runtime';

import AergoClient from '../../client';
import GrpcWebProvider from '../../providers/grpc-web';
import constants from '../../constants';
import Contract from '../../models/contract';
import Address from '../../models/address';
import { Amount } from '@herajs/common';
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