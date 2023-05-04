import type { HexEncodedString, IOutputResponse } from '@iota/types';
import { ILayer2TransferAllowanceMetadata } from './types';
declare class L1ToL2 {
    private _client;
    private _fromAddressHex;
    private _fromAddressBech32;
    private _mnemonic;
    constructor();
    setup(path?: string): Promise<void>;
    private _addGasBudget;
    private _encodeSmartContractParameters;
    private _getSecretManager;
    setMnemonic(mnemonic: string): void;
    getOutputForSend(amount: string): Promise<IOutputResponse | undefined>;
    getOutputForNftSend(nftId: string): Promise<IOutputResponse | undefined>;
    getNftOutputs(): Promise<IOutputResponse[] | undefined>;
    getUnspentOutputs(): Promise<IOutputResponse[] | undefined>;
    prepareAddress(): Promise<void>;
    private _encodeAddress;
    private _getLayer2MetadataForTransfer;
    private _encodeAllowance;
    private _getAmountFromTransactionDetails;
    private _getOutputOptions;
    sendTransaction(toAddr: string, amount: string, nftId?: string): Promise<void>;
    ed2bech32(address: HexEncodedString): void;
    parseLayer2MetadataForTransfer(metadataHex: string): ILayer2TransferAllowanceMetadata;
    private _parseSmartContractParameters;
    private _parseAllowance;
}
declare const instance: L1ToL2;
export default instance;
//# sourceMappingURL=index.d.ts.map