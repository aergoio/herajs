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

function serialize_types_AccountAddress(arg) {
  if (!(arg instanceof rpc_pb.AccountAddress)) {
    throw new Error('Expected argument of type types.AccountAddress');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_AccountAddress(buffer_arg) {
  return rpc_pb.AccountAddress.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_types_AccountProof(arg) {
  if (!(arg instanceof blockchain_pb.AccountProof)) {
    throw new Error('Expected argument of type types.AccountProof');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_AccountProof(buffer_arg) {
  return blockchain_pb.AccountProof.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_AccountVoteInfo(arg) {
  if (!(arg instanceof rpc_pb.AccountVoteInfo)) {
    throw new Error('Expected argument of type types.AccountVoteInfo');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_AccountVoteInfo(buffer_arg) {
  return rpc_pb.AccountVoteInfo.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_types_BlockBodyPaged(arg) {
  if (!(arg instanceof rpc_pb.BlockBodyPaged)) {
    throw new Error('Expected argument of type types.BlockBodyPaged');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_BlockBodyPaged(buffer_arg) {
  return rpc_pb.BlockBodyPaged.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_BlockBodyParams(arg) {
  if (!(arg instanceof rpc_pb.BlockBodyParams)) {
    throw new Error('Expected argument of type types.BlockBodyParams');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_BlockBodyParams(buffer_arg) {
  return rpc_pb.BlockBodyParams.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_types_BlockMetadata(arg) {
  if (!(arg instanceof rpc_pb.BlockMetadata)) {
    throw new Error('Expected argument of type types.BlockMetadata');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_BlockMetadata(buffer_arg) {
  return rpc_pb.BlockMetadata.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_BlockMetadataList(arg) {
  if (!(arg instanceof rpc_pb.BlockMetadataList)) {
    throw new Error('Expected argument of type types.BlockMetadataList');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_BlockMetadataList(buffer_arg) {
  return rpc_pb.BlockMetadataList.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_types_ChainInfo(arg) {
  if (!(arg instanceof rpc_pb.ChainInfo)) {
    throw new Error('Expected argument of type types.ChainInfo');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_ChainInfo(buffer_arg) {
  return rpc_pb.ChainInfo.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_types_ConsensusInfo(arg) {
  if (!(arg instanceof rpc_pb.ConsensusInfo)) {
    throw new Error('Expected argument of type types.ConsensusInfo');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_ConsensusInfo(buffer_arg) {
  return rpc_pb.ConsensusInfo.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_types_Event(arg) {
  if (!(arg instanceof blockchain_pb.Event)) {
    throw new Error('Expected argument of type types.Event');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Event(buffer_arg) {
  return blockchain_pb.Event.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_EventList(arg) {
  if (!(arg instanceof rpc_pb.EventList)) {
    throw new Error('Expected argument of type types.EventList');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_EventList(buffer_arg) {
  return rpc_pb.EventList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_FilterInfo(arg) {
  if (!(arg instanceof blockchain_pb.FilterInfo)) {
    throw new Error('Expected argument of type types.FilterInfo');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_FilterInfo(buffer_arg) {
  return blockchain_pb.FilterInfo.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_types_Name(arg) {
  if (!(arg instanceof rpc_pb.Name)) {
    throw new Error('Expected argument of type types.Name');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_Name(buffer_arg) {
  return rpc_pb.Name.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_NameInfo(arg) {
  if (!(arg instanceof rpc_pb.NameInfo)) {
    throw new Error('Expected argument of type types.NameInfo');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_NameInfo(buffer_arg) {
  return rpc_pb.NameInfo.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_types_NodeReq(arg) {
  if (!(arg instanceof rpc_pb.NodeReq)) {
    throw new Error('Expected argument of type types.NodeReq');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_NodeReq(buffer_arg) {
  return rpc_pb.NodeReq.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_types_PeersParams(arg) {
  if (!(arg instanceof rpc_pb.PeersParams)) {
    throw new Error('Expected argument of type types.PeersParams');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_PeersParams(buffer_arg) {
  return rpc_pb.PeersParams.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_types_VoteParams(arg) {
  if (!(arg instanceof rpc_pb.VoteParams)) {
    throw new Error('Expected argument of type types.VoteParams');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_types_VoteParams(buffer_arg) {
  return rpc_pb.VoteParams.deserializeBinary(new Uint8Array(buffer_arg));
}


// *
// AergoRPCService is the main RPC service providing endpoints to interact 
// with the node and blockchain. If not otherwise noted, methods are unary requests.
var AergoRPCServiceService = exports.AergoRPCServiceService = {
  // Returns the current state of this node
  nodeState: {
    path: '/types.AergoRPCService/NodeState',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.NodeReq,
    responseType: rpc_pb.SingleBytes,
    requestSerialize: serialize_types_NodeReq,
    requestDeserialize: deserialize_types_NodeReq,
    responseSerialize: serialize_types_SingleBytes,
    responseDeserialize: deserialize_types_SingleBytes,
  },
  // Returns node metrics according to request 
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
  // Returns current blockchain status (best block's height and hash)
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
  // Returns current blockchain's basic information
  getChainInfo: {
    path: '/types.AergoRPCService/GetChainInfo',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Empty,
    responseType: rpc_pb.ChainInfo,
    requestSerialize: serialize_types_Empty,
    requestDeserialize: deserialize_types_Empty,
    responseSerialize: serialize_types_ChainInfo,
    responseDeserialize: deserialize_types_ChainInfo,
  },
  // Returns list of Blocks without body according to request
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
  // Returns list of block metadata (hash, header, and number of transactions) according to request
  listBlockMetadata: {
    path: '/types.AergoRPCService/ListBlockMetadata',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.ListParams,
    responseType: rpc_pb.BlockMetadataList,
    requestSerialize: serialize_types_ListParams,
    requestDeserialize: deserialize_types_ListParams,
    responseSerialize: serialize_types_BlockMetadataList,
    responseDeserialize: deserialize_types_BlockMetadataList,
  },
  // Returns a stream of new blocks as they get added to the blockchain
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
  // Returns a stream of new block's metadata as they get added to the blockchain
  listBlockMetadataStream: {
    path: '/types.AergoRPCService/ListBlockMetadataStream',
    requestStream: false,
    responseStream: true,
    requestType: rpc_pb.Empty,
    responseType: rpc_pb.BlockMetadata,
    requestSerialize: serialize_types_Empty,
    requestDeserialize: deserialize_types_Empty,
    responseSerialize: serialize_types_BlockMetadata,
    responseDeserialize: deserialize_types_BlockMetadata,
  },
  // Return a single block incl. header and body, queried by hash or number
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
  // Return a single block's metdata (hash, header, and number of transactions), queried by hash or number
  getBlockMetadata: {
    path: '/types.AergoRPCService/GetBlockMetadata',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SingleBytes,
    responseType: rpc_pb.BlockMetadata,
    requestSerialize: serialize_types_SingleBytes,
    requestDeserialize: deserialize_types_SingleBytes,
    responseSerialize: serialize_types_BlockMetadata,
    responseDeserialize: deserialize_types_BlockMetadata,
  },
  // Return a single block's body, queried by hash or number and list parameters
  getBlockBody: {
    path: '/types.AergoRPCService/GetBlockBody',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.BlockBodyParams,
    responseType: rpc_pb.BlockBodyPaged,
    requestSerialize: serialize_types_BlockBodyParams,
    requestDeserialize: deserialize_types_BlockBodyParams,
    responseSerialize: serialize_types_BlockBodyPaged,
    responseDeserialize: deserialize_types_BlockBodyPaged,
  },
  // Return a single transaction, queried by transaction hash
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
  // Return information about transaction in block, queried by transaction hash
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
  // Return transaction receipt, queried by transaction hash
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
  // Return ABI stored at contract address
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
  // Sign and send a transaction from an unlocked account
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
  // Sign transaction with unlocked account
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
  // Verify validity of transaction
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
  // Commit a signed transaction
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
  // Return state of account
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
  // Return state of account, including merkle proof
  getStateAndProof: {
    path: '/types.AergoRPCService/GetStateAndProof',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.AccountAndRoot,
    responseType: blockchain_pb.AccountProof,
    requestSerialize: serialize_types_AccountAndRoot,
    requestDeserialize: deserialize_types_AccountAndRoot,
    responseSerialize: serialize_types_AccountProof,
    responseDeserialize: deserialize_types_AccountProof,
  },
  // Create a new account in this node
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
  // Return list of accounts in this node
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
  // Lock account in this node
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
  // Unlock account in this node
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
  // Import account to this node
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
  // Export account stored in this node
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
  // Query a contract method
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
  // Query contract state
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
  // Return list of peers of this node and their state
  getPeers: {
    path: '/types.AergoRPCService/GetPeers',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.PeersParams,
    responseType: rpc_pb.PeerList,
    requestSerialize: serialize_types_PeersParams,
    requestDeserialize: deserialize_types_PeersParams,
    responseSerialize: serialize_types_PeerList,
    responseDeserialize: deserialize_types_PeerList,
  },
  // Return result of vote
  getVotes: {
    path: '/types.AergoRPCService/GetVotes',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.VoteParams,
    responseType: rpc_pb.VoteList,
    requestSerialize: serialize_types_VoteParams,
    requestDeserialize: deserialize_types_VoteParams,
    responseSerialize: serialize_types_VoteList,
    responseDeserialize: deserialize_types_VoteList,
  },
  // Return staking, voting info for account
  getAccountVotes: {
    path: '/types.AergoRPCService/GetAccountVotes',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.AccountAddress,
    responseType: rpc_pb.AccountVoteInfo,
    requestSerialize: serialize_types_AccountAddress,
    requestDeserialize: deserialize_types_AccountAddress,
    responseSerialize: serialize_types_AccountVoteInfo,
    responseDeserialize: deserialize_types_AccountVoteInfo,
  },
  // Return staking information
  getStaking: {
    path: '/types.AergoRPCService/GetStaking',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.AccountAddress,
    responseType: rpc_pb.Staking,
    requestSerialize: serialize_types_AccountAddress,
    requestDeserialize: deserialize_types_AccountAddress,
    responseSerialize: serialize_types_Staking,
    responseDeserialize: deserialize_types_Staking,
  },
  // Return name information
  getNameInfo: {
    path: '/types.AergoRPCService/GetNameInfo',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Name,
    responseType: rpc_pb.NameInfo,
    requestSerialize: serialize_types_Name,
    requestDeserialize: deserialize_types_Name,
    responseSerialize: serialize_types_NameInfo,
    responseDeserialize: deserialize_types_NameInfo,
  },
  // Returns a stream of event as they get added to the blockchain
  listEventStream: {
    path: '/types.AergoRPCService/ListEventStream',
    requestStream: false,
    responseStream: true,
    requestType: blockchain_pb.FilterInfo,
    responseType: blockchain_pb.Event,
    requestSerialize: serialize_types_FilterInfo,
    requestDeserialize: deserialize_types_FilterInfo,
    responseSerialize: serialize_types_Event,
    responseDeserialize: deserialize_types_Event,
  },
  // Returns list of event
  listEvents: {
    path: '/types.AergoRPCService/ListEvents',
    requestStream: false,
    responseStream: false,
    requestType: blockchain_pb.FilterInfo,
    responseType: rpc_pb.EventList,
    requestSerialize: serialize_types_FilterInfo,
    requestDeserialize: deserialize_types_FilterInfo,
    responseSerialize: serialize_types_EventList,
    responseDeserialize: deserialize_types_EventList,
  },
  // Returns status of consensus and bps
  getConsensusInfo: {
    path: '/types.AergoRPCService/GetConsensusInfo',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.Empty,
    responseType: rpc_pb.ConsensusInfo,
    requestSerialize: serialize_types_Empty,
    requestDeserialize: deserialize_types_Empty,
    responseSerialize: serialize_types_ConsensusInfo,
    responseDeserialize: deserialize_types_ConsensusInfo,
  },
};

exports.AergoRPCServiceClient = grpc.makeGenericClientConstructor(AergoRPCServiceService);
