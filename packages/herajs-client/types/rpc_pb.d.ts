// package: types
// file: rpc.proto

import * as jspb from "google-protobuf";
import * as blockchain_pb from "./blockchain_pb";
import * as account_pb from "./account_pb";
import * as node_pb from "./node_pb";

export class BlockchainStatus extends jspb.Message {
  getBestBlockHash(): Uint8Array | string;
  getBestBlockHash_asU8(): Uint8Array;
  getBestBlockHash_asB64(): string;
  setBestBlockHash(value: Uint8Array | string): void;

  getBestHeight(): number;
  setBestHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockchainStatus.AsObject;
  static toObject(includeInstance: boolean, msg: BlockchainStatus): BlockchainStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockchainStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockchainStatus;
  static deserializeBinaryFromReader(message: BlockchainStatus, reader: jspb.BinaryReader): BlockchainStatus;
}

export namespace BlockchainStatus {
  export type AsObject = {
    bestBlockHash: Uint8Array | string,
    bestHeight: number,
  }
}

export class Input extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  clearAddressList(): void;
  getAddressList(): Array<Uint8Array | string>;
  getAddressList_asU8(): Array<Uint8Array>;
  getAddressList_asB64(): Array<string>;
  setAddressList(value: Array<Uint8Array | string>): void;
  addAddress(value: Uint8Array | string, index?: number): Uint8Array | string;

  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  getScript(): Uint8Array | string;
  getScript_asU8(): Uint8Array;
  getScript_asB64(): string;
  setScript(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Input.AsObject;
  static toObject(includeInstance: boolean, msg: Input): Input.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Input, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Input;
  static deserializeBinaryFromReader(message: Input, reader: jspb.BinaryReader): Input;
}

export namespace Input {
  export type AsObject = {
    hash: Uint8Array | string,
    addressList: Array<Uint8Array | string>,
    value: Uint8Array | string,
    script: Uint8Array | string,
  }
}

export class Output extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getAddress(): Uint8Array | string;
  getAddress_asU8(): Uint8Array;
  getAddress_asB64(): string;
  setAddress(value: Uint8Array | string): void;

  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  getScript(): Uint8Array | string;
  getScript_asU8(): Uint8Array;
  getScript_asB64(): string;
  setScript(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Output.AsObject;
  static toObject(includeInstance: boolean, msg: Output): Output.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Output, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Output;
  static deserializeBinaryFromReader(message: Output, reader: jspb.BinaryReader): Output;
}

export namespace Output {
  export type AsObject = {
    index: number,
    address: Uint8Array | string,
    value: Uint8Array | string,
    script: Uint8Array | string,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class SingleBytes extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SingleBytes.AsObject;
  static toObject(includeInstance: boolean, msg: SingleBytes): SingleBytes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SingleBytes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SingleBytes;
  static deserializeBinaryFromReader(message: SingleBytes, reader: jspb.BinaryReader): SingleBytes;
}

export namespace SingleBytes {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class Personal extends jspb.Message {
  getPassphrase(): string;
  setPassphrase(value: string): void;

  hasAccount(): boolean;
  clearAccount(): void;
  getAccount(): account_pb.Account | undefined;
  setAccount(value?: account_pb.Account): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Personal.AsObject;
  static toObject(includeInstance: boolean, msg: Personal): Personal.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Personal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Personal;
  static deserializeBinaryFromReader(message: Personal, reader: jspb.BinaryReader): Personal;
}

export namespace Personal {
  export type AsObject = {
    passphrase: string,
    account?: account_pb.Account.AsObject,
  }
}

export class PeerList extends jspb.Message {
  clearPeersList(): void;
  getPeersList(): Array<node_pb.PeerAddress>;
  setPeersList(value: Array<node_pb.PeerAddress>): void;
  addPeers(value?: node_pb.PeerAddress, index?: number): node_pb.PeerAddress;

  clearStatesList(): void;
  getStatesList(): Array<number>;
  setStatesList(value: Array<number>): void;
  addStates(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeerList.AsObject;
  static toObject(includeInstance: boolean, msg: PeerList): PeerList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PeerList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeerList;
  static deserializeBinaryFromReader(message: PeerList, reader: jspb.BinaryReader): PeerList;
}

export namespace PeerList {
  export type AsObject = {
    peersList: Array<node_pb.PeerAddress.AsObject>,
    statesList: Array<number>,
  }
}

export class ListParams extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getHeight(): number;
  setHeight(value: number): void;

  getSize(): number;
  setSize(value: number): void;

  getOffset(): number;
  setOffset(value: number): void;

  getAsc(): boolean;
  setAsc(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListParams.AsObject;
  static toObject(includeInstance: boolean, msg: ListParams): ListParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListParams;
  static deserializeBinaryFromReader(message: ListParams, reader: jspb.BinaryReader): ListParams;
}

export namespace ListParams {
  export type AsObject = {
    hash: Uint8Array | string,
    height: number,
    size: number,
    offset: number,
    asc: boolean,
  }
}

export class BlockHeaderList extends jspb.Message {
  clearBlocksList(): void;
  getBlocksList(): Array<blockchain_pb.Block>;
  setBlocksList(value: Array<blockchain_pb.Block>): void;
  addBlocks(value?: blockchain_pb.Block, index?: number): blockchain_pb.Block;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockHeaderList.AsObject;
  static toObject(includeInstance: boolean, msg: BlockHeaderList): BlockHeaderList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockHeaderList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockHeaderList;
  static deserializeBinaryFromReader(message: BlockHeaderList, reader: jspb.BinaryReader): BlockHeaderList;
}

export namespace BlockHeaderList {
  export type AsObject = {
    blocksList: Array<blockchain_pb.Block.AsObject>,
  }
}

export class CommitResult extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getError(): CommitStatus;
  setError(value: CommitStatus): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommitResult.AsObject;
  static toObject(includeInstance: boolean, msg: CommitResult): CommitResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommitResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommitResult;
  static deserializeBinaryFromReader(message: CommitResult, reader: jspb.BinaryReader): CommitResult;
}

export namespace CommitResult {
  export type AsObject = {
    hash: Uint8Array | string,
    error: CommitStatus,
  }
}

export class CommitResultList extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<CommitResult>;
  setResultsList(value: Array<CommitResult>): void;
  addResults(value?: CommitResult, index?: number): CommitResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommitResultList.AsObject;
  static toObject(includeInstance: boolean, msg: CommitResultList): CommitResultList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommitResultList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommitResultList;
  static deserializeBinaryFromReader(message: CommitResultList, reader: jspb.BinaryReader): CommitResultList;
}

export namespace CommitResultList {
  export type AsObject = {
    resultsList: Array<CommitResult.AsObject>,
  }
}

export class VerifyResult extends jspb.Message {
  hasTx(): boolean;
  clearTx(): void;
  getTx(): blockchain_pb.Tx | undefined;
  setTx(value?: blockchain_pb.Tx): void;

  getError(): VerifyStatus;
  setError(value: VerifyStatus): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyResult.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyResult): VerifyResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerifyResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyResult;
  static deserializeBinaryFromReader(message: VerifyResult, reader: jspb.BinaryReader): VerifyResult;
}

export namespace VerifyResult {
  export type AsObject = {
    tx?: blockchain_pb.Tx.AsObject,
    error: VerifyStatus,
  }
}

export enum CommitStatus {
  TX_OK = 0,
  TX_NONCE_TOO_LOW = 1,
  TX_ALREADY_EXISTS = 2,
  TX_INVALID_HASH = 3,
  TX_INVALID_FORMAT = 4,
  TX_INSUFFICIENT_BALANCE = 5,
  TX_INTERNAL_ERROR = 6,
}

export enum VerifyStatus {
  VERIFY_STATUS_OK = 0,
  VERIFY_STATUS_SIGN_NOT_MATCH = 1,
  VERIFY_STATUS_INVALID_HASH = 2,
}

