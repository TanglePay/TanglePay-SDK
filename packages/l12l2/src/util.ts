

import { WriteableByteStreamContext } from "./types";
import 'text-encoding-polyfill'
import BigNumber from 'bignumber.js'

const DEFAULT_WRITABLE_CHUNK_SIZE = 1024
export const makeWriteableByteStream = ():WriteableByteStreamContext => {
    const byteArray = new Uint8Array(DEFAULT_WRITABLE_CHUNK_SIZE)
    return {
        index:0,
        store:byteArray,
        size:DEFAULT_WRITABLE_CHUNK_SIZE,
        partNames:[] as string[]
    }
}

const ensureAddtionalSpace = (volumn:number, ctx:WriteableByteStreamContext) => {
    let needSet = false;
    while (true) {
        if (ctx.index + volumn <= ctx.size) {
            break;
        } else {
            // times 2
            ctx.size = ctx.size * 2;
            needSet = true;
        }
    }
    if (needSet) {
        const neoStore = new Uint8Array(ctx.size);
        neoStore.set(ctx.store);
        ctx.store = neoStore;
    }
}
export const writeBytes = (key:string,pl:number[] | Uint8Array,ctx:WriteableByteStreamContext) => {
    const len = pl.length;
    ensureAddtionalSpace(len, ctx);
    for (let i = 0; i< len; ++i) {
        const num = pl[i];
        ctx.store[ctx.index++] = num;
    }
    ctx.partNames.push(key);
}
const uintnToUint8array = (num:number, n:number):number[] => {
    const pl = [];
    let iterationTimes = n / 8;
    while (iterationTimes-->0) {
        const i8 = num & 0x255;
        pl.push(i8);
        num = num >>> 8;
    }
    return pl;
}
export const writeUInt8 = (key:string, val:number, ctx:WriteableByteStreamContext) => {
    const pl = uintnToUint8array(val,8);
    writeBytes(key,pl,ctx);
}
export const writeUInt16 = (key:string, val:number, ctx:WriteableByteStreamContext) => {
    const pl = uintnToUint8array(val,16);
    writeBytes(key,pl,ctx);
}
export const writeUInt32 = (key:string, val:number, ctx:WriteableByteStreamContext) => {
    const pl = uintnToUint8array(val,32);
    writeBytes(key,pl,ctx);
}
export const writeBigNumber = (key:string, val:BigNumber, ctx:WriteableByteStreamContext) => {
    const binaryArr = [];
    while (val.gt(0)) {
        const bit = val.mod(2).toString()
        binaryArr.push(bit)
    }
    let binaryString = binaryArr.join('');
    while (binaryString.length % 8 !== 0) {
        binaryString = '0' + binaryString;
    }

    // Split the binary string into 8-bit chunks
    const binaryChunks = binaryString.match(/.{1,8}/g);

    if (binaryChunks == null) return;
    // Parse each chunk as a Uint8 value and store it in a Uint8Array
    const uint8Array = new Uint8Array(binaryChunks.length);
    for (let i = 0; i < binaryChunks.length; i++) {
        uint8Array[i] = parseInt(binaryChunks[i], 2);
    }

    writeBytes(key,uint8Array,ctx);
}
export const getWriteableStreamNameParts = (ctx:WriteableByteStreamContext) => {
    return ctx.partNames;
}
export const finalHex = (ctx:WriteableByteStreamContext) => {
    console.log(ctx.partNames.join(','))
    return bytesToHex(ctx.store);
}
export const finalBytes = (ctx:WriteableByteStreamContext) => {
    console.log(ctx.partNames.join(','))
    return ctx.store;
}
export const bytesToHex = (bytes:number[] | Uint8Array)=>{
    return Array.from(bytes).map(byte => byte.toString(16).padStart(2,'0')).join('');
}

export const hexToBytes = (hex:string) => {
    const len = hex.length;
    const bytesArr = new Uint8Array(len / 2);
    for (let i=0;i< len;i+=2) {
        bytesArr[i/2] = parseInt(hex.substring(i, i+2),16)
    }
    return bytesArr;
}

export const utf8ToBytes = (utf8:string) => {
    const encoder = new TextEncoder;
    return encoder.encode(utf8);
}

export const utf8ToHex = (utf8?: string, prefix = false): string|undefined =>  {
    if (!utf8) return utf8;
    let hex = bytesToHex(utf8ToBytes(utf8));
    if (prefix) hex = '0x' + hex;
    return hex;
}

export function convertDateToUnixTimestamp(date: Date) {
    return date ? Math.round(date.getTime()/1000) : date
}