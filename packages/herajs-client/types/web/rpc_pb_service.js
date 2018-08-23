// package: types
// file: rpc.proto

var rpc_pb = require("./rpc_pb");
var blockchain_pb = require("./blockchain_pb");
var account_pb = require("./account_pb");
var grpc = require("grpc-web-client").grpc;

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
  requestType: rpc_pb.SingleBytes,
  responseType: rpc_pb.SingleBytes
};

AergoRPCService.Blockchain = {
  methodName: "Blockchain",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.BlockchainStatus
};

AergoRPCService.ListBlockHeaders = {
  methodName: "ListBlockHeaders",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.ListParams,
  responseType: rpc_pb.BlockHeaderList
};

AergoRPCService.GetBlock = {
  methodName: "GetBlock",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.SingleBytes,
  responseType: blockchain_pb.Block
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

AergoRPCService.GetPeers = {
  methodName: "GetPeers",
  service: AergoRPCService,
  requestStream: false,
  responseStream: false,
  requestType: rpc_pb.Empty,
  responseType: rpc_pb.PeerList
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
  grpc.unary(AergoRPCService.NodeState, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.blockchain = function blockchain(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.Blockchain, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.listBlockHeaders = function listBlockHeaders(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.ListBlockHeaders, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.getBlock = function getBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.GetBlock, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.getTX = function getTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.GetTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.getBlockTX = function getBlockTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.GetBlockTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.commitTX = function commitTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.CommitTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.getState = function getState(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.GetState, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.createAccount = function createAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.CreateAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.getAccounts = function getAccounts(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.GetAccounts, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.lockAccount = function lockAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.LockAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.unlockAccount = function unlockAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.UnlockAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.signTX = function signTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.SignTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.verifyTX = function verifyTX(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.VerifyTX, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

AergoRPCServiceClient.prototype.getPeers = function getPeers(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(AergoRPCService.GetPeers, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

exports.AergoRPCServiceClient = AergoRPCServiceClient;

