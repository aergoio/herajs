// package: types
// file: rpc.proto

import * as jspb from "google-protobuf";
import * as blockchain_pb from "./blockchain_pb";
import * as account_pb from "./account_pb";
import * as node_pb from "./node_pb";
import * as p2p_pb from "./p2p_pb";
import * as metric_pb from "./metric_pb";
import * as raft_pb from "./raft_pb";

export class BlockchainStatus extends jspb.Message {
  getBestBlockHash(): Uint8Array | string;
  getBestBlockHash_asU8(): Uint8Array;
  getBestBlockHash_asB64(): string;
  setBestBlockHash(value: Uint8Array | string): void;

  getBestHeight(): number;
  setBestHeight(value: number): void;

  getConsensusInfo(): string;
  setConsensusInfo(value: string): void;

  getBestChainIdHash(): Uint8Array | string;
  getBestChainIdHash_asU8(): Uint8Array;
  getBestChainIdHash_asB64(): string;
  setBestChainIdHash(value: Uint8Array | string): void;

  hasChainInfo(): boolean;
  clearChainInfo(): void;
  getChainInfo(): ChainInfo | undefined;
  setChainInfo(value?: ChainInfo): void;

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
    consensusInfo: string,
    bestChainIdHash: Uint8Array | string,
    chainInfo?: ChainInfo.AsObject,
  }
}

export class ChainId extends jspb.Message {
  getMagic(): string;
  setMagic(value: string): void;

  getPublic(): boolean;
  setPublic(value: boolean): void;

  getMainnet(): boolean;
  setMainnet(value: boolean): void;

  getConsensus(): string;
  setConsensus(value: string): void;

  getVersion(): number;
  setVersion(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainId.AsObject;
  static toObject(includeInstance: boolean, msg: ChainId): ChainId.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChainId, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainId;
  static deserializeBinaryFromReader(message: ChainId, reader: jspb.BinaryReader): ChainId;
}

export namespace ChainId {
  export type AsObject = {
    magic: string,
    pb_public: boolean,
    mainnet: boolean,
    consensus: string,
    version: number,
  }
}

export class ChainInfo extends jspb.Message {
  hasId(): boolean;
  clearId(): void;
  getId(): ChainId | undefined;
  setId(value?: ChainId): void;

  getBpnumber(): number;
  setBpnumber(value: number): void;

  getMaxblocksize(): number;
  setMaxblocksize(value: number): void;

  getMaxtokens(): Uint8Array | string;
  getMaxtokens_asU8(): Uint8Array;
  getMaxtokens_asB64(): string;
  setMaxtokens(value: Uint8Array | string): void;

  getStakingminimum(): Uint8Array | string;
  getStakingminimum_asU8(): Uint8Array;
  getStakingminimum_asB64(): string;
  setStakingminimum(value: Uint8Array | string): void;

  getTotalstaking(): Uint8Array | string;
  getTotalstaking_asU8(): Uint8Array;
  getTotalstaking_asB64(): string;
  setTotalstaking(value: Uint8Array | string): void;

  getGasprice(): Uint8Array | string;
  getGasprice_asU8(): Uint8Array;
  getGasprice_asB64(): string;
  setGasprice(value: Uint8Array | string): void;

  getNameprice(): Uint8Array | string;
  getNameprice_asU8(): Uint8Array;
  getNameprice_asB64(): string;
  setNameprice(value: Uint8Array | string): void;

  getTotalvotingpower(): Uint8Array | string;
  getTotalvotingpower_asU8(): Uint8Array;
  getTotalvotingpower_asB64(): string;
  setTotalvotingpower(value: Uint8Array | string): void;

  getVotingreward(): Uint8Array | string;
  getVotingreward_asU8(): Uint8Array;
  getVotingreward_asB64(): string;
  setVotingreward(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ChainInfo): ChainInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChainInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainInfo;
  static deserializeBinaryFromReader(message: ChainInfo, reader: jspb.BinaryReader): ChainInfo;
}

export namespace ChainInfo {
  export type AsObject = {
    id?: ChainId.AsObject,
    bpnumber: number,
    maxblocksize: number,
    maxtokens: Uint8Array | string,
    stakingminimum: Uint8Array | string,
    totalstaking: Uint8Array | string,
    gasprice: Uint8Array | string,
    nameprice: Uint8Array | string,
    totalvotingpower: Uint8Array | string,
    votingreward: Uint8Array | string,
  }
}

export class ChainStats extends jspb.Message {
  getReport(): string;
  setReport(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainStats.AsObject;
  static toObject(includeInstance: boolean, msg: ChainStats): ChainStats.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChainStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainStats;
  static deserializeBinaryFromReader(message: ChainStats, reader: jspb.BinaryReader): ChainStats;
}

export namespace ChainStats {
  export type AsObject = {
    report: string,
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

export class SingleString extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SingleString.AsObject;
  static toObject(includeInstance: boolean, msg: SingleString): SingleString.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SingleString, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SingleString;
  static deserializeBinaryFromReader(message: SingleString, reader: jspb.BinaryReader): SingleString;
}

export namespace SingleString {
  export type AsObject = {
    value: string,
  }
}

export class AccountAddress extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountAddress.AsObject;
  static toObject(includeInstance: boolean, msg: AccountAddress): AccountAddress.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AccountAddress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountAddress;
  static deserializeBinaryFromReader(message: AccountAddress, reader: jspb.BinaryReader): AccountAddress;
}

export namespace AccountAddress {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class AccountAndRoot extends jspb.Message {
  getAccount(): Uint8Array | string;
  getAccount_asU8(): Uint8Array;
  getAccount_asB64(): string;
  setAccount(value: Uint8Array | string): void;

  getRoot(): Uint8Array | string;
  getRoot_asU8(): Uint8Array;
  getRoot_asB64(): string;
  setRoot(value: Uint8Array | string): void;

  getCompressed(): boolean;
  setCompressed(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountAndRoot.AsObject;
  static toObject(includeInstance: boolean, msg: AccountAndRoot): AccountAndRoot.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AccountAndRoot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountAndRoot;
  static deserializeBinaryFromReader(message: AccountAndRoot, reader: jspb.BinaryReader): AccountAndRoot;
}

export namespace AccountAndRoot {
  export type AsObject = {
    account: Uint8Array | string,
    root: Uint8Array | string,
    compressed: boolean,
  }
}

export class Peer extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): node_pb.PeerAddress | undefined;
  setAddress(value?: node_pb.PeerAddress): void;

  hasBestblock(): boolean;
  clearBestblock(): void;
  getBestblock(): p2p_pb.NewBlockNotice | undefined;
  setBestblock(value?: p2p_pb.NewBlockNotice): void;

  getState(): number;
  setState(value: number): void;

  getHidden(): boolean;
  setHidden(value: boolean): void;

  getLashcheck(): number;
  setLashcheck(value: number): void;

  getSelfpeer(): boolean;
  setSelfpeer(value: boolean): void;

  getVersion(): string;
  setVersion(value: string): void;

  clearCertificatesList(): void;
  getCertificatesList(): Array<node_pb.AgentCertificate>;
  setCertificatesList(value: Array<node_pb.AgentCertificate>): void;
  addCertificates(value?: node_pb.AgentCertificate, index?: number): node_pb.AgentCertificate;

  getAcceptedrole(): node_pb.PeerRoleMap[keyof node_pb.PeerRoleMap];
  setAcceptedrole(value: node_pb.PeerRoleMap[keyof node_pb.PeerRoleMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Peer.AsObject;
  static toObject(includeInstance: boolean, msg: Peer): Peer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Peer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Peer;
  static deserializeBinaryFromReader(message: Peer, reader: jspb.BinaryReader): Peer;
}

export namespace Peer {
  export type AsObject = {
    address?: node_pb.PeerAddress.AsObject,
    bestblock?: p2p_pb.NewBlockNotice.AsObject,
    state: number,
    hidden: boolean,
    lashcheck: number,
    selfpeer: boolean,
    version: string,
    certificatesList: Array<node_pb.AgentCertificate.AsObject>,
    acceptedrole: node_pb.PeerRoleMap[keyof node_pb.PeerRoleMap],
  }
}

export class PeerList extends jspb.Message {
  clearPeersList(): void;
  getPeersList(): Array<Peer>;
  setPeersList(value: Array<Peer>): void;
  addPeers(value?: Peer, index?: number): Peer;

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
    peersList: Array<Peer.AsObject>,
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

export class PageParams extends jspb.Message {
  getOffset(): number;
  setOffset(value: number): void;

  getSize(): number;
  setSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PageParams.AsObject;
  static toObject(includeInstance: boolean, msg: PageParams): PageParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PageParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PageParams;
  static deserializeBinaryFromReader(message: PageParams, reader: jspb.BinaryReader): PageParams;
}

export namespace PageParams {
  export type AsObject = {
    offset: number,
    size: number,
  }
}

export class BlockBodyPaged extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): void;

  getOffset(): number;
  setOffset(value: number): void;

  getSize(): number;
  setSize(value: number): void;

  hasBody(): boolean;
  clearBody(): void;
  getBody(): blockchain_pb.BlockBody | undefined;
  setBody(value?: blockchain_pb.BlockBody): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockBodyPaged.AsObject;
  static toObject(includeInstance: boolean, msg: BlockBodyPaged): BlockBodyPaged.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockBodyPaged, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockBodyPaged;
  static deserializeBinaryFromReader(message: BlockBodyPaged, reader: jspb.BinaryReader): BlockBodyPaged;
}

export namespace BlockBodyPaged {
  export type AsObject = {
    total: number,
    offset: number,
    size: number,
    body?: blockchain_pb.BlockBody.AsObject,
  }
}

export class BlockBodyParams extends jspb.Message {
  getHashornumber(): Uint8Array | string;
  getHashornumber_asU8(): Uint8Array;
  getHashornumber_asB64(): string;
  setHashornumber(value: Uint8Array | string): void;

  hasPaging(): boolean;
  clearPaging(): void;
  getPaging(): PageParams | undefined;
  setPaging(value?: PageParams): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockBodyParams.AsObject;
  static toObject(includeInstance: boolean, msg: BlockBodyParams): BlockBodyParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockBodyParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockBodyParams;
  static deserializeBinaryFromReader(message: BlockBodyParams, reader: jspb.BinaryReader): BlockBodyParams;
}

export namespace BlockBodyParams {
  export type AsObject = {
    hashornumber: Uint8Array | string,
    paging?: PageParams.AsObject,
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

export class BlockMetadata extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  hasHeader(): boolean;
  clearHeader(): void;
  getHeader(): blockchain_pb.BlockHeader | undefined;
  setHeader(value?: blockchain_pb.BlockHeader): void;

  getTxcount(): number;
  setTxcount(value: number): void;

  getSize(): number;
  setSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: BlockMetadata): BlockMetadata.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockMetadata;
  static deserializeBinaryFromReader(message: BlockMetadata, reader: jspb.BinaryReader): BlockMetadata;
}

export namespace BlockMetadata {
  export type AsObject = {
    hash: Uint8Array | string,
    header?: blockchain_pb.BlockHeader.AsObject,
    txcount: number,
    size: number,
  }
}

export class BlockMetadataList extends jspb.Message {
  clearBlocksList(): void;
  getBlocksList(): Array<BlockMetadata>;
  setBlocksList(value: Array<BlockMetadata>): void;
  addBlocks(value?: BlockMetadata, index?: number): BlockMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockMetadataList.AsObject;
  static toObject(includeInstance: boolean, msg: BlockMetadataList): BlockMetadataList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockMetadataList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockMetadataList;
  static deserializeBinaryFromReader(message: BlockMetadataList, reader: jspb.BinaryReader): BlockMetadataList;
}

export namespace BlockMetadataList {
  export type AsObject = {
    blocksList: Array<BlockMetadata.AsObject>,
  }
}

export class CommitResult extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getError(): CommitStatusMap[keyof CommitStatusMap];
  setError(value: CommitStatusMap[keyof CommitStatusMap]): void;

  getDetail(): string;
  setDetail(value: string): void;

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
    error: CommitStatusMap[keyof CommitStatusMap],
    detail: string,
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

  getError(): VerifyStatusMap[keyof VerifyStatusMap];
  setError(value: VerifyStatusMap[keyof VerifyStatusMap]): void;

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
    error: VerifyStatusMap[keyof VerifyStatusMap],
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

export class ImportFormat extends jspb.Message {
  hasWif(): boolean;
  clearWif(): void;
  getWif(): SingleBytes | undefined;
  setWif(value?: SingleBytes): void;

  getOldpass(): string;
  setOldpass(value: string): void;

  getNewpass(): string;
  setNewpass(value: string): void;

  hasKeystore(): boolean;
  clearKeystore(): void;
  getKeystore(): SingleBytes | undefined;
  setKeystore(value?: SingleBytes): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImportFormat.AsObject;
  static toObject(includeInstance: boolean, msg: ImportFormat): ImportFormat.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ImportFormat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImportFormat;
  static deserializeBinaryFromReader(message: ImportFormat, reader: jspb.BinaryReader): ImportFormat;
}

export namespace ImportFormat {
  export type AsObject = {
    wif?: SingleBytes.AsObject,
    oldpass: string,
    newpass: string,
    keystore?: SingleBytes.AsObject,
  }
}

export class Staking extends jspb.Message {
  getAmount(): Uint8Array | string;
  getAmount_asU8(): Uint8Array;
  getAmount_asB64(): string;
  setAmount(value: Uint8Array | string): void;

  getWhen(): number;
  setWhen(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Staking.AsObject;
  static toObject(includeInstance: boolean, msg: Staking): Staking.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Staking, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Staking;
  static deserializeBinaryFromReader(message: Staking, reader: jspb.BinaryReader): Staking;
}

export namespace Staking {
  export type AsObject = {
    amount: Uint8Array | string,
    when: number,
  }
}

export class Vote extends jspb.Message {
  getCandidate(): Uint8Array | string;
  getCandidate_asU8(): Uint8Array;
  getCandidate_asB64(): string;
  setCandidate(value: Uint8Array | string): void;

  getAmount(): Uint8Array | string;
  getAmount_asU8(): Uint8Array;
  getAmount_asB64(): string;
  setAmount(value: Uint8Array | string): void;

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
    amount: Uint8Array | string,
  }
}

export class VoteParams extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VoteParams.AsObject;
  static toObject(includeInstance: boolean, msg: VoteParams): VoteParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VoteParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VoteParams;
  static deserializeBinaryFromReader(message: VoteParams, reader: jspb.BinaryReader): VoteParams;
}

export namespace VoteParams {
  export type AsObject = {
    id: string,
    count: number,
  }
}

export class AccountVoteInfo extends jspb.Message {
  hasStaking(): boolean;
  clearStaking(): void;
  getStaking(): Staking | undefined;
  setStaking(value?: Staking): void;

  clearVotingList(): void;
  getVotingList(): Array<VoteInfo>;
  setVotingList(value: Array<VoteInfo>): void;
  addVoting(value?: VoteInfo, index?: number): VoteInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountVoteInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AccountVoteInfo): AccountVoteInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AccountVoteInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountVoteInfo;
  static deserializeBinaryFromReader(message: AccountVoteInfo, reader: jspb.BinaryReader): AccountVoteInfo;
}

export namespace AccountVoteInfo {
  export type AsObject = {
    staking?: Staking.AsObject,
    votingList: Array<VoteInfo.AsObject>,
  }
}

export class VoteInfo extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  clearCandidatesList(): void;
  getCandidatesList(): Array<string>;
  setCandidatesList(value: Array<string>): void;
  addCandidates(value: string, index?: number): string;

  getAmount(): string;
  setAmount(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VoteInfo.AsObject;
  static toObject(includeInstance: boolean, msg: VoteInfo): VoteInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VoteInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VoteInfo;
  static deserializeBinaryFromReader(message: VoteInfo, reader: jspb.BinaryReader): VoteInfo;
}

export namespace VoteInfo {
  export type AsObject = {
    id: string,
    candidatesList: Array<string>,
    amount: string,
  }
}

export class VoteList extends jspb.Message {
  clearVotesList(): void;
  getVotesList(): Array<Vote>;
  setVotesList(value: Array<Vote>): void;
  addVotes(value?: Vote, index?: number): Vote;

  getId(): string;
  setId(value: string): void;

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
    id: string,
  }
}

export class NodeReq extends jspb.Message {
  getTimeout(): Uint8Array | string;
  getTimeout_asU8(): Uint8Array;
  getTimeout_asB64(): string;
  setTimeout(value: Uint8Array | string): void;

  getComponent(): Uint8Array | string;
  getComponent_asU8(): Uint8Array;
  getComponent_asB64(): string;
  setComponent(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeReq.AsObject;
  static toObject(includeInstance: boolean, msg: NodeReq): NodeReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NodeReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeReq;
  static deserializeBinaryFromReader(message: NodeReq, reader: jspb.BinaryReader): NodeReq;
}

export namespace NodeReq {
  export type AsObject = {
    timeout: Uint8Array | string,
    component: Uint8Array | string,
  }
}

export class Name extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getBlockno(): number;
  setBlockno(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Name.AsObject;
  static toObject(includeInstance: boolean, msg: Name): Name.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Name, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Name;
  static deserializeBinaryFromReader(message: Name, reader: jspb.BinaryReader): Name;
}

export namespace Name {
  export type AsObject = {
    name: string,
    blockno: number,
  }
}

export class NameInfo extends jspb.Message {
  hasName(): boolean;
  clearName(): void;
  getName(): Name | undefined;
  setName(value?: Name): void;

  getOwner(): Uint8Array | string;
  getOwner_asU8(): Uint8Array;
  getOwner_asB64(): string;
  setOwner(value: Uint8Array | string): void;

  getDestination(): Uint8Array | string;
  getDestination_asU8(): Uint8Array;
  getDestination_asB64(): string;
  setDestination(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NameInfo.AsObject;
  static toObject(includeInstance: boolean, msg: NameInfo): NameInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NameInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NameInfo;
  static deserializeBinaryFromReader(message: NameInfo, reader: jspb.BinaryReader): NameInfo;
}

export namespace NameInfo {
  export type AsObject = {
    name?: Name.AsObject,
    owner: Uint8Array | string,
    destination: Uint8Array | string,
  }
}

export class PeersParams extends jspb.Message {
  getNohidden(): boolean;
  setNohidden(value: boolean): void;

  getShowself(): boolean;
  setShowself(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeersParams.AsObject;
  static toObject(includeInstance: boolean, msg: PeersParams): PeersParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PeersParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeersParams;
  static deserializeBinaryFromReader(message: PeersParams, reader: jspb.BinaryReader): PeersParams;
}

export namespace PeersParams {
  export type AsObject = {
    nohidden: boolean,
    showself: boolean,
  }
}

export class KeyParams extends jspb.Message {
  clearKeyList(): void;
  getKeyList(): Array<string>;
  setKeyList(value: Array<string>): void;
  addKey(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeyParams.AsObject;
  static toObject(includeInstance: boolean, msg: KeyParams): KeyParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeyParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeyParams;
  static deserializeBinaryFromReader(message: KeyParams, reader: jspb.BinaryReader): KeyParams;
}

export namespace KeyParams {
  export type AsObject = {
    keyList: Array<string>,
  }
}

export class ServerInfo extends jspb.Message {
  getStatusMap(): jspb.Map<string, string>;
  clearStatusMap(): void;
  getConfigMap(): jspb.Map<string, ConfigItem>;
  clearConfigMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServerInfo): ServerInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerInfo;
  static deserializeBinaryFromReader(message: ServerInfo, reader: jspb.BinaryReader): ServerInfo;
}

export namespace ServerInfo {
  export type AsObject = {
    statusMap: Array<[string, string]>,
    configMap: Array<[string, ConfigItem.AsObject]>,
  }
}

export class ConfigItem extends jspb.Message {
  getPropsMap(): jspb.Map<string, string>;
  clearPropsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConfigItem.AsObject;
  static toObject(includeInstance: boolean, msg: ConfigItem): ConfigItem.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConfigItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConfigItem;
  static deserializeBinaryFromReader(message: ConfigItem, reader: jspb.BinaryReader): ConfigItem;
}

export namespace ConfigItem {
  export type AsObject = {
    propsMap: Array<[string, string]>,
  }
}

export class EventList extends jspb.Message {
  clearEventsList(): void;
  getEventsList(): Array<blockchain_pb.Event>;
  setEventsList(value: Array<blockchain_pb.Event>): void;
  addEvents(value?: blockchain_pb.Event, index?: number): blockchain_pb.Event;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventList.AsObject;
  static toObject(includeInstance: boolean, msg: EventList): EventList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventList;
  static deserializeBinaryFromReader(message: EventList, reader: jspb.BinaryReader): EventList;
}

export namespace EventList {
  export type AsObject = {
    eventsList: Array<blockchain_pb.Event.AsObject>,
  }
}

export class ConsensusInfo extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getInfo(): string;
  setInfo(value: string): void;

  clearBpsList(): void;
  getBpsList(): Array<string>;
  setBpsList(value: Array<string>): void;
  addBps(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsensusInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ConsensusInfo): ConsensusInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsensusInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsensusInfo;
  static deserializeBinaryFromReader(message: ConsensusInfo, reader: jspb.BinaryReader): ConsensusInfo;
}

export namespace ConsensusInfo {
  export type AsObject = {
    type: string,
    info: string,
    bpsList: Array<string>,
  }
}

export class EnterpriseConfigKey extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnterpriseConfigKey.AsObject;
  static toObject(includeInstance: boolean, msg: EnterpriseConfigKey): EnterpriseConfigKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnterpriseConfigKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnterpriseConfigKey;
  static deserializeBinaryFromReader(message: EnterpriseConfigKey, reader: jspb.BinaryReader): EnterpriseConfigKey;
}

export namespace EnterpriseConfigKey {
  export type AsObject = {
    key: string,
  }
}

export class EnterpriseConfig extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getOn(): boolean;
  setOn(value: boolean): void;

  clearValuesList(): void;
  getValuesList(): Array<string>;
  setValuesList(value: Array<string>): void;
  addValues(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnterpriseConfig.AsObject;
  static toObject(includeInstance: boolean, msg: EnterpriseConfig): EnterpriseConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnterpriseConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnterpriseConfig;
  static deserializeBinaryFromReader(message: EnterpriseConfig, reader: jspb.BinaryReader): EnterpriseConfig;
}

export namespace EnterpriseConfig {
  export type AsObject = {
    key: string,
    on: boolean,
    valuesList: Array<string>,
  }
}

export interface CommitStatusMap {
  TX_OK: 0;
  TX_NONCE_TOO_LOW: 1;
  TX_ALREADY_EXISTS: 2;
  TX_INVALID_HASH: 3;
  TX_INVALID_SIGN: 4;
  TX_INVALID_FORMAT: 5;
  TX_INSUFFICIENT_BALANCE: 6;
  TX_HAS_SAME_NONCE: 7;
  TX_INTERNAL_ERROR: 9;
}

export const CommitStatus: CommitStatusMap;

export interface VerifyStatusMap {
  VERIFY_STATUS_OK: 0;
  VERIFY_STATUS_SIGN_NOT_MATCH: 1;
  VERIFY_STATUS_INVALID_HASH: 2;
}

export const VerifyStatus: VerifyStatusMap;

