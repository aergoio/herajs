// package: types
// file: node.proto

import * as jspb from "google-protobuf";

export class PeerAddress extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  getPort(): number;
  setPort(value: number): void;

  getPeerid(): Uint8Array | string;
  getPeerid_asU8(): Uint8Array;
  getPeerid_asB64(): string;
  setPeerid(value: Uint8Array | string): void;

  getRole(): PeerRoleMap[keyof PeerRoleMap];
  setRole(value: PeerRoleMap[keyof PeerRoleMap]): void;

  getVersion(): string;
  setVersion(value: string): void;

  clearAddressesList(): void;
  getAddressesList(): Array<string>;
  setAddressesList(value: Array<string>): void;
  addAddresses(value: string, index?: number): string;

  clearProduceridsList(): void;
  getProduceridsList(): Array<Uint8Array | string>;
  getProduceridsList_asU8(): Array<Uint8Array>;
  getProduceridsList_asB64(): Array<string>;
  setProduceridsList(value: Array<Uint8Array | string>): void;
  addProducerids(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeerAddress.AsObject;
  static toObject(includeInstance: boolean, msg: PeerAddress): PeerAddress.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PeerAddress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeerAddress;
  static deserializeBinaryFromReader(message: PeerAddress, reader: jspb.BinaryReader): PeerAddress;
}

export namespace PeerAddress {
  export type AsObject = {
    address: string,
    port: number,
    peerid: Uint8Array | string,
    role: PeerRoleMap[keyof PeerRoleMap],
    version: string,
    addressesList: Array<string>,
    produceridsList: Array<Uint8Array | string>,
  }
}

export class AgentCertificate extends jspb.Message {
  getCertversion(): number;
  setCertversion(value: number): void;

  getBpid(): Uint8Array | string;
  getBpid_asU8(): Uint8Array;
  getBpid_asB64(): string;
  setBpid(value: Uint8Array | string): void;

  getBppubkey(): Uint8Array | string;
  getBppubkey_asU8(): Uint8Array;
  getBppubkey_asB64(): string;
  setBppubkey(value: Uint8Array | string): void;

  getCreatetime(): number;
  setCreatetime(value: number): void;

  getExpiretime(): number;
  setExpiretime(value: number): void;

  getAgentid(): Uint8Array | string;
  getAgentid_asU8(): Uint8Array;
  getAgentid_asB64(): string;
  setAgentid(value: Uint8Array | string): void;

  clearAgentaddressList(): void;
  getAgentaddressList(): Array<Uint8Array | string>;
  getAgentaddressList_asU8(): Array<Uint8Array>;
  getAgentaddressList_asB64(): Array<string>;
  setAgentaddressList(value: Array<Uint8Array | string>): void;
  addAgentaddress(value: Uint8Array | string, index?: number): Uint8Array | string;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCertificate.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCertificate): AgentCertificate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AgentCertificate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCertificate;
  static deserializeBinaryFromReader(message: AgentCertificate, reader: jspb.BinaryReader): AgentCertificate;
}

export namespace AgentCertificate {
  export type AsObject = {
    certversion: number,
    bpid: Uint8Array | string,
    bppubkey: Uint8Array | string,
    createtime: number,
    expiretime: number,
    agentid: Uint8Array | string,
    agentaddressList: Array<Uint8Array | string>,
    signature: Uint8Array | string,
  }
}

export interface PeerRoleMap {
  LEGACYVERSION: 0;
  PRODUCER: 1;
  WATCHER: 2;
  AGENT: 3;
}

export const PeerRole: PeerRoleMap;

