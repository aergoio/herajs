import { Address } from '../classes';
import { AmountArg } from '../classes/amount';
import { StringOrBuffer } from '../encoding';

export enum TxTypes {
  Normal = 0,
  Governance = 1,
  Redeploy = 2,
  FeeDelegation = 3,
  Transfer = 4,
  Call = 5,
  Deploy = 6,
}

/**
 * This interface defines a type for user provided tx data.
 * Internal functions can use different types but this is the publicly facing API.
 */
export interface TxBody {
  nonce: number;
  chainIdHash: StringOrBuffer;
  from: Address | string;
  to?: Address | string | null;
  hash?: StringOrBuffer;
  amount?: AmountArg | null;
  payload?: StringOrBuffer;
  sign?: string;
  type?: TxTypes;
  limit?: number;
  price?: AmountArg | null;
}

export interface SignedTxBody extends TxBody {
  sign: string;
}

export interface SignedAndHashedTxBody extends TxBody {
  sign: string;
  hash: string;
}
