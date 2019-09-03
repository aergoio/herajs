// package: types
// file: raft.proto

import * as jspb from "google-protobuf";
import * as p2p_pb from "./p2p_pb";

export class MemberAttr extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

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
    address: string,
    peerid: Uint8Array | string,
  }
}

export class MembershipChange extends jspb.Message {
  getType(): MembershipChangeTypeMap[keyof MembershipChangeTypeMap];
  setType(value: MembershipChangeTypeMap[keyof MembershipChangeTypeMap]): void;

  getRequestid(): number;
  setRequestid(value: number): void;

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
    requestid: number,
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

  getClusterid(): number;
  setClusterid(value: number): void;

  getError(): string;
  setError(value: string): void;

  clearMbrattrsList(): void;
  getMbrattrsList(): Array<MemberAttr>;
  setMbrattrsList(value: Array<MemberAttr>): void;
  addMbrattrs(value?: MemberAttr, index?: number): MemberAttr;

  getBestblockno(): number;
  setBestblockno(value: number): void;

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
    clusterid: number,
    error: string,
    mbrattrsList: Array<MemberAttr.AsObject>,
    bestblockno: number,
    hardstateinfo?: HardStateInfo.AsObject,
  }
}

export class ConfChangeProgress extends jspb.Message {
  getState(): ConfChangeStateMap[keyof ConfChangeStateMap];
  setState(value: ConfChangeStateMap[keyof ConfChangeStateMap]): void;

  getErr(): string;
  setErr(value: string): void;

  clearMembersList(): void;
  getMembersList(): Array<MemberAttr>;
  setMembersList(value: Array<MemberAttr>): void;
  addMembers(value?: MemberAttr, index?: number): MemberAttr;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfChangeProgress.AsObject;
  static toObject(includeInstance: boolean, msg: ConfChangeProgress): ConfChangeProgress.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConfChangeProgress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfChangeProgress;
  static deserializeBinaryFromReader(message: ConfChangeProgress, reader: jspb.BinaryReader): ConfChangeProgress;
}

export namespace ConfChangeProgress {
  export type AsObject = {
    state: ConfChangeStateMap[keyof ConfChangeStateMap],
    err: string,
    membersList: Array<MemberAttr.AsObject>,
  }
}

export class SnapshotResponse extends jspb.Message {
  getStatus(): p2p_pb.ResultStatusMap[keyof p2p_pb.ResultStatusMap];
  setStatus(value: p2p_pb.ResultStatusMap[keyof p2p_pb.ResultStatusMap]): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SnapshotResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SnapshotResponse): SnapshotResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SnapshotResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SnapshotResponse;
  static deserializeBinaryFromReader(message: SnapshotResponse, reader: jspb.BinaryReader): SnapshotResponse;
}

export namespace SnapshotResponse {
  export type AsObject = {
    status: p2p_pb.ResultStatusMap[keyof p2p_pb.ResultStatusMap],
    message: string,
  }
}

export interface MembershipChangeTypeMap {
  ADD_MEMBER: 0;
  REMOVE_MEMBER: 1;
}

export const MembershipChangeType: MembershipChangeTypeMap;

export interface ConfChangeStateMap {
  CONF_CHANGE_STATE_PROPOSED: 0;
  CONF_CHANGE_STATE_SAVED: 1;
  CONF_CHANGE_STATE_APPLIED: 2;
}

export const ConfChangeState: ConfChangeStateMap;

