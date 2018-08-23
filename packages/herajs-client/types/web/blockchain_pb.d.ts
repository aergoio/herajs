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

  getSign(): Uint8Array | string;
  getSign_asU8(): Uint8Array;
  getSign_asB64(): string;
  setSign(value: Uint8Array | string): void;

  getType(): TxType;
  setType(value: TxType): void;

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
    sign: Uint8Array | string,
    type: TxType,
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
  getAccount(): Uint8Array | string;
  getAccount_asU8(): Uint8Array;
  getAccount_asB64(): string;
  setAccount(value: Uint8Array | string): void;

  getNonce(): number;
  setNonce(value: number): void;

  getBalance(): number;
  setBalance(value: number): void;

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
    account: Uint8Array | string,
    nonce: number,
    balance: number,
  }
}

export enum TxType {
  NORMAL = 0,
  GOVERNANCE = 1,
}

