/// <reference types="node" />
import { EventEmitter } from 'events';
import { RequestArguments } from 'tanglepaysdk-common';
export interface ProviderRpcError extends Error {
    code: number;
    data?: unknown;
}
export interface ProviderMessage {
    type: string;
    data: unknown;
}
export interface ProviderConnectInfo {
    readonly chainId: string;
}
export interface IEthereumProvider extends EventEmitter {
    on(event: 'connect', listener: (info: ProviderConnectInfo) => void): this;
    on(event: 'disconnect', listener: (error: ProviderRpcError) => void): this;
    on(event: 'message', listener: (message: ProviderMessage) => void): this;
    on(event: 'chainChanged', listener: (chainId: string) => void): this;
    on(event: 'accountsChanged', listener: (accounts: string[]) => void): this;
    request(args: RequestArguments): Promise<unknown>;
}
//# sourceMappingURL=types.d.ts.map