
export type WriteableByteStreamContext = {
    index:number,
    store:Uint8Array,
    size:number,
    partNames: string[]
}

export interface ILayer2Parameters {
    networkAddress: string
    gasBudget?: BigInteger
}

export enum Allowance {
    Set = 0,
    NotSet = 255,
}
