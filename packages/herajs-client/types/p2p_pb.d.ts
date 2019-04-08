// package: types
// file: p2p.proto

import * as jspb from "google-protobuf";
import * as blockchain_pb from "./blockchain_pb";
import * as node_pb from "./node_pb";

export class MsgHeader extends jspb.Message {
  getClientversion(): string;
  setClientversion(value: string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getId(): string;
  setId(value: string): void;

  getGossip(): boolean;
  setGossip(value: boolean): void;

  getPeerid(): Uint8Array | string;
  getPeerid_asU8(): Uint8Array;
  getPeerid_asB64(): string;
  setPeerid(value: Uint8Array | string): void;

  getNodepubkey(): Uint8Array | string;
  getNodepubkey_asU8(): Uint8Array;
  getNodepubkey_asB64(): string;
  setNodepubkey(value: Uint8Array | string): void;

  getSign(): Uint8Array | string;
  getSign_asU8(): Uint8Array;
  getSign_asB64(): string;
  setSign(value: Uint8Array | string): void;

  getSubprotocol(): number;
  setSubprotocol(value: number): void;

  getLength(): number;
  setLength(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgHeader.AsObject;
  static toObject(includeInstance: boolean, msg: MsgHeader): MsgHeader.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MsgHeader, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgHeader;
  static deserializeBinaryFromReader(message: MsgHeader, reader: jspb.BinaryReader): MsgHeader;
}

export namespace MsgHeader {
  export type AsObject = {
    clientversion: string,
    timestamp: number,
    id: string,
    gossip: boolean,
    peerid: Uint8Array | string,
    nodepubkey: Uint8Array | string,
    sign: Uint8Array | string,
    subprotocol: number,
    length: number,
  }
}

export class P2PMessage extends jspb.Message {
  hasHeader(): boolean;
  clearHeader(): void;
  getHeader(): MsgHeader | undefined;
  setHeader(value?: MsgHeader): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): P2PMessage.AsObject;
  static toObject(includeInstance: boolean, msg: P2PMessage): P2PMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: P2PMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): P2PMessage;
  static deserializeBinaryFromReader(message: P2PMessage, reader: jspb.BinaryReader): P2PMessage;
}

export namespace P2PMessage {
  export type AsObject = {
    header?: MsgHeader.AsObject,
    data: Uint8Array | string,
  }
}

export class Ping extends jspb.Message {
  getBestBlockHash(): Uint8Array | string;
  getBestBlockHash_asU8(): Uint8Array;
  getBestBlockHash_asB64(): string;
  setBestBlockHash(value: Uint8Array | string): void;

  getBestHeight(): number;
  setBestHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Ping.AsObject;
  static toObject(includeInstance: boolean, msg: Ping): Ping.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Ping, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Ping;
  static deserializeBinaryFromReader(message: Ping, reader: jspb.BinaryReader): Ping;
}

export namespace Ping {
  export type AsObject = {
    bestBlockHash: Uint8Array | string,
    bestHeight: number,
  }
}

export class Pong extends jspb.Message {
  getBestblockhash(): Uint8Array | string;
  getBestblockhash_asU8(): Uint8Array;
  getBestblockhash_asB64(): string;
  setBestblockhash(value: Uint8Array | string): void;

  getBestheight(): number;
  setBestheight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Pong.AsObject;
  static toObject(includeInstance: boolean, msg: Pong): Pong.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Pong, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Pong;
  static deserializeBinaryFromReader(message: Pong, reader: jspb.BinaryReader): Pong;
}

export namespace Pong {
  export type AsObject = {
    bestblockhash: Uint8Array | string,
    bestheight: number,
  }
}

export class Status extends jspb.Message {
  hasSender(): boolean;
  clearSender(): void;
  getSender(): node_pb.PeerAddress | undefined;
  setSender(value?: node_pb.PeerAddress): void;

  getBestblockhash(): Uint8Array | string;
  getBestblockhash_asU8(): Uint8Array;
  getBestblockhash_asB64(): string;
  setBestblockhash(value: Uint8Array | string): void;

  getBestheight(): number;
  setBestheight(value: number): void;

  getChainid(): Uint8Array | string;
  getChainid_asU8(): Uint8Array;
  getChainid_asB64(): string;
  setChainid(value: Uint8Array | string): void;

  getNoexpose(): boolean;
  setNoexpose(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Status.AsObject;
  static toObject(includeInstance: boolean, msg: Status): Status.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Status, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Status;
  static deserializeBinaryFromReader(message: Status, reader: jspb.BinaryReader): Status;
}

export namespace Status {
  export type AsObject = {
    sender?: node_pb.PeerAddress.AsObject,
    bestblockhash: Uint8Array | string,
    bestheight: number,
    chainid: Uint8Array | string,
    noexpose: boolean,
  }
}

export class GoAwayNotice extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GoAwayNotice.AsObject;
  static toObject(includeInstance: boolean, msg: GoAwayNotice): GoAwayNotice.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GoAwayNotice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GoAwayNotice;
  static deserializeBinaryFromReader(message: GoAwayNotice, reader: jspb.BinaryReader): GoAwayNotice;
}

export namespace GoAwayNotice {
  export type AsObject = {
    message: string,
  }
}

export class AddressesRequest extends jspb.Message {
  hasSender(): boolean;
  clearSender(): void;
  getSender(): node_pb.PeerAddress | undefined;
  setSender(value?: node_pb.PeerAddress): void;

  getMaxsize(): number;
  setMaxsize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddressesRequest): AddressesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressesRequest;
  static deserializeBinaryFromReader(message: AddressesRequest, reader: jspb.BinaryReader): AddressesRequest;
}

export namespace AddressesRequest {
  export type AsObject = {
    sender?: node_pb.PeerAddress.AsObject,
    maxsize: number,
  }
}

export class AddressesResponse extends jspb.Message {
  getStatus(): ResultStatus;
  setStatus(value: ResultStatus): void;

  clearPeersList(): void;
  getPeersList(): Array<node_pb.PeerAddress>;
  setPeersList(value: Array<node_pb.PeerAddress>): void;
  addPeers(value?: node_pb.PeerAddress, index?: number): node_pb.PeerAddress;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddressesResponse): AddressesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressesResponse;
  static deserializeBinaryFromReader(message: AddressesResponse, reader: jspb.BinaryReader): AddressesResponse;
}

export namespace AddressesResponse {
  export type AsObject = {
    status: ResultStatus,
    peersList: Array<node_pb.PeerAddress.AsObject>,
  }
}

export class NewBlockNotice extends jspb.Message {
  getBlockhash(): Uint8Array | string;
  getBlockhash_asU8(): Uint8Array;
  getBlockhash_asB64(): string;
  setBlockhash(value: Uint8Array | string): void;

  getBlockno(): number;
  setBlockno(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NewBlockNotice.AsObject;
  static toObject(includeInstance: boolean, msg: NewBlockNotice): NewBlockNotice.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NewBlockNotice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NewBlockNotice;
  static deserializeBinaryFromReader(message: NewBlockNotice, reader: jspb.BinaryReader): NewBlockNotice;
}

export namespace NewBlockNotice {
  export type AsObject = {
    blockhash: Uint8Array | string,
    blockno: number,
  }
}

export class BlockProducedNotice extends jspb.Message {
  getProducerid(): Uint8Array | string;
  getProducerid_asU8(): Uint8Array;
  getProducerid_asB64(): string;
  setProducerid(value: Uint8Array | string): void;

  getBlockno(): number;
  setBlockno(value: number): void;

  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): blockchain_pb.Block | undefined;
  setBlock(value?: blockchain_pb.Block): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockProducedNotice.AsObject;
  static toObject(includeInstance: boolean, msg: BlockProducedNotice): BlockProducedNotice.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockProducedNotice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockProducedNotice;
  static deserializeBinaryFromReader(message: BlockProducedNotice, reader: jspb.BinaryReader): BlockProducedNotice;
}

export namespace BlockProducedNotice {
  export type AsObject = {
    producerid: Uint8Array | string,
    blockno: number,
    block?: blockchain_pb.Block.AsObject,
  }
}

export class GetBlockHeadersRequest extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getHeight(): number;
  setHeight(value: number): void;

  getOffset(): number;
  setOffset(value: number): void;

  getSize(): number;
  setSize(value: number): void;

  getAsc(): boolean;
  setAsc(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockHeadersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockHeadersRequest): GetBlockHeadersRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockHeadersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockHeadersRequest;
  static deserializeBinaryFromReader(message: GetBlockHeadersRequest, reader: jspb.BinaryReader): GetBlockHeadersRequest;
}

export namespace GetBlockHeadersRequest {
  export type AsObject = {
    hash: Uint8Array | string,
    height: number,
    offset: number,
    size: number,
    asc: boolean,
  }
}

export class GetBlockHeadersResponse extends jspb.Message {
  getStatus(): ResultStatus;
  setStatus(value: ResultStatus): void;

  clearHashesList(): void;
  getHashesList(): Array<Uint8Array | string>;
  getHashesList_asU8(): Array<Uint8Array>;
  getHashesList_asB64(): Array<string>;
  setHashesList(value: Array<Uint8Array | string>): void;
  addHashes(value: Uint8Array | string, index?: number): Uint8Array | string;

  clearHeadersList(): void;
  getHeadersList(): Array<blockchain_pb.BlockHeader>;
  setHeadersList(value: Array<blockchain_pb.BlockHeader>): void;
  addHeaders(value?: blockchain_pb.BlockHeader, index?: number): blockchain_pb.BlockHeader;

  getHasnext(): boolean;
  setHasnext(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockHeadersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockHeadersResponse): GetBlockHeadersResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockHeadersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockHeadersResponse;
  static deserializeBinaryFromReader(message: GetBlockHeadersResponse, reader: jspb.BinaryReader): GetBlockHeadersResponse;
}

export namespace GetBlockHeadersResponse {
  export type AsObject = {
    status: ResultStatus,
    hashesList: Array<Uint8Array | string>,
    headersList: Array<blockchain_pb.BlockHeader.AsObject>,
    hasnext: boolean,
  }
}

export class GetBlockRequest extends jspb.Message {
  clearHashesList(): void;
  getHashesList(): Array<Uint8Array | string>;
  getHashesList_asU8(): Array<Uint8Array>;
  getHashesList_asB64(): Array<string>;
  setHashesList(value: Array<Uint8Array | string>): void;
  addHashes(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockRequest): GetBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockRequest;
  static deserializeBinaryFromReader(message: GetBlockRequest, reader: jspb.BinaryReader): GetBlockRequest;
}

export namespace GetBlockRequest {
  export type AsObject = {
    hashesList: Array<Uint8Array | string>,
  }
}

export class GetBlockResponse extends jspb.Message {
  getStatus(): ResultStatus;
  setStatus(value: ResultStatus): void;

  clearBlocksList(): void;
  getBlocksList(): Array<blockchain_pb.Block>;
  setBlocksList(value: Array<blockchain_pb.Block>): void;
  addBlocks(value?: blockchain_pb.Block, index?: number): blockchain_pb.Block;

  getHasnext(): boolean;
  setHasnext(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockResponse): GetBlockResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockResponse;
  static deserializeBinaryFromReader(message: GetBlockResponse, reader: jspb.BinaryReader): GetBlockResponse;
}

export namespace GetBlockResponse {
  export type AsObject = {
    status: ResultStatus,
    blocksList: Array<blockchain_pb.Block.AsObject>,
    hasnext: boolean,
  }
}

export class NewTransactionsNotice extends jspb.Message {
  clearTxhashesList(): void;
  getTxhashesList(): Array<Uint8Array | string>;
  getTxhashesList_asU8(): Array<Uint8Array>;
  getTxhashesList_asB64(): Array<string>;
  setTxhashesList(value: Array<Uint8Array | string>): void;
  addTxhashes(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NewTransactionsNotice.AsObject;
  static toObject(includeInstance: boolean, msg: NewTransactionsNotice): NewTransactionsNotice.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NewTransactionsNotice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NewTransactionsNotice;
  static deserializeBinaryFromReader(message: NewTransactionsNotice, reader: jspb.BinaryReader): NewTransactionsNotice;
}

export namespace NewTransactionsNotice {
  export type AsObject = {
    txhashesList: Array<Uint8Array | string>,
  }
}

export class GetTransactionsRequest extends jspb.Message {
  clearHashesList(): void;
  getHashesList(): Array<Uint8Array | string>;
  getHashesList_asU8(): Array<Uint8Array>;
  getHashesList_asB64(): Array<string>;
  setHashesList(value: Array<Uint8Array | string>): void;
  addHashes(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsRequest): GetTransactionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTransactionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsRequest;
  static deserializeBinaryFromReader(message: GetTransactionsRequest, reader: jspb.BinaryReader): GetTransactionsRequest;
}

export namespace GetTransactionsRequest {
  export type AsObject = {
    hashesList: Array<Uint8Array | string>,
  }
}

export class GetTransactionsResponse extends jspb.Message {
  getStatus(): ResultStatus;
  setStatus(value: ResultStatus): void;

  clearHashesList(): void;
  getHashesList(): Array<Uint8Array | string>;
  getHashesList_asU8(): Array<Uint8Array>;
  getHashesList_asB64(): Array<string>;
  setHashesList(value: Array<Uint8Array | string>): void;
  addHashes(value: Uint8Array | string, index?: number): Uint8Array | string;

  clearTxsList(): void;
  getTxsList(): Array<blockchain_pb.Tx>;
  setTxsList(value: Array<blockchain_pb.Tx>): void;
  addTxs(value?: blockchain_pb.Tx, index?: number): blockchain_pb.Tx;

  getHasnext(): boolean;
  setHasnext(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsResponse): GetTransactionsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTransactionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsResponse;
  static deserializeBinaryFromReader(message: GetTransactionsResponse, reader: jspb.BinaryReader): GetTransactionsResponse;
}

export namespace GetTransactionsResponse {
  export type AsObject = {
    status: ResultStatus,
    hashesList: Array<Uint8Array | string>,
    txsList: Array<blockchain_pb.Tx.AsObject>,
    hasnext: boolean,
  }
}

export class GetMissingRequest extends jspb.Message {
  clearHashesList(): void;
  getHashesList(): Array<Uint8Array | string>;
  getHashesList_asU8(): Array<Uint8Array>;
  getHashesList_asB64(): Array<string>;
  setHashesList(value: Array<Uint8Array | string>): void;
  addHashes(value: Uint8Array | string, index?: number): Uint8Array | string;

  getStophash(): Uint8Array | string;
  getStophash_asU8(): Uint8Array;
  getStophash_asB64(): string;
  setStophash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMissingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMissingRequest): GetMissingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMissingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMissingRequest;
  static deserializeBinaryFromReader(message: GetMissingRequest, reader: jspb.BinaryReader): GetMissingRequest;
}

export namespace GetMissingRequest {
  export type AsObject = {
    hashesList: Array<Uint8Array | string>,
    stophash: Uint8Array | string,
  }
}

export class GetAncestorRequest extends jspb.Message {
  clearHashesList(): void;
  getHashesList(): Array<Uint8Array | string>;
  getHashesList_asU8(): Array<Uint8Array>;
  getHashesList_asB64(): Array<string>;
  setHashesList(value: Array<Uint8Array | string>): void;
  addHashes(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAncestorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAncestorRequest): GetAncestorRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAncestorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAncestorRequest;
  static deserializeBinaryFromReader(message: GetAncestorRequest, reader: jspb.BinaryReader): GetAncestorRequest;
}

export namespace GetAncestorRequest {
  export type AsObject = {
    hashesList: Array<Uint8Array | string>,
  }
}

export class GetAncestorResponse extends jspb.Message {
  getStatus(): ResultStatus;
  setStatus(value: ResultStatus): void;

  getAncestorhash(): Uint8Array | string;
  getAncestorhash_asU8(): Uint8Array;
  getAncestorhash_asB64(): string;
  setAncestorhash(value: Uint8Array | string): void;

  getAncestorno(): number;
  setAncestorno(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAncestorResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAncestorResponse): GetAncestorResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAncestorResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAncestorResponse;
  static deserializeBinaryFromReader(message: GetAncestorResponse, reader: jspb.BinaryReader): GetAncestorResponse;
}

export namespace GetAncestorResponse {
  export type AsObject = {
    status: ResultStatus,
    ancestorhash: Uint8Array | string,
    ancestorno: number,
  }
}

export class GetHashByNo extends jspb.Message {
  getBlockno(): number;
  setBlockno(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHashByNo.AsObject;
  static toObject(includeInstance: boolean, msg: GetHashByNo): GetHashByNo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetHashByNo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHashByNo;
  static deserializeBinaryFromReader(message: GetHashByNo, reader: jspb.BinaryReader): GetHashByNo;
}

export namespace GetHashByNo {
  export type AsObject = {
    blockno: number,
  }
}

export class GetHashByNoResponse extends jspb.Message {
  getStatus(): ResultStatus;
  setStatus(value: ResultStatus): void;

  getBlockhash(): Uint8Array | string;
  getBlockhash_asU8(): Uint8Array;
  getBlockhash_asB64(): string;
  setBlockhash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHashByNoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetHashByNoResponse): GetHashByNoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetHashByNoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHashByNoResponse;
  static deserializeBinaryFromReader(message: GetHashByNoResponse, reader: jspb.BinaryReader): GetHashByNoResponse;
}

export namespace GetHashByNoResponse {
  export type AsObject = {
    status: ResultStatus,
    blockhash: Uint8Array | string,
  }
}

export class GetHashesRequest extends jspb.Message {
  getPrevhash(): Uint8Array | string;
  getPrevhash_asU8(): Uint8Array;
  getPrevhash_asB64(): string;
  setPrevhash(value: Uint8Array | string): void;

  getPrevnumber(): number;
  setPrevnumber(value: number): void;

  getSize(): number;
  setSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHashesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetHashesRequest): GetHashesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetHashesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHashesRequest;
  static deserializeBinaryFromReader(message: GetHashesRequest, reader: jspb.BinaryReader): GetHashesRequest;
}

export namespace GetHashesRequest {
  export type AsObject = {
    prevhash: Uint8Array | string,
    prevnumber: number,
    size: number,
  }
}

export class GetHashesResponse extends jspb.Message {
  getStatus(): ResultStatus;
  setStatus(value: ResultStatus): void;

  clearHashesList(): void;
  getHashesList(): Array<Uint8Array | string>;
  getHashesList_asU8(): Array<Uint8Array>;
  getHashesList_asB64(): Array<string>;
  setHashesList(value: Array<Uint8Array | string>): void;
  addHashes(value: Uint8Array | string, index?: number): Uint8Array | string;

  getHasnext(): boolean;
  setHasnext(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHashesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetHashesResponse): GetHashesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetHashesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHashesResponse;
  static deserializeBinaryFromReader(message: GetHashesResponse, reader: jspb.BinaryReader): GetHashesResponse;
}

export namespace GetHashesResponse {
  export type AsObject = {
    status: ResultStatus,
    hashesList: Array<Uint8Array | string>,
    hasnext: boolean,
  }
}

export enum ResultStatus {
  OK = 0,
  CANCELED = 1,
  UNKNOWN = 2,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  RESOURCE_EXHAUSTED = 8,
  FAILED_PRECONDITION = 9,
  ABORTED = 10,
  OUT_OF_RANGE = 11,
  UNIMPLEMENTED = 12,
  INTERNAL = 13,
  UNAVAILABLE = 14,
  DATA_LOSS = 15,
  UNAUTHENTICATED = 16,
}

