import {
    StateQueryProof as GrpcStateQueryProof,
    ContractVarProof as GrpcContractVarProof,
    AccountProof as GrpcAccountProof,
} from '../../types/blockchain_pb';
import State from './state';

export type BasicType = number | string | boolean | null;
export interface JsonData {
    [prop: string]: BasicType | BasicType[] | JsonData[] | JsonData;
}

class ContractVarProof {
  inclusion: boolean;
  key: Uint8Array;
  value?: JsonData | BasicType;
  proofKey: Uint8Array;
  proofVal: Uint8Array;
  bitmap: Uint8Array;
  height: number;
  auditPath: Uint8Array[];

  constructor(data: Partial<ContractVarProof>) {
    Object.assign(this, data);
  }

  static fromGrpc(grpcObject: GrpcContractVarProof) {
    const valueRaw = grpcObject.getValue_asU8();
    let value = undefined;
    if (grpcObject.getInclusion()) {
      if (valueRaw.length > 0) {
        value = JSON.parse(Buffer.from(valueRaw).toString());
      } else {
        value = null;
      }
    }

    return new ContractVarProof({
      inclusion: grpcObject.getInclusion(),
      key: grpcObject.getKey_asU8(),
      value,
      proofKey: grpcObject.getProofkey_asU8(),
      proofVal: grpcObject.getProofval_asU8(),
      bitmap: grpcObject.getBitmap_asU8(),
      height: grpcObject.getHeight(),
      auditPath: grpcObject.getAuditpathList_asU8(),
    });
  }
  toGrpc() {
    throw new Error('Not implemented');
  }
}

class AccountProof {
  state: State;
  inclusion: boolean;
  key: Uint8Array;
  proofKey: Uint8Array;
  proofVal: Uint8Array;
  bitmap: Uint8Array;
  height: number;
  auditPath: Uint8Array[];

  constructor(data: Partial<AccountProof>) {
    Object.assign(this, data);
  }

  static fromGrpc(grpcObject: GrpcAccountProof) {
    return new AccountProof({
      state: State.fromGrpc(grpcObject.getState()),
      inclusion: grpcObject.getInclusion(),
      key: grpcObject.getKey_asU8(),
      proofKey: grpcObject.getProofkey_asU8(),
      proofVal: grpcObject.getProofval_asU8(),
      bitmap: grpcObject.getBitmap_asU8(),
      height: grpcObject.getHeight(),
      auditPath: grpcObject.getAuditpathList_asU8(),
    });
  }
  toGrpc() {
    throw new Error('Not implemented');
  }
}

export default class StateQueryProof {
  contractProof: ContractVarProof;
  varProofs: ContractVarProof[];

  constructor(data: Partial<StateQueryProof>) {
    Object.assign(this, data);
  }

  static fromGrpc(grpcObject: GrpcStateQueryProof) {
    return new StateQueryProof({
      contractProof: AccountProof.fromGrpc(grpcObject.getContractproof()),
      varProofs: grpcObject.getVarproofsList().map((grpcObject) => {
          return ContractVarProof.fromGrpc(grpcObject);
      })
    });
  }
  toGrpc() {
    throw new Error('Not implemented');
  }
}
