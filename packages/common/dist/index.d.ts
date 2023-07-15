/// <reference types="node" />
/// <reference types="node" />
import { Duplex, DuplexOptions } from 'stream';
export * from './types';
export * from './JsonRpcEngine';
export * from './EthereumWeb3Impl';
export declare class WindowPostStream extends Duplex {
    _isMobile: boolean;
    set isMobile(v: boolean);
    constructor(opts?: DuplexOptions);
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
    _read(size: number): undefined;
}
//# sourceMappingURL=index.d.ts.map