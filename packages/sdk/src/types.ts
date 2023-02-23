export declare interface SendToScriptParam {
  cmd: string;
  origin?: string;
  data?: any;
}
export declare interface WindowSharedContext {
  TanglePayEnv?: string;
}
export declare type IotaResponse<T> = { address: string, nodeId: string } | T;

export declare interface IotaEventCapsule {
  id: string;
  handler: (res: { address: string, nodeId: string }, code?:unknown) => void;
  callBack: Function;
}
