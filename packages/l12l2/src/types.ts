export type WriteableByteStreamContext = {
  index: number;
  store: Uint8Array;
  size: number;
  partNames: string[];
};

export interface ILayer2Parameters {
  networkAddress: string;
  gasBudget?: BigInteger;
}

export enum Allowance {
  Set = 0,
  NotSet = 255,
}

export const TARGET_CONTRACTS: Readonly<{ [key in number]: string }> = {
  0x3c4b5e02: 'Accounts',
}

// first 4 bytes of the hash of transferAllowance function with its parameters
export const CONTRACT_FUNCTIONS: Readonly<{ [key in string]: string }> = {
  0x23f4e3a1: 'transferAllowanceTo',
}

export interface ILayer2Allowance {
  baseTokenAmount: string
  nativeTokens: NativeTokenAmount[]
}

export type NativeTokenAmount = {
  tokenId: string
  amount: string
}

export interface ILayer2SmartContractCallData extends ILayer2Allowance {
  senderContract: string
  targetContract: string
  contractFunction: string
  gasBudget: string
}

export const TOKEN_ID_BYTE_LENGTH = 38 // bytes

export interface ILayer2TransferAllowanceMetadata extends ILayer2SmartContractCallData {
  ethereumAddress: string
}