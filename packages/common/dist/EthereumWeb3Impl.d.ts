import Web3 from 'web3';
import type { BlockNumber } from 'web3-core';
export declare const setWeb3Client: (client: Web3) => void;
export declare const ethGetBlockByNumber: (blockHashOrBlockNumber: BlockNumber | string, returnTransactionObjects: boolean) => Promise<(import("web3-eth").BlockTransactionString & import("web3-eth").BlockTransactionObject) | undefined>;
export declare const ethGasPrice: () => Promise<string | undefined>;
export declare const ethSign: (dataToSign: string, address: string) => Promise<string | undefined>;
export declare const ethPersonalSign: (dataToSign: string, address: string, password: string) => Promise<string | undefined>;
//# sourceMappingURL=EthereumWeb3Impl.d.ts.map