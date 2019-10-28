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

  getRole(): number;
  setRole(value: number): void;

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
    role: number,
    version: string,
    addressesList: Array<string>,
    produceridsList: Array<Uint8Array | string>,
  }
}

export interface PeerRoleMap {
  LEGACYVERSION: 0;
  PRODUCER: 1;
  WATCHER: 2;
  AGENT: 3;
}

export const PeerRole: PeerRoleMap;

