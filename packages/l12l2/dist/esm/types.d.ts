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
export declare enum Allowance {
    Set = 0,
    NotSet = 255
}
export declare const TARGET_CONTRACTS: Readonly<{
    [key in number]: string;
}>;
export declare const CONTRACT_FUNCTIONS: Readonly<{
    [key in string]: string;
}>;
export interface ILayer2Allowance {
    baseTokenAmount: string;
    nativeTokens: NativeTokenAmount[];
}
export type NativeTokenAmount = {
    tokenId: string;
    amount: string;
};
export interface ILayer2SmartContractCallData extends ILayer2Allowance {
    senderContract: string;
    targetContract: string;
    contractFunction: string;
    gasBudget: string;
}
export declare const TOKEN_ID_BYTE_LENGTH = 38;
export interface ILayer2TransferAllowanceMetadata extends ILayer2SmartContractCallData {
    ethereumAddress: string;
}
//# sourceMappingURL=types.d.ts.map