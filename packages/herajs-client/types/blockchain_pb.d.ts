// package: types
// file: blockchain.proto

import * as jspb from "google-protobuf";

export class Block extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  hasHeader(): boolean;
  clearHeader(): void;
  getHeader(): BlockHeader | undefined;
  setHeader(value?: BlockHeader): void;

  hasBody(): boolean;
  clearBody(): void;
  getBody(): BlockBody | undefined;
  setBody(value?: BlockBody): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    hash: Uint8Array | string,
    header?: BlockHeader.AsObject,
    body?: BlockBody.AsObject,
  }
}

export class BlockHeader extends jspb.Message {
  getPrevblockhash(): Uint8Array | string;
  getPrevblockhash_asU8(): Uint8Array;
  getPrevblockhash_asB64(): string;
  setPrevblockhash(value: Uint8Array | string): void;

  getBlockno(): number;
  setBlockno(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getBlocksroothash(): Uint8Array | string;
  getBlocksroothash_asU8(): Uint8Array;
  getBlocksroothash_asB64(): string;
  setBlocksroothash(value: Uint8Array | string): void;

  getTxsroothash(): Uint8Array | string;
  getTxsroothash_asU8(): Uint8Array;
  getTxsroothash_asB64(): string;
  setTxsroothash(value: Uint8Array | string): void;

  getConfirms(): number;
  setConfirms(value: number): void;

  getPubkey(): Uint8Array | string;
  getPubkey_asU8(): Uint8Array;
  getPubkey_asB64(): string;
  setPubkey(value: Uint8Array | string): void;

  getSign(): Uint8Array | string;
  getSign_asU8(): Uint8Array;
  getSign_asB64(): string;
  setSign(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockHeader.AsObject;
  static toObject(includeInstance: boolean, msg: BlockHeader): BlockHeader.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockHeader, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockHeader;
  static deserializeBinaryFromReader(message: BlockHeader, reader: jspb.BinaryReader): BlockHeader;
}

export namespace BlockHeader {
  export type AsObject = {
    prevblockhash: Uint8Array | string,
    blockno: number,
    timestamp: number,
    blocksroothash: Uint8Array | string,
    txsroothash: Uint8Array | string,
    confirms: number,
    pubkey: Uint8Array | string,
    sign: Uint8Array | string,
  }
}

export class BlockBody extends jspb.Message {
  clearTxsList(): void;
  getTxsList(): Array<Tx>;
  setTxsList(value: Array<Tx>): void;
  addTxs(value?: Tx, index?: number): Tx;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockBody.AsObject;
  static toObject(includeInstance: boolean, msg: BlockBody): BlockBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockBody;
  static deserializeBinaryFromReader(message: BlockBody, reader: jspb.BinaryReader): BlockBody;
}

export namespace BlockBody {
  export type AsObject = {
    txsList: Array<Tx.AsObject>,
  }
}

export class TxList extends jspb.Message {
  clearTxsList(): void;
  getTxsList(): Array<Tx>;
  setTxsList(value: Array<Tx>): void;
  addTxs(value?: Tx, index?: number): Tx;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxList.AsObject;
  static toObject(includeInstance: boolean, msg: TxList): TxList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxList;
  static deserializeBinaryFromReader(message: TxList, reader: jspb.BinaryReader): TxList;
}

export namespace TxList {
  export type AsObject = {
    txsList: Array<Tx.AsObject>,
  }
}

export class Tx extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  hasBody(): boolean;
  clearBody(): void;
  getBody(): TxBody | undefined;
  setBody(value?: TxBody): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tx.AsObject;
  static toObject(includeInstance: boolean, msg: Tx): Tx.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Tx, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tx;
  static deserializeBinaryFromReader(message: Tx, reader: jspb.BinaryReader): Tx;
}

export namespace Tx {
  export type AsObject = {
    hash: Uint8Array | string,
    body?: TxBody.AsObject,
  }
}

export class TxBody extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getAccount(): Uint8Array | string;
  getAccount_asU8(): Uint8Array;
  getAccount_asB64(): string;
  setAccount(value: Uint8Array | string): void;

  getRecipient(): Uint8Array | string;
  getRecipient_asU8(): Uint8Array;
  getRecipient_asB64(): string;
  setRecipient(value: Uint8Array | string): void;

  getAmount(): number;
  setAmount(value: number): void;

  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): void;

  getLimit(): number;
  setLimit(value: number): void;

  getPrice(): number;
  setPrice(value: number): void;

  getType(): TxType;
  setType(value: TxType): void;

  getSign(): Uint8Array | string;
  getSign_asU8(): Uint8Array;
  getSign_asB64(): string;
  setSign(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxBody.AsObject;
  static toObject(includeInstance: boolean, msg: TxBody): TxBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxBody;
  static deserializeBinaryFromReader(message: TxBody, reader: jspb.BinaryReader): TxBody;
}

export namespace TxBody {
  export type AsObject = {
    nonce: number,
    account: Uint8Array | string,
    recipient: Uint8Array | string,
    amount: number,
    payload: Uint8Array | string,
    limit: number,
    price: number,
    type: TxType,
    sign: Uint8Array | string,
  }
}

export class TxIdx extends jspb.Message {
  getBlockhash(): Uint8Array | string;
  getBlockhash_asU8(): Uint8Array;
  getBlockhash_asB64(): string;
  setBlockhash(value: Uint8Array | string): void;

  getIdx(): number;
  setIdx(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxIdx.AsObject;
  static toObject(includeInstance: boolean, msg: TxIdx): TxIdx.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxIdx, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxIdx;
  static deserializeBinaryFromReader(message: TxIdx, reader: jspb.BinaryReader): TxIdx;
}

export namespace TxIdx {
  export type AsObject = {
    blockhash: Uint8Array | string,
    idx: number,
  }
}

export class TxInBlock extends jspb.Message {
  hasTxidx(): boolean;
  clearTxidx(): void;
  getTxidx(): TxIdx | undefined;
  setTxidx(value?: TxIdx): void;

  hasTx(): boolean;
  clearTx(): void;
  getTx(): Tx | undefined;
  setTx(value?: Tx): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxInBlock.AsObject;
  static toObject(includeInstance: boolean, msg: TxInBlock): TxInBlock.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxInBlock, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxInBlock;
  static deserializeBinaryFromReader(message: TxInBlock, reader: jspb.BinaryReader): TxInBlock;
}

export namespace TxInBlock {
  export type AsObject = {
    txidx?: TxIdx.AsObject,
    tx?: Tx.AsObject,
  }
}

export class State extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getBalance(): number;
  setBalance(value: number): void;

  getCodehash(): Uint8Array | string;
  getCodehash_asU8(): Uint8Array;
  getCodehash_asB64(): string;
  setCodehash(value: Uint8Array | string): void;

  getStorageroot(): Uint8Array | string;
  getStorageroot_asU8(): Uint8Array;
  getStorageroot_asB64(): string;
  setStorageroot(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): State.AsObject;
  static toObject(includeInstance: boolean, msg: State): State.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: State, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): State;
  static deserializeBinaryFromReader(message: State, reader: jspb.BinaryReader): State;
}

export namespace State {
  export type AsObject = {
    nonce: number,
    balance: number,
    codehash: Uint8Array | string,
    storageroot: Uint8Array | string,
  }
}

export class Receipt extends jspb.Message {
  getContractaddress(): Uint8Array | string;
  getContractaddress_asU8(): Uint8Array;
  getContractaddress_asB64(): string;
  setContractaddress(value: Uint8Array | string): void;

  getStatus(): string;
  setStatus(value: string): void;

  getRet(): string;
  setRet(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Receipt.AsObject;
  static toObject(includeInstance: boolean, msg: Receipt): Receipt.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Receipt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Receipt;
  static deserializeBinaryFromReader(message: Receipt, reader: jspb.BinaryReader): Receipt;
}

export namespace Receipt {
  export type AsObject = {
    contractaddress: Uint8Array | string,
    status: string,
    ret: string,
  }
}

export class Vote extends jspb.Message {
  getCandidate(): Uint8Array | string;
  getCandidate_asU8(): Uint8Array;
  getCandidate_asB64(): string;
  setCandidate(value: Uint8Array | string): void;

  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vote.AsObject;
  static toObject(includeInstance: boolean, msg: Vote): Vote.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vote, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vote;
  static deserializeBinaryFromReader(message: Vote, reader: jspb.BinaryReader): Vote;
}

export namespace Vote {
  export type AsObject = {
    candidate: Uint8Array | string,
    amount: number,
  }
}

export class VoteList extends jspb.Message {
  clearVotesList(): void;
  getVotesList(): Array<Vote>;
  setVotesList(value: Array<Vote>): void;
  addVotes(value?: Vote, index?: number): Vote;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VoteList.AsObject;
  static toObject(includeInstance: boolean, msg: VoteList): VoteList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VoteList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VoteList;
  static deserializeBinaryFromReader(message: VoteList, reader: jspb.BinaryReader): VoteList;
}

export namespace VoteList {
  export type AsObject = {
    votesList: Array<Vote.AsObject>,
  }
}

export class FnArgument extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FnArgument.AsObject;
  static toObject(includeInstance: boolean, msg: FnArgument): FnArgument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FnArgument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FnArgument;
  static deserializeBinaryFromReader(message: FnArgument, reader: jspb.BinaryReader): FnArgument;
}

export namespace FnArgument {
  export type AsObject = {
    name: string,
  }
}

export class Function extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<FnArgument>;
  setArgumentsList(value: Array<FnArgument>): void;
  addArguments(value?: FnArgument, index?: number): FnArgument;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Function.AsObject;
  static toObject(includeInstance: boolean, msg: Function): Function.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Function, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Function;
  static deserializeBinaryFromReader(message: Function, reader: jspb.BinaryReader): Function;
}

export namespace Function {
  export type AsObject = {
    name: string,
    argumentsList: Array<FnArgument.AsObject>,
  }
}

export class ABI extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  getLanguage(): string;
  setLanguage(value: string): void;

  clearFunctionsList(): void;
  getFunctionsList(): Array<Function>;
  setFunctionsList(value: Array<Function>): void;
  addFunctions(value?: Function, index?: number): Function;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ABI.AsObject;
  static toObject(includeInstance: boolean, msg: ABI): ABI.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ABI, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ABI;
  static deserializeBinaryFromReader(message: ABI, reader: jspb.BinaryReader): ABI;
}

export namespace ABI {
  export type AsObject = {
    version: string,
    language: string,
    functionsList: Array<Function.AsObject>,
  }
}

export class Query extends jspb.Message {
  getContractaddress(): Uint8Array | string;
  getContractaddress_asU8(): Uint8Array;
  getContractaddress_asB64(): string;
  setContractaddress(value: Uint8Array | string): void;

  getQueryinfo(): Uint8Array | string;
  getQueryinfo_asU8(): Uint8Array;
  getQueryinfo_asB64(): string;
  setQueryinfo(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Query.AsObject;
  static toObject(includeInstance: boolean, msg: Query): Query.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Query, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Query;
  static deserializeBinaryFromReader(message: Query, reader: jspb.BinaryReader): Query;
}

export namespace Query {
  export type AsObject = {
    contractaddress: Uint8Array | string,
    queryinfo: Uint8Array | string,
  }
}

export enum TxType {
  NORMAL = 0,
  GOVERNANCE = 1,
}

