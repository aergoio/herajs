// package: types
// file: rpc.proto

import * as rpc_pb from "./rpc_pb";
import * as blockchain_pb from "./blockchain_pb";
import * as account_pb from "./account_pb";
import {grpc} from "grpc-web-client";

type AergoRPCServiceNodeState = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.SingleBytes;
  readonly responseType: typeof rpc_pb.SingleBytes;
};

type AergoRPCServiceBlockchain = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.Empty;
  readonly responseType: typeof rpc_pb.BlockchainStatus;
};

type AergoRPCServiceListBlockHeaders = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.ListParams;
  readonly responseType: typeof rpc_pb.BlockHeaderList;
};

type AergoRPCServiceListBlockStream = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof rpc_pb.Empty;
  readonly responseType: typeof blockchain_pb.Block;
};

type AergoRPCServiceGetBlock = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.SingleBytes;
  readonly responseType: typeof blockchain_pb.Block;
};

type AergoRPCServiceGetTX = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.SingleBytes;
  readonly responseType: typeof blockchain_pb.Tx;
};

type AergoRPCServiceGetBlockTX = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.SingleBytes;
  readonly responseType: typeof blockchain_pb.TxInBlock;
};

type AergoRPCServiceGetReceipt = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.SingleBytes;
  readonly responseType: typeof blockchain_pb.Receipt;
};

type AergoRPCServiceGetABI = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.SingleBytes;
  readonly responseType: typeof blockchain_pb.ABI;
};

type AergoRPCServiceSendTX = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof blockchain_pb.Tx;
  readonly responseType: typeof rpc_pb.CommitResult;
};

type AergoRPCServiceCommitTX = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof blockchain_pb.TxList;
  readonly responseType: typeof rpc_pb.CommitResultList;
};

type AergoRPCServiceGetState = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.SingleBytes;
  readonly responseType: typeof blockchain_pb.State;
};

type AergoRPCServiceCreateAccount = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.Personal;
  readonly responseType: typeof account_pb.Account;
};

type AergoRPCServiceGetAccounts = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.Empty;
  readonly responseType: typeof account_pb.AccountList;
};

type AergoRPCServiceLockAccount = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.Personal;
  readonly responseType: typeof account_pb.Account;
};

type AergoRPCServiceUnlockAccount = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.Personal;
  readonly responseType: typeof account_pb.Account;
};

type AergoRPCServiceImportAccount = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.ImportFormat;
  readonly responseType: typeof account_pb.Account;
};

type AergoRPCServiceExportAccount = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.Personal;
  readonly responseType: typeof rpc_pb.SingleBytes;
};

type AergoRPCServiceSignTX = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof blockchain_pb.Tx;
  readonly responseType: typeof blockchain_pb.Tx;
};

type AergoRPCServiceVerifyTX = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof blockchain_pb.Tx;
  readonly responseType: typeof rpc_pb.VerifyResult;
};

type AergoRPCServiceQueryContract = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof blockchain_pb.Query;
  readonly responseType: typeof rpc_pb.SingleBytes;
};

type AergoRPCServiceGetPeers = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.Empty;
  readonly responseType: typeof rpc_pb.PeerList;
};

type AergoRPCServiceGetVotes = {
  readonly methodName: string;
  readonly service: typeof AergoRPCService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rpc_pb.SingleBytes;
  readonly responseType: typeof blockchain_pb.VoteList;
};

export class AergoRPCService {
  static readonly serviceName: string;
  static readonly NodeState: AergoRPCServiceNodeState;
  static readonly Blockchain: AergoRPCServiceBlockchain;
  static readonly ListBlockHeaders: AergoRPCServiceListBlockHeaders;
  static readonly ListBlockStream: AergoRPCServiceListBlockStream;
  static readonly GetBlock: AergoRPCServiceGetBlock;
  static readonly GetTX: AergoRPCServiceGetTX;
  static readonly GetBlockTX: AergoRPCServiceGetBlockTX;
  static readonly GetReceipt: AergoRPCServiceGetReceipt;
  static readonly GetABI: AergoRPCServiceGetABI;
  static readonly SendTX: AergoRPCServiceSendTX;
  static readonly CommitTX: AergoRPCServiceCommitTX;
  static readonly GetState: AergoRPCServiceGetState;
  static readonly CreateAccount: AergoRPCServiceCreateAccount;
  static readonly GetAccounts: AergoRPCServiceGetAccounts;
  static readonly LockAccount: AergoRPCServiceLockAccount;
  static readonly UnlockAccount: AergoRPCServiceUnlockAccount;
  static readonly ImportAccount: AergoRPCServiceImportAccount;
  static readonly ExportAccount: AergoRPCServiceExportAccount;
  static readonly SignTX: AergoRPCServiceSignTX;
  static readonly VerifyTX: AergoRPCServiceVerifyTX;
  static readonly QueryContract: AergoRPCServiceQueryContract;
  static readonly GetPeers: AergoRPCServiceGetPeers;
  static readonly GetVotes: AergoRPCServiceGetVotes;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }
export type ServiceClientOptions = { transport: grpc.TransportConstructor; debug?: boolean }

interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: () => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}

export class AergoRPCServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: ServiceClientOptions);
  nodeState(
    requestMessage: rpc_pb.SingleBytes,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: rpc_pb.SingleBytes|null) => void
  ): void;
  nodeState(
    requestMessage: rpc_pb.SingleBytes,
    callback: (error: ServiceError, responseMessage: rpc_pb.SingleBytes|null) => void
  ): void;
  blockchain(
    requestMessage: rpc_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: rpc_pb.BlockchainStatus|null) => void
  ): void;
  blockchain(
    requestMessage: rpc_pb.Empty,
    callback: (error: ServiceError, responseMessage: rpc_pb.BlockchainStatus|null) => void
  ): void;
  listBlockHeaders(
    requestMessage: rpc_pb.ListParams,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: rpc_pb.BlockHeaderList|null) => void
  ): void;
  listBlockHeaders(
    requestMessage: rpc_pb.ListParams,
    callback: (error: ServiceError, responseMessage: rpc_pb.BlockHeaderList|null) => void
  ): void;
  listBlockStream(requestMessage: rpc_pb.Empty, metadata?: grpc.Metadata): ResponseStream<blockchain_pb.Block>;
  getBlock(
    requestMessage: rpc_pb.SingleBytes,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: blockchain_pb.Block|null) => void
  ): void;
  getBlock(
    requestMessage: rpc_pb.SingleBytes,
    callback: (error: ServiceError, responseMessage: blockchain_pb.Block|null) => void
  ): void;
  getTX(
    requestMessage: rpc_pb.SingleBytes,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: blockchain_pb.Tx|null) => void
  ): void;
  getTX(
    requestMessage: rpc_pb.SingleBytes,
    callback: (error: ServiceError, responseMessage: blockchain_pb.Tx|null) => void
  ): void;
  getBlockTX(
    requestMessage: rpc_pb.SingleBytes,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: blockchain_pb.TxInBlock|null) => void
  ): void;
  getBlockTX(
    requestMessage: rpc_pb.SingleBytes,
    callback: (error: ServiceError, responseMessage: blockchain_pb.TxInBlock|null) => void
  ): void;
  getReceipt(
    requestMessage: rpc_pb.SingleBytes,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: blockchain_pb.Receipt|null) => void
  ): void;
  getReceipt(
    requestMessage: rpc_pb.SingleBytes,
    callback: (error: ServiceError, responseMessage: blockchain_pb.Receipt|null) => void
  ): void;
  getABI(
    requestMessage: rpc_pb.SingleBytes,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: blockchain_pb.ABI|null) => void
  ): void;
  getABI(
    requestMessage: rpc_pb.SingleBytes,
    callback: (error: ServiceError, responseMessage: blockchain_pb.ABI|null) => void
  ): void;
  sendTX(
    requestMessage: blockchain_pb.Tx,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: rpc_pb.CommitResult|null) => void
  ): void;
  sendTX(
    requestMessage: blockchain_pb.Tx,
    callback: (error: ServiceError, responseMessage: rpc_pb.CommitResult|null) => void
  ): void;
  commitTX(
    requestMessage: blockchain_pb.TxList,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: rpc_pb.CommitResultList|null) => void
  ): void;
  commitTX(
    requestMessage: blockchain_pb.TxList,
    callback: (error: ServiceError, responseMessage: rpc_pb.CommitResultList|null) => void
  ): void;
  getState(
    requestMessage: rpc_pb.SingleBytes,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: blockchain_pb.State|null) => void
  ): void;
  getState(
    requestMessage: rpc_pb.SingleBytes,
    callback: (error: ServiceError, responseMessage: blockchain_pb.State|null) => void
  ): void;
  createAccount(
    requestMessage: rpc_pb.Personal,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: account_pb.Account|null) => void
  ): void;
  createAccount(
    requestMessage: rpc_pb.Personal,
    callback: (error: ServiceError, responseMessage: account_pb.Account|null) => void
  ): void;
  getAccounts(
    requestMessage: rpc_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: account_pb.AccountList|null) => void
  ): void;
  getAccounts(
    requestMessage: rpc_pb.Empty,
    callback: (error: ServiceError, responseMessage: account_pb.AccountList|null) => void
  ): void;
  lockAccount(
    requestMessage: rpc_pb.Personal,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: account_pb.Account|null) => void
  ): void;
  lockAccount(
    requestMessage: rpc_pb.Personal,
    callback: (error: ServiceError, responseMessage: account_pb.Account|null) => void
  ): void;
  unlockAccount(
    requestMessage: rpc_pb.Personal,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: account_pb.Account|null) => void
  ): void;
  unlockAccount(
    requestMessage: rpc_pb.Personal,
    callback: (error: ServiceError, responseMessage: account_pb.Account|null) => void
  ): void;
  importAccount(
    requestMessage: rpc_pb.ImportFormat,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: account_pb.Account|null) => void
  ): void;
  importAccount(
    requestMessage: rpc_pb.ImportFormat,
    callback: (error: ServiceError, responseMessage: account_pb.Account|null) => void
  ): void;
  exportAccount(
    requestMessage: rpc_pb.Personal,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: rpc_pb.SingleBytes|null) => void
  ): void;
  exportAccount(
    requestMessage: rpc_pb.Personal,
    callback: (error: ServiceError, responseMessage: rpc_pb.SingleBytes|null) => void
  ): void;
  signTX(
    requestMessage: blockchain_pb.Tx,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: blockchain_pb.Tx|null) => void
  ): void;
  signTX(
    requestMessage: blockchain_pb.Tx,
    callback: (error: ServiceError, responseMessage: blockchain_pb.Tx|null) => void
  ): void;
  verifyTX(
    requestMessage: blockchain_pb.Tx,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: rpc_pb.VerifyResult|null) => void
  ): void;
  verifyTX(
    requestMessage: blockchain_pb.Tx,
    callback: (error: ServiceError, responseMessage: rpc_pb.VerifyResult|null) => void
  ): void;
  queryContract(
    requestMessage: blockchain_pb.Query,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: rpc_pb.SingleBytes|null) => void
  ): void;
  queryContract(
    requestMessage: blockchain_pb.Query,
    callback: (error: ServiceError, responseMessage: rpc_pb.SingleBytes|null) => void
  ): void;
  getPeers(
    requestMessage: rpc_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: rpc_pb.PeerList|null) => void
  ): void;
  getPeers(
    requestMessage: rpc_pb.Empty,
    callback: (error: ServiceError, responseMessage: rpc_pb.PeerList|null) => void
  ): void;
  getVotes(
    requestMessage: rpc_pb.SingleBytes,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: blockchain_pb.VoteList|null) => void
  ): void;
  getVotes(
    requestMessage: rpc_pb.SingleBytes,
    callback: (error: ServiceError, responseMessage: blockchain_pb.VoteList|null) => void
  ): void;
}

