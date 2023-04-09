import { EventEmitter } from 'events';

export interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}

export interface ProviderConnectInfo {
  readonly chainId: string;
}

export interface IEthereumProvider extends EventEmitter {
  // connection event
  on(event: 'connect', listener: (info: ProviderConnectInfo) => void): this;
  // disconnection event
  on(event: 'disconnect', listener: (error: ProviderRpcError) => void): this;
  // arbitrary messages
  on(event: 'message', listener: (message: ProviderMessage) => void): this;
  // chain changed event
  on(event: 'chainChanged', listener: (chainId: string) => void): this;
  // accounts changed event
  on(event: 'accountsChanged', listener: (accounts: string[]) => void): this;
  // make an Ethereum RPC method call.
  request(args: RequestArguments): Promise<unknown>;
}
