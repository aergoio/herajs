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
  }
}

