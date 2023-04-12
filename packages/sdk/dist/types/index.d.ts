/// <reference types="node" />
import { EventEmitter } from 'events';
import { EventCallback } from 'tanglepaysdk-common';
declare const IotaSDK: {
    redirectAppStoreIfNotInstalled: boolean;
    isTanglePay: boolean;
    tanglePayVersion: string;
    _events: EventEmitter;
    request: ({ method, params, timeout }: {
        method: string;
        timeout?: number | undefined;
        params: unknown;
    }) => Promise<Partial<unknown> | undefined>;
    on: (event: string, callBack: EventCallback) => void;
    removeListener(event: string, callBack: EventCallback): void;
    removeAllListener(event: string): void;
};
export default IotaSDK;
//# sourceMappingURL=index.d.ts.map