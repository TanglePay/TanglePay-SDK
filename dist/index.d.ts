declare const IotaSDK: {
    redirectAppStoreIfNotInstalled: boolean;
    isTanglePay: boolean;
    tanglePayVersion: string;
    request: ({ method, params, timeout }: {
        method: string;
        timeout: number;
        params: unknown;
    }) => Promise<unknown>;
    on: (event: string, callBack: Function) => void;
    removeListener(event: string, callBack: Function): void;
    removeAllListener(event: string): void;
};
export default IotaSDK;
