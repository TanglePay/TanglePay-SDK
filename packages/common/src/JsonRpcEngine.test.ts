import {beforeEach, describe, expect, test} from "@jest/globals";
import {JsonRpcEngine} from "./JsonRpcEngine";
import {RequestArguments} from "@tanglepaysdk/ethereumprovider/dist/types";
import iota from "@tanglepaysdk/core";

describe('testing basic JsonRpcEngine usage',()=>{
    let rpc:JsonRpcEngine<any, any>
    let _seq = 1
    const _version = 101
    beforeEach(()=>{
        _seq = 1
        rpc = JsonRpcEngine
            .builder<RequestArguments, unknown>()
            .add(async (req, next)=>{
                req.id = _seq++;
                req.version = _version;
                return next!(req);
            })
            .add(async (req) => {
                const { method, params, id } = req;
                return { id:id!, version:_version, data: 'pong' };
            })
            .build();
    })

    test('test ping pong',async ()=>{
        const resp = await rpc.request({method:'ping',params:'test'})
        expect(resp).toEqual({id:1,version:_version,data:'pong'})
    })
})
