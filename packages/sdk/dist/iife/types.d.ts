import { JsonRpcId } from "tanglepaysdk-common";
export declare interface SendToScriptParam {
    cmd: string;
    origin?: string;
    data?: any;
    id: JsonRpcId;
}
export declare interface WindowSharedContext {
    TanglePayEnv?: string;
}
export declare type IotaResponse<T> = {
    address: string;
    nodeId: string;
} | T;
export declare interface IotaEventCapsule {
    id: string;
    handler: (res: {
        address: string;
        nodeId: string;
    }, code?: unknown) => void;
    callBack: Function;
}
export declare interface IotaReadyEventData {
    isTanglePayInstalled: boolean;
    tanglePayVersion: string;
    environment: 'app' | 'chrome' | 'unknown';
}
//# sourceMappingURL=types.d.ts.map