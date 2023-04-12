/// <reference types="node" />
import { IEthereumProvider, RequestArguments } from './types';
import { EventEmitter } from 'events';
import { JsonRpcEngine } from 'tanglepaysdk-common';
declare class EthereumProvider extends EventEmitter implements IEthereumProvider {
    _version: number;
    _rpcEngine: JsonRpcEngine<unknown[] | object, unknown>;
    _seq: number;
    _selectedAddress?: string;
    get isTanglePay(): boolean;
    get selectedAddress(): string | undefined;
    constructor();
    _handleConnect(data: any): void;
    _handleDisconnect(data: any): void;
    _handleMessage(data: any): void;
    _handleChainChanged(data: any): void;
    _handleAccountsChanged(data: any): void;
    request(args: RequestArguments): Promise<unknown>;
}
declare const instance: EthereumProvider;
export default instance;
//# sourceMappingURL=index.d.ts.map