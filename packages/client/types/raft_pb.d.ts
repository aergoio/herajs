// package: types
// file: raft.proto

import * as jspb from "google-protobuf";
import * as p2p_pb from "./p2p_pb";

export class MemberAttr extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getUrl(): string;
  setUrl(value: string): void;

  getPeerid(): Uint8Array | string;
  getPeerid_asU8(): Uint8Array;
  getPeerid_asB64(): string;
  setPeerid(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MemberAttr.AsObject;
  static toObject(includeInstance: boolean, msg: MemberAttr): MemberAttr.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MemberAttr, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MemberAttr;
  static deserializeBinaryFromReader(message: MemberAttr, reader: jspb.BinaryReader): MemberAttr;
}

export namespace MemberAttr {
  export type AsObject = {
    id: number,
    name: string,
    url: string,
    peerid: Uint8Array | string,
  }
}

export class MembershipChange extends jspb.Message {
  getType(): MembershipChangeTypeMap[keyof MembershipChangeTypeMap];
  setType(value: MembershipChangeTypeMap[keyof MembershipChangeTypeMap]): void;

  hasAttr(): boolean;
  clearAttr(): void;
  getAttr(): MemberAttr | undefined;
  setAttr(value?: MemberAttr): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MembershipChange.AsObject;
  static toObject(includeInstance: boolean, msg: MembershipChange): MembershipChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MembershipChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MembershipChange;
  static deserializeBinaryFromReader(message: MembershipChange, reader: jspb.BinaryReader): MembershipChange;
}

export namespace MembershipChange {
  export type AsObject = {
    type: MembershipChangeTypeMap[keyof MembershipChangeTypeMap],
    attr?: MemberAttr.AsObject,
  }
}

export class MembershipChangeReply extends jspb.Message {
  hasAttr(): boolean;
  clearAttr(): void;
  getAttr(): MemberAttr | undefined;
  setAttr(value?: MemberAttr): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MembershipChangeReply.AsObject;
  static toObject(includeInstance: boolean, msg: MembershipChangeReply): MembershipChangeReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MembershipChangeReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MembershipChangeReply;
  static deserializeBinaryFromReader(message: MembershipChangeReply, reader: jspb.BinaryReader): MembershipChangeReply;
}

export namespace MembershipChangeReply {
  export type AsObject = {
    attr?: MemberAttr.AsObject,
  }
}

export class HardStateInfo extends jspb.Message {
  getTerm(): number;
  setTerm(value: number): void;

  getCommit(): number;
  setCommit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HardStateInfo.AsObject;
  static toObject(includeInstance: boolean, msg: HardStateInfo): HardStateInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HardStateInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HardStateInfo;
  static deserializeBinaryFromReader(message: HardStateInfo, reader: jspb.BinaryReader): HardStateInfo;
}

export namespace HardStateInfo {
  export type AsObject = {
    term: number,
    commit: number,
  }
}

export class GetClusterInfoRequest extends jspb.Message {
  getBestblockhash(): Uint8Array | string;
  getBestblockhash_asU8(): Uint8Array;
  getBestblockhash_asB64(): string;
  setBestblockhash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetClusterInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetClusterInfoRequest): GetClusterInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetClusterInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetClusterInfoRequest;
  static deserializeBinaryFromReader(message: GetClusterInfoRequest, reader: jspb.BinaryReader): GetClusterInfoRequest;
}

export namespace GetClusterInfoRequest {
  export type AsObject = {
    bestblockhash: Uint8Array | string,
  }
}

export class GetClusterInfoResponse extends jspb.Message {
  getChainid(): Uint8Array | string;
  getChainid_asU8(): Uint8Array;
  getChainid_asB64(): string;
  setChainid(value: Uint8Array | string): void;

  getError(): string;
  setError(value: string): void;

  clearMbrattrsList(): void;
  getMbrattrsList(): Array<MemberAttr>;
  setMbrattrsList(value: Array<MemberAttr>): void;
  addMbrattrs(value?: MemberAttr, index?: number): MemberAttr;

  hasHardstateinfo(): boolean;
  clearHardstateinfo(): void;
  getHardstateinfo(): HardStateInfo | undefined;
  setHardstateinfo(value?: HardStateInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetClusterInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetClusterInfoResponse): GetClusterInfoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetClusterInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetClusterInfoResponse;
  static deserializeBinaryFromReader(message: GetClusterInfoResponse, reader: jspb.BinaryReader): GetClusterInfoResponse;
}

export namespace GetClusterInfoResponse {
  export type AsObject = {
    chainid: Uint8Array | string,
    error: string,
    mbrattrsList: Array<MemberAttr.AsObject>,
    hardstateinfo?: HardStateInfo.AsObject,
  }
}

export interface MembershipChangeTypeMap {
  ADD_MEMBER: 0;
  REMOVE_MEMBER: 1;
}

export const MembershipChangeType: MembershipChangeTypeMap;

