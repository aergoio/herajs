// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var rpc_pb = require('./rpc_pb.js');
var blockchain_pb = require('./blockchain_pb.js');
var account_pb = require('./account_pb.js');
var node_pb = require('./node_pb.js');
var p2p_pb = require('./p2p_pb.js');
var metric_pb = require('./metric_pb.js');

function serialize_types_ABI(arg) {
  if (!(arg instanceof blockchain_pb.ABI)) {
    throw new Error('Expected argument of type types.ABI');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_ABI(buffer_arg) {
  return blockchain_pb.ABI.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_Account(arg) {
  if (!(arg instanceof account_pb.Account)) {
    throw new Error('Expected argument of type types.Account');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Account(buffer_arg) {
  return account_pb.Account.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_AccountAndRoot(arg) {
  if (!(arg instanceof rpc_pb.AccountAndRoot)) {
    throw new Error('Expected argument of type types.AccountAndRoot');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_AccountAndRoot(buffer_arg) {
  return rpc_pb.AccountAndRoot.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_AccountList(arg) {
  if (!(arg instanceof account_pb.AccountList)) {
    throw new Error('Expected argument of type types.AccountList');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_AccountList(buffer_arg) {
  return account_pb.AccountList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_Block(arg) {
  if (!(arg instanceof blockchain_pb.Block)) {
    throw new Error('Expected argument of type types.Block');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Block(buffer_arg) {
  return blockchain_pb.Block.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_BlockHeaderList(arg) {
  if (!(arg instanceof rpc_pb.BlockHeaderList)) {
    throw new Error('Expected argument of type types.BlockHeaderList');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_BlockHeaderList(buffer_arg) {
  return rpc_pb.BlockHeaderList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_BlockchainStatus(arg) {
  if (!(arg instanceof rpc_pb.BlockchainStatus)) {
    throw new Error('Expected argument of type types.BlockchainStatus');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_BlockchainStatus(buffer_arg) {
  return rpc_pb.BlockchainStatus.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_CommitResult(arg) {
  if (!(arg instanceof rpc_pb.CommitResult)) {
    throw new Error('Expected argument of type types.CommitResult');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_CommitResult(buffer_arg) {
  return rpc_pb.CommitResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_CommitResultList(arg) {
  if (!(arg instanceof rpc_pb.CommitResultList)) {
    throw new Error('Expected argument of type types.CommitResultList');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_CommitResultList(buffer_arg) {
  return rpc_pb.CommitResultList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_Empty(arg) {
  if (!(arg instanceof rpc_pb.Empty)) {
    throw new Error('Expected argument of type types.Empty');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Empty(buffer_arg) {
  return rpc_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_ImportFormat(arg) {
  if (!(arg instanceof rpc_pb.ImportFormat)) {
    throw new Error('Expected argument of type types.ImportFormat');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_ImportFormat(buffer_arg) {
  return rpc_pb.ImportFormat.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_ListParams(arg) {
  if (!(arg instanceof rpc_pb.ListParams)) {
    throw new Error('Expected argument of type types.ListParams');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_ListParams(buffer_arg) {
  return rpc_pb.ListParams.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_Metrics(arg) {
  if (!(arg instanceof metric_pb.Metrics)) {
    throw new Error('Expected argument of type types.Metrics');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Metrics(buffer_arg) {
  return metric_pb.Metrics.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_MetricsRequest(arg) {
  if (!(arg instanceof metric_pb.MetricsRequest)) {
    throw new Error('Expected argument of type types.MetricsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_MetricsRequest(buffer_arg) {
  return metric_pb.MetricsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_PeerList(arg) {
  if (!(arg instanceof rpc_pb.PeerList)) {
    throw new Error('Expected argument of type types.PeerList');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_PeerList(buffer_arg) {
  return rpc_pb.PeerList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_Personal(arg) {
  if (!(arg instanceof rpc_pb.Personal)) {
    throw new Error('Expected argument of type types.Personal');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Personal(buffer_arg) {
  return rpc_pb.Personal.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_Query(arg) {
  if (!(arg instanceof blockchain_pb.Query)) {
    throw new Error('Expected argument of type types.Query');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Query(buffer_arg) {
  return blockchain_pb.Query.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_Receipt(arg) {
  if (!(arg instanceof blockchain_pb.Receipt)) {
    throw new Error('Expected argument of type types.Receipt');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Receipt(buffer_arg) {
  return blockchain_pb.Receipt.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_SingleBytes(arg) {
  if (!(arg instanceof rpc_pb.SingleBytes)) {
    throw new Error('Expected argument of type types.SingleBytes');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_SingleBytes(buffer_arg) {
  return rpc_pb.SingleBytes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_Staking(arg) {
  if (!(arg instanceof rpc_pb.Staking)) {
    throw new Error('Expected argument of type types.Staking');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Staking(buffer_arg) {
  return rpc_pb.Staking.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_State(arg) {
  if (!(arg instanceof blockchain_pb.State)) {
    throw new Error('Expected argument of type types.State');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_State(buffer_arg) {
  return blockchain_pb.State.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_StateProof(arg) {
  if (!(arg instanceof blockchain_pb.StateProof)) {
    throw new Error('Expected argument of type types.StateProof');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_StateProof(buffer_arg) {
  return blockchain_pb.StateProof.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_StateQuery(arg) {
  if (!(arg instanceof blockchain_pb.StateQuery)) {
    throw new Error('Expected argument of type types.StateQuery');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_StateQuery(buffer_arg) {
  return blockchain_pb.StateQuery.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_StateQueryProof(arg) {
  if (!(arg instanceof blockchain_pb.StateQueryProof)) {
    throw new Error('Expected argument of type types.StateQueryProof');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_StateQueryProof(buffer_arg) {
  return blockchain_pb.StateQueryProof.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_Tx(arg) {
  if (!(arg instanceof blockchain_pb.Tx)) {
    throw new Error('Expected argument of type types.Tx');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Tx(buffer_arg) {
  return blockchain_pb.Tx.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_TxInBlock(arg) {
  if (!(arg instanceof blockchain_pb.TxInBlock)) {
    throw new Error('Expected argument of type types.TxInBlock');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_TxInBlock(buffer_arg) {
  return blockchain_pb.TxInBlock.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_TxList(arg) {
  if (!(arg instanceof blockchain_pb.TxList)) {
    throw new Error('Expected argument of type types.TxList');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_TxList(buffer_arg) {
  return blockchain_pb.TxList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_VerifyResult(arg) {
  if (!(arg instanceof rpc_pb.VerifyResult)) {
    throw new Error('Expected argument of type types.VerifyResult');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_VerifyResult(buffer_arg) {
  return rpc_pb.VerifyResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_VoteList(arg) {
  if (!(arg instanceof rpc_pb.VoteList)) {
    throw new Error('Expected argument of type types.VoteList');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_VoteList(buffer_arg) {
  return rpc_pb.VoteList.deserializeBinary(new Uint8Array(buffer_arg));
}


// BlockService serves APIs that aergosvr provides.
// Some methods optionally contains context path if it is also provided by REST API.
var AergoRPCServiceService = exports.AergoRPCServiceService = {
  nodeState: {
    path: '/types.AergoRPCService/NodeState',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: rpc_pb.SingleBytes,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_SingleBytes,
    responseDeserialize: deserialize_types_SingleBytes,
  },
  metric: {
    path: '/types.AergoRPCService/Metric',
    requestStream: false,
    responseStream: false,
    requestType: metric_pb.MetricsRequest,
    responseType: metric_pb.Metrics,
    requestSerialize: serialize_types_MetricsRequest,
    requestDeserialize: deserialize_types_MetricsRequest,
    responseSerialize: serialize_types_Metrics,
    responseDeserialize: deserialize_types_Metrics,
  },
  blockchain: {
    path: '/types.AergoRPCService/Blockchain',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Empty,
    responseType: rpc_pb.BlockchainStatus,
    requestSerialize: serialize_types_Empty,
    requestDeserialize: deserialize_types_Empty,
    responseSerialize: serialize_types_BlockchainStatus,
    responseDeserialize: deserialize_types_BlockchainStatus,
  },
  // option (google.api.http) = {
  //   get: "/blockchain"
  // };
  listBlockHeaders: {
    path: '/types.AergoRPCService/ListBlockHeaders',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ListParams,
    responseType: rpc_pb.BlockHeaderList,
    requestSerialize: serialize_types_ListParams,
    requestDeserialize: deserialize_types_ListParams,
    responseSerialize: serialize_types_BlockHeaderList,
    responseDeserialize: deserialize_types_BlockHeaderList,
  },
  listBlockStream: {
    path: '/types.AergoRPCService/ListBlockStream',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.Empty,
    responseType: blockchain_pb.Block,
    requestSerialize: serialize_types_Empty,
    requestDeserialize: deserialize_types_Empty,
    responseSerialize: serialize_types_Block,
    responseDeserialize: deserialize_types_Block,
  },
  getBlock: {
    path: '/types.AergoRPCService/GetBlock',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: blockchain_pb.Block,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_Block,
    responseDeserialize: deserialize_types_Block,
  },
  // option (google.api.http) = {
  //   get: "/blocks/{blockHash}"
  // };    
  getTX: {
    path: '/types.AergoRPCService/GetTX',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: blockchain_pb.Tx,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_Tx,
    responseDeserialize: deserialize_types_Tx,
  },
  // option (google.api.http) = {
  //   get: "/transactions/{value}"
  // };    
  getBlockTX: {
    path: '/types.AergoRPCService/GetBlockTX',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: blockchain_pb.TxInBlock,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_TxInBlock,
    responseDeserialize: deserialize_types_TxInBlock,
  },
  getReceipt: {
    path: '/types.AergoRPCService/GetReceipt',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: blockchain_pb.Receipt,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_Receipt,
    responseDeserialize: deserialize_types_Receipt,
  },
  getABI: {
    path: '/types.AergoRPCService/GetABI',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: blockchain_pb.ABI,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_ABI,
    responseDeserialize: deserialize_types_ABI,
  },
  sendTX: {
    path: '/types.AergoRPCService/SendTX',
    requestStream: false,
    responseStream: false,
    requestType: blockchain_pb.Tx,
    responseType: rpc_pb.CommitResult,
    requestSerialize: serialize_types_Tx,
    requestDeserialize: deserialize_types_Tx,
    responseSerialize: serialize_types_CommitResult,
    responseDeserialize: deserialize_types_CommitResult,
  },
  commitTX: {
    path: '/types.AergoRPCService/CommitTX',
    requestStream: false,
    responseStream: false,
    requestType: blockchain_pb.TxList,
    responseType: rpc_pb.CommitResultList,
    requestSerialize: serialize_types_TxList,
    requestDeserialize: deserialize_types_TxList,
    responseSerialize: serialize_types_CommitResultList,
    responseDeserialize: deserialize_types_CommitResultList,
  },
  // option (google.api.http) = {
  //   post: "/transactions"
  //   body: "transaction"
  // };    
  getState: {
    path: '/types.AergoRPCService/GetState',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: blockchain_pb.State,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_State,
    responseDeserialize: deserialize_types_State,
  },
  getStateAndProof: {
    path: '/types.AergoRPCService/GetStateAndProof',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.AccountAndRoot,
    responseType: blockchain_pb.StateProof,
    requestSerialize: serialize_types_AccountAndRoot,
    requestDeserialize: deserialize_types_AccountAndRoot,
    responseSerialize: serialize_types_StateProof,
    responseDeserialize: deserialize_types_StateProof,
  },
  createAccount: {
    path: '/types.AergoRPCService/CreateAccount',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Personal,
    responseType: account_pb.Account,
    requestSerialize: serialize_types_Personal,
    requestDeserialize: deserialize_types_Personal,
    responseSerialize: serialize_types_Account,
    responseDeserialize: deserialize_types_Account,
  },
  getAccounts: {
    path: '/types.AergoRPCService/GetAccounts',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Empty,
    responseType: account_pb.AccountList,
    requestSerialize: serialize_types_Empty,
    requestDeserialize: deserialize_types_Empty,
    responseSerialize: serialize_types_AccountList,
    responseDeserialize: deserialize_types_AccountList,
  },
  lockAccount: {
    path: '/types.AergoRPCService/LockAccount',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Personal,
    responseType: account_pb.Account,
    requestSerialize: serialize_types_Personal,
    requestDeserialize: deserialize_types_Personal,
    responseSerialize: serialize_types_Account,
    responseDeserialize: deserialize_types_Account,
  },
  unlockAccount: {
    path: '/types.AergoRPCService/UnlockAccount',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Personal,
    responseType: account_pb.Account,
    requestSerialize: serialize_types_Personal,
    requestDeserialize: deserialize_types_Personal,
    responseSerialize: serialize_types_Account,
    responseDeserialize: deserialize_types_Account,
  },
  importAccount: {
    path: '/types.AergoRPCService/ImportAccount',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ImportFormat,
    responseType: account_pb.Account,
    requestSerialize: serialize_types_ImportFormat,
    requestDeserialize: deserialize_types_ImportFormat,
    responseSerialize: serialize_types_Account,
    responseDeserialize: deserialize_types_Account,
  },
  exportAccount: {
    path: '/types.AergoRPCService/ExportAccount',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Personal,
    responseType: rpc_pb.SingleBytes,
    requestSerialize: serialize_types_Personal,
    requestDeserialize: deserialize_types_Personal,
    responseSerialize: serialize_types_SingleBytes,
    responseDeserialize: deserialize_types_SingleBytes,
  },
  signTX: {
    path: '/types.AergoRPCService/SignTX',
    requestStream: false,
    responseStream: false,
    requestType: blockchain_pb.Tx,
    responseType: blockchain_pb.Tx,
    requestSerialize: serialize_types_Tx,
    requestDeserialize: deserialize_types_Tx,
    responseSerialize: serialize_types_Tx,
    responseDeserialize: deserialize_types_Tx,
  },
  verifyTX: {
    path: '/types.AergoRPCService/VerifyTX',
    requestStream: false,
    responseStream: false,
    requestType: blockchain_pb.Tx,
    responseType: rpc_pb.VerifyResult,
    requestSerialize: serialize_types_Tx,
    requestDeserialize: deserialize_types_Tx,
    responseSerialize: serialize_types_VerifyResult,
    responseDeserialize: deserialize_types_VerifyResult,
  },
  queryContract: {
    path: '/types.AergoRPCService/QueryContract',
    requestStream: false,
    responseStream: false,
    requestType: blockchain_pb.Query,
    responseType: rpc_pb.SingleBytes,
    requestSerialize: serialize_types_Query,
    requestDeserialize: deserialize_types_Query,
    responseSerialize: serialize_types_SingleBytes,
    responseDeserialize: deserialize_types_SingleBytes,
  },
  queryContractState: {
    path: '/types.AergoRPCService/QueryContractState',
    requestStream: false,
    responseStream: false,
    requestType: blockchain_pb.StateQuery,
    responseType: blockchain_pb.StateQueryProof,
    requestSerialize: serialize_types_StateQuery,
    requestDeserialize: deserialize_types_StateQuery,
    responseSerialize: serialize_types_StateQueryProof,
    responseDeserialize: deserialize_types_StateQueryProof,
  },
  getPeers: {
    path: '/types.AergoRPCService/GetPeers',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Empty,
    responseType: rpc_pb.PeerList,
    requestSerialize: serialize_types_Empty,
    requestDeserialize: deserialize_types_Empty,
    responseSerialize: serialize_types_PeerList,
    responseDeserialize: deserialize_types_PeerList,
  },
  getVotes: {
    path: '/types.AergoRPCService/GetVotes',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: rpc_pb.VoteList,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_VoteList,
    responseDeserialize: deserialize_types_VoteList,
  },
  getStaking: {
    path: '/types.AergoRPCService/GetStaking',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: rpc_pb.Staking,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_Staking,
    responseDeserialize: deserialize_types_Staking,
  },
};

exports.AergoRPCServiceClient = grpc.makeGenericClientConstructor(AergoRPCServiceService);
