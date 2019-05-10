// package: types
// file: metric.proto

import * as jspb from "google-protobuf";

export class MetricsRequest extends jspb.Message {
  clearTypesList(): void;
  getTypesList(): Array<MetricType>;
  setTypesList(value: Array<MetricType>): void;
  addTypes(value: MetricType, index?: number): MetricType;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MetricsRequest): MetricsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MetricsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricsRequest;
  static deserializeBinaryFromReader(message: MetricsRequest, reader: jspb.BinaryReader): MetricsRequest;
}

export namespace MetricsRequest {
  export type AsObject = {
    typesList: Array<MetricType>,
  }
}

export class Metrics extends jspb.Message {
  clearPeersList(): void;
  getPeersList(): Array<PeerMetric>;
  setPeersList(value: Array<PeerMetric>): void;
  addPeers(value?: PeerMetric, index?: number): PeerMetric;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Metrics.AsObject;
  static toObject(includeInstance: boolean, msg: Metrics): Metrics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Metrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Metrics;
  static deserializeBinaryFromReader(message: Metrics, reader: jspb.BinaryReader): Metrics;
}

export namespace Metrics {
  export type AsObject = {
    peersList: Array<PeerMetric.AsObject>,
  }
}

export class PeerMetric extends jspb.Message {
  getPeerid(): Uint8Array | string;
  getPeerid_asU8(): Uint8Array;
  getPeerid_asB64(): string;
  setPeerid(value: Uint8Array | string): void;

  getSumin(): number;
  setSumin(value: number): void;

  getAvrin(): number;
  setAvrin(value: number): void;

  getSumout(): number;
  setSumout(value: number): void;

  getAvrout(): number;
  setAvrout(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeerMetric.AsObject;
  static toObject(includeInstance: boolean, msg: PeerMetric): PeerMetric.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PeerMetric, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeerMetric;
  static deserializeBinaryFromReader(message: PeerMetric, reader: jspb.BinaryReader): PeerMetric;
}

export namespace PeerMetric {
  export type AsObject = {
    peerid: Uint8Array | string,
    sumin: number,
    avrin: number,
    sumout: number,
    avrout: number,
  }
}

export enum MetricType {
  NOTHING = 0,
  P2P_NETWORK = 1,
}

