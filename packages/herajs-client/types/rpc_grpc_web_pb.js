// package: types
// file: rpc.proto

var rpc_pb = require("./rpc_pb");
var blockchain_pb = require("./blockchain_pb");
var account_pb = require("./account_pb");
var metric_pb = require("./metric_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var AergoRPCService = (function () {
  function AergoRPCService() {}
  AergoRPCService.serviceName = "types.AergoRPCService";
  return AergoRPCService;
}());

AergoRPCService.NodeState = {
  methodName: "NodeState",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.NodeReq,
  responseType: rpc_pb.SingleBytes
};

AergoRPCService.Metric = {
  methodName: "Metric",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: metric_pb.MetricsRequest,
  responseType: metric_pb.Metrics
};

AergoRPCService.Blockchain = {
  methodName: "Blockchain",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.BlockchainStatus
};

AergoRPCService.GetChainInfo = {
  methodName: "GetChainInfo",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.ChainInfo
};

AergoRPCService.ListBlockHeaders = {
  methodName: "ListBlockHeaders",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.ListParams,
  responseType: rpc_pb.BlockHeaderList
};

AergoRPCService.ListBlockMetadata = {
  methodName: "ListBlockMetadata",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.ListParams,
  responseType: rpc_pb.BlockMetadataList
};

AergoRPCService.ListBlockStream = {
  methodName: "ListBlockStream",
  service: AergoRPCService,
  requestStream: false,
  responseStream: true,
  requestType: rpc_pb.Empty,
  responseType: blockchain_pb.Block
};

AergoRPCService.ListBlockMetadataStream = {
  methodName: "ListBlockMetadataStream",
  service: AergoRPCService,
  requestStream: false,
  responseStream: true,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.BlockMetadata
};

AergoRPCService.GetBlock = {
  methodName: "GetBlock",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.Block
};

AergoRPCService.GetBlockMetadata = {
  methodName: "GetBlockMetadata",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: rpc_pb.BlockMetadata
};

AergoRPCService.GetBlockBody = {
  methodName: "GetBlockBody",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.BlockBodyParams,
  responseType: rpc_pb.BlockBodyPaged
};

AergoRPCService.GetTX = {
  methodName: "GetTX",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.Tx
};

AergoRPCService.GetBlockTX = {
  methodName: "GetBlockTX",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.TxInBlock
};

AergoRPCService.GetReceipt = {
  methodName: "GetReceipt",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.Receipt
};

AergoRPCService.GetABI = {
  methodName: "GetABI",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.ABI
};

AergoRPCService.SendTX = {
  methodName: "SendTX",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.Tx,
  responseType: rpc_pb.CommitResult
};

AergoRPCService.SignTX = {
  methodName: "SignTX",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.Tx,
  responseType: blockchain_pb.Tx
};

AergoRPCService.VerifyTX = {
  methodName: "VerifyTX",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.Tx,
  responseType: rpc_pb.VerifyResult
};

AergoRPCService.CommitTX = {
  methodName: "CommitTX",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.TxList,
  responseType: rpc_pb.CommitResultList
};

AergoRPCService.GetState = {
  methodName: "GetState",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.State
};

AergoRPCService.GetStateAndProof = {
  methodName: "GetStateAndProof",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.AccountAndRoot,
  responseType: blockchain_pb.AccountProof
};

AergoRPCService.CreateAccount = {
  methodName: "CreateAccount",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Personal,
  responseType: account_pb.Account
};

AergoRPCService.GetAccounts = {
  methodName: "GetAccounts",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: account_pb.AccountList
};

AergoRPCService.LockAccount = {
  methodName: "LockAccount",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Personal,
  responseType: account_pb.Account
};

AergoRPCService.UnlockAccount = {
  methodName: "UnlockAccount",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Personal,
  responseType: account_pb.Account
};

AergoRPCService.ImportAccount = {
  methodName: "ImportAccount",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.ImportFormat,
  responseType: account_pb.Account
};

AergoRPCService.ExportAccount = {
  methodName: "ExportAccount",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Personal,
  responseType: rpc_pb.SingleBytes
};

AergoRPCService.QueryContract = {
  methodName: "QueryContract",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.Query,
  responseType: rpc_pb.SingleBytes
};

AergoRPCService.QueryContractState = {
  methodName: "QueryContractState",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.StateQuery,
  responseType: blockchain_pb.StateQueryProof
};

AergoRPCService.GetPeers = {
  methodName: "GetPeers",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.PeersParams,
  responseType: rpc_pb.PeerList
};

AergoRPCService.GetVotes = {
  methodName: "GetVotes",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.VoteParams,
  responseType: rpc_pb.VoteList
};

AergoRPCService.GetAccountVotes = {
  methodName: "GetAccountVotes",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.AccountAddress,
  responseType: rpc_pb.AccountVoteInfo
};

AergoRPCService.GetStaking = {
  methodName: "GetStaking",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.AccountAddress,
  responseType: rpc_pb.Staking
};

AergoRPCService.GetNameInfo = {
  methodName: "GetNameInfo",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Name,
  responseType: rpc_pb.NameInfo
};

AergoRPCService.ListEventStream = {
  methodName: "ListEventStream",
  service: AergoRPCService,
  requestStream: false,
  responseStream: true,
  requestType: blockchain_pb.FilterInfo,
  responseType: blockchain_pb.Event
};

AergoRPCService.ListEvents = {
  methodName: "ListEvents",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: blockchain_pb.FilterInfo,
  responseType: rpc_pb.EventList
};

AergoRPCService.GetServerInfo = {
  methodName: "GetServerInfo",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.KeyParams,
  responseType: rpc_pb.ServerInfo
};

AergoRPCService.GetConsensusInfo = {
  methodName: "GetConsensusInfo",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.ConsensusInfo
};

exports.AergoRPCService = AergoRPCService;

function AergoRPCServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AergoRPCServiceClient.prototype.nodeState = function nodeState(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.NodeState, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.metric = function metric(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.Metric, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.blockchain = function blockchain(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.Blockchain, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getChainInfo = function getChainInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetChainInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.listBlockHeaders = function listBlockHeaders(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.ListBlockHeaders, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.listBlockMetadata = function listBlockMetadata(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.ListBlockMetadata, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.listBlockStream = function listBlockStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AergoRPCService.ListBlockStream, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.end.forEach(function (handler) {
        handler();
      });
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.listBlockMetadataStream = function listBlockMetadataStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AergoRPCService.ListBlockMetadataStream, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.end.forEach(function (handler) {
        handler();
      });
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getBlock = function getBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetBlock, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getBlockMetadata = function getBlockMetadata(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetBlockMetadata, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getBlockBody = function getBlockBody(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetBlockBody, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getTX = function getTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getBlockTX = function getBlockTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetBlockTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getReceipt = function getReceipt(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetReceipt, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getABI = function getABI(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetABI, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.sendTX = function sendTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.SendTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.signTX = function signTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.SignTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.verifyTX = function verifyTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.VerifyTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.commitTX = function commitTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.CommitTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getState = function getState(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetState, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getStateAndProof = function getStateAndProof(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetStateAndProof, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.createAccount = function createAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.CreateAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getAccounts = function getAccounts(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetAccounts, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.lockAccount = function lockAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.LockAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.unlockAccount = function unlockAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.UnlockAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.importAccount = function importAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.ImportAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.exportAccount = function exportAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.ExportAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.queryContract = function queryContract(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.QueryContract, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.queryContractState = function queryContractState(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.QueryContractState, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getPeers = function getPeers(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetPeers, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getVotes = function getVotes(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetVotes, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getAccountVotes = function getAccountVotes(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetAccountVotes, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getStaking = function getStaking(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetStaking, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getNameInfo = function getNameInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetNameInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.listEventStream = function listEventStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AergoRPCService.ListEventStream, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.end.forEach(function (handler) {
        handler();
      });
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.listEvents = function listEvents(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.ListEvents, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getServerInfo = function getServerInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetServerInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AergoRPCServiceClient.prototype.getConsensusInfo = function getConsensusInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AergoRPCService.GetConsensusInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.AergoRPCServiceClient = AergoRPCServiceClient;

