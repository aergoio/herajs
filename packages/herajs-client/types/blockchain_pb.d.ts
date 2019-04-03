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
  getChainid(): Uint8Array | string;
  getChainid_asU8(): Uint8Array;
  getChainid_asB64(): string;
  setChainid(value: Uint8Array | string): void;

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

  getReceiptsroothash(): Uint8Array | string;
  getReceiptsroothash_asU8(): Uint8Array;
  getReceiptsroothash_asB64(): string;
  setReceiptsroothash(value: Uint8Array | string): void;

  getConfirms(): number;
  setConfirms(value: number): void;

  getPubkey(): Uint8Array | string;
  getPubkey_asU8(): Uint8Array;
  getPubkey_asB64(): string;
  setPubkey(value: Uint8Array | string): void;

  getCoinbaseaccount(): Uint8Array | string;
  getCoinbaseaccount_asU8(): Uint8Array;
  getCoinbaseaccount_asB64(): string;
  setCoinbaseaccount(value: Uint8Array | string): void;

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
    chainid: Uint8Array | string,
    prevblockhash: Uint8Array | string,
    blockno: number,
    timestamp: number,
    blocksroothash: Uint8Array | string,
    txsroothash: Uint8Array | string,
    receiptsroothash: Uint8Array | string,
    confirms: number,
    pubkey: Uint8Array | string,
    coinbaseaccount: Uint8Array | string,
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

  getAmount(): Uint8Array | string;
  getAmount_asU8(): Uint8Array;
  getAmount_asB64(): string;
  setAmount(value: Uint8Array | string): void;

  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): void;

  getGaslimit(): number;
  setGaslimit(value: number): void;

  getGasprice(): Uint8Array | string;
  getGasprice_asU8(): Uint8Array;
  getGasprice_asB64(): string;
  setGasprice(value: Uint8Array | string): void;

  getType(): TxType;
  setType(value: TxType): void;

  getChainidhash(): Uint8Array | string;
  getChainidhash_asU8(): Uint8Array;
  getChainidhash_asB64(): string;
  setChainidhash(value: Uint8Array | string): void;

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
    amount: Uint8Array | string,
    payload: Uint8Array | string,
    gaslimit: number,
    gasprice: Uint8Array | string,
    type: TxType,
    chainidhash: Uint8Array | string,
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

  getBalance(): Uint8Array | string;
  getBalance_asU8(): Uint8Array;
  getBalance_asB64(): string;
  setBalance(value: Uint8Array | string): void;

  getCodehash(): Uint8Array | string;
  getCodehash_asU8(): Uint8Array;
  getCodehash_asB64(): string;
  setCodehash(value: Uint8Array | string): void;

  getStorageroot(): Uint8Array | string;
  getStorageroot_asU8(): Uint8Array;
  getStorageroot_asB64(): string;
  setStorageroot(value: Uint8Array | string): void;

  getSqlrecoverypoint(): number;
  setSqlrecoverypoint(value: number): void;

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
    balance: Uint8Array | string,
    codehash: Uint8Array | string,
    storageroot: Uint8Array | string,
    sqlrecoverypoint: number,
  }
}

export class AccountProof extends jspb.Message {
  hasState(): boolean;
  clearState(): void;
  getState(): State | undefined;
  setState(value?: State): void;

  getInclusion(): boolean;
  setInclusion(value: boolean): void;

  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): void;

  getProofkey(): Uint8Array | string;
  getProofkey_asU8(): Uint8Array;
  getProofkey_asB64(): string;
  setProofkey(value: Uint8Array | string): void;

  getProofval(): Uint8Array | string;
  getProofval_asU8(): Uint8Array;
  getProofval_asB64(): string;
  setProofval(value: Uint8Array | string): void;

  getBitmap(): Uint8Array | string;
  getBitmap_asU8(): Uint8Array;
  getBitmap_asB64(): string;
  setBitmap(value: Uint8Array | string): void;

  getHeight(): number;
  setHeight(value: number): void;

  clearAuditpathList(): void;
  getAuditpathList(): Array<Uint8Array | string>;
  getAuditpathList_asU8(): Array<Uint8Array>;
  getAuditpathList_asB64(): Array<string>;
  setAuditpathList(value: Array<Uint8Array | string>): void;
  addAuditpath(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountProof.AsObject;
  static toObject(includeInstance: boolean, msg: AccountProof): AccountProof.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AccountProof, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountProof;
  static deserializeBinaryFromReader(message: AccountProof, reader: jspb.BinaryReader): AccountProof;
}

export namespace AccountProof {
  export type AsObject = {
    state?: State.AsObject,
    inclusion: boolean,
    key: Uint8Array | string,
    proofkey: Uint8Array | string,
    proofval: Uint8Array | string,
    bitmap: Uint8Array | string,
    height: number,
    auditpathList: Array<Uint8Array | string>,
  }
}

export class ContractVarProof extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  getInclusion(): boolean;
  setInclusion(value: boolean): void;

  getKey(): string;
  setKey(value: string): void;

  getProofkey(): Uint8Array | string;
  getProofkey_asU8(): Uint8Array;
  getProofkey_asB64(): string;
  setProofkey(value: Uint8Array | string): void;

  getProofval(): Uint8Array | string;
  getProofval_asU8(): Uint8Array;
  getProofval_asB64(): string;
  setProofval(value: Uint8Array | string): void;

  getBitmap(): Uint8Array | string;
  getBitmap_asU8(): Uint8Array;
  getBitmap_asB64(): string;
  setBitmap(value: Uint8Array | string): void;

  getHeight(): number;
  setHeight(value: number): void;

  clearAuditpathList(): void;
  getAuditpathList(): Array<Uint8Array | string>;
  getAuditpathList_asU8(): Array<Uint8Array>;
  getAuditpathList_asB64(): Array<string>;
  setAuditpathList(value: Array<Uint8Array | string>): void;
  addAuditpath(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContractVarProof.AsObject;
  static toObject(includeInstance: boolean, msg: ContractVarProof): ContractVarProof.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ContractVarProof, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContractVarProof;
  static deserializeBinaryFromReader(message: ContractVarProof, reader: jspb.BinaryReader): ContractVarProof;
}

export namespace ContractVarProof {
  export type AsObject = {
    value: Uint8Array | string,
    inclusion: boolean,
    key: string,
    proofkey: Uint8Array | string,
    proofval: Uint8Array | string,
    bitmap: Uint8Array | string,
    height: number,
    auditpathList: Array<Uint8Array | string>,
  }
}

export class StateQueryProof extends jspb.Message {
  hasContractproof(): boolean;
  clearContractproof(): void;
  getContractproof(): AccountProof | undefined;
  setContractproof(value?: AccountProof): void;

  clearVarproofsList(): void;
  getVarproofsList(): Array<ContractVarProof>;
  setVarproofsList(value: Array<ContractVarProof>): void;
  addVarproofs(value?: ContractVarProof, index?: number): ContractVarProof;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StateQueryProof.AsObject;
  static toObject(includeInstance: boolean, msg: StateQueryProof): StateQueryProof.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StateQueryProof, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StateQueryProof;
  static deserializeBinaryFromReader(message: StateQueryProof, reader: jspb.BinaryReader): StateQueryProof;
}

export namespace StateQueryProof {
  export type AsObject = {
    contractproof?: AccountProof.AsObject,
    varproofsList: Array<ContractVarProof.AsObject>,
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

  getTxhash(): Uint8Array | string;
  getTxhash_asU8(): Uint8Array;
  getTxhash_asB64(): string;
  setTxhash(value: Uint8Array | string): void;

  getFeeused(): Uint8Array | string;
  getFeeused_asU8(): Uint8Array;
  getFeeused_asB64(): string;
  setFeeused(value: Uint8Array | string): void;

  getCumulativefeeused(): Uint8Array | string;
  getCumulativefeeused_asU8(): Uint8Array;
  getCumulativefeeused_asB64(): string;
  setCumulativefeeused(value: Uint8Array | string): void;

  getBloom(): Uint8Array | string;
  getBloom_asU8(): Uint8Array;
  getBloom_asB64(): string;
  setBloom(value: Uint8Array | string): void;

  clearEventsList(): void;
  getEventsList(): Array<Event>;
  setEventsList(value: Array<Event>): void;
  addEvents(value?: Event, index?: number): Event;

  getBlockno(): number;
  setBlockno(value: number): void;

  getBlockhash(): Uint8Array | string;
  getBlockhash_asU8(): Uint8Array;
  getBlockhash_asB64(): string;
  setBlockhash(value: Uint8Array | string): void;

  getTxindex(): number;
  setTxindex(value: number): void;

  getFrom(): Uint8Array | string;
  getFrom_asU8(): Uint8Array;
  getFrom_asB64(): string;
  setFrom(value: Uint8Array | string): void;

  getTo(): Uint8Array | string;
  getTo_asU8(): Uint8Array;
  getTo_asB64(): string;
  setTo(value: Uint8Array | string): void;

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
    txhash: Uint8Array | string,
    feeused: Uint8Array | string,
    cumulativefeeused: Uint8Array | string,
    bloom: Uint8Array | string,
    eventsList: Array<Event.AsObject>,
    blockno: number,
    blockhash: Uint8Array | string,
    txindex: number,
    from: Uint8Array | string,
    to: Uint8Array | string,
  }
}

export class Event extends jspb.Message {
  getContractaddress(): Uint8Array | string;
  getContractaddress_asU8(): Uint8Array;
  getContractaddress_asB64(): string;
  setContractaddress(value: Uint8Array | string): void;

  getEventname(): string;
  setEventname(value: string): void;

  getJsonargs(): string;
  setJsonargs(value: string): void;

  getEventidx(): number;
  setEventidx(value: number): void;

  getTxhash(): Uint8Array | string;
  getTxhash_asU8(): Uint8Array;
  getTxhash_asB64(): string;
  setTxhash(value: Uint8Array | string): void;

  getBlockhash(): Uint8Array | string;
  getBlockhash_asU8(): Uint8Array;
  getBlockhash_asB64(): string;
  setBlockhash(value: Uint8Array | string): void;

  getBlockno(): number;
  setBlockno(value: number): void;

  getTxindex(): number;
  setTxindex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Event.AsObject;
  static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Event;
  static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
  export type AsObject = {
    contractaddress: Uint8Array | string,
    eventname: string,
    jsonargs: string,
    eventidx: number,
    txhash: Uint8Array | string,
    blockhash: Uint8Array | string,
    blockno: number,
    txindex: number,
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

  getPayable(): boolean;
  setPayable(value: boolean): void;

  getView(): boolean;
  setView(value: boolean): void;

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
    payable: boolean,
    view: boolean,
  }
}

export class StateVar extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getType(): string;
  setType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StateVar.AsObject;
  static toObject(includeInstance: boolean, msg: StateVar): StateVar.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StateVar, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StateVar;
  static deserializeBinaryFromReader(message: StateVar, reader: jspb.BinaryReader): StateVar;
}

export namespace StateVar {
  export type AsObject = {
    name: string,
    type: string,
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

  clearStateVariablesList(): void;
  getStateVariablesList(): Array<StateVar>;
  setStateVariablesList(value: Array<StateVar>): void;
  addStateVariables(value?: StateVar, index?: number): StateVar;

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
    stateVariablesList: Array<StateVar.AsObject>,
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

export class StateQuery extends jspb.Message {
  getContractaddress(): Uint8Array | string;
  getContractaddress_asU8(): Uint8Array;
  getContractaddress_asB64(): string;
  setContractaddress(value: Uint8Array | string): void;

  clearStoragekeysList(): void;
  getStoragekeysList(): Array<string>;
  setStoragekeysList(value: Array<string>): void;
  addStoragekeys(value: string, index?: number): string;

  getRoot(): Uint8Array | string;
  getRoot_asU8(): Uint8Array;
  getRoot_asB64(): string;
  setRoot(value: Uint8Array | string): void;

  getCompressed(): boolean;
  setCompressed(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StateQuery.AsObject;
  static toObject(includeInstance: boolean, msg: StateQuery): StateQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StateQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StateQuery;
  static deserializeBinaryFromReader(message: StateQuery, reader: jspb.BinaryReader): StateQuery;
}

export namespace StateQuery {
  export type AsObject = {
    contractaddress: Uint8Array | string,
    storagekeysList: Array<string>,
    root: Uint8Array | string,
    compressed: boolean,
  }
}

export class FilterInfo extends jspb.Message {
  getContractaddress(): Uint8Array | string;
  getContractaddress_asU8(): Uint8Array;
  getContractaddress_asB64(): string;
  setContractaddress(value: Uint8Array | string): void;

  getEventname(): string;
  setEventname(value: string): void;

  getBlockfrom(): number;
  setBlockfrom(value: number): void;

  getBlockto(): number;
  setBlockto(value: number): void;

  getDesc(): boolean;
  setDesc(value: boolean): void;

  getArgfilter(): Uint8Array | string;
  getArgfilter_asU8(): Uint8Array;
  getArgfilter_asB64(): string;
  setArgfilter(value: Uint8Array | string): void;

  getRecentblockcnt(): number;
  setRecentblockcnt(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FilterInfo.AsObject;
  static toObject(includeInstance: boolean, msg: FilterInfo): FilterInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FilterInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FilterInfo;
  static deserializeBinaryFromReader(message: FilterInfo, reader: jspb.BinaryReader): FilterInfo;
}

export namespace FilterInfo {
  export type AsObject = {
    contractaddress: Uint8Array | string,
    eventname: string,
    blockfrom: number,
    blockto: number,
    desc: boolean,
    argfilter: Uint8Array | string,
    recentblockcnt: number,
  }
}

export enum TxType {
  NORMAL = 0,
  GOVERNANCE = 1,
}

