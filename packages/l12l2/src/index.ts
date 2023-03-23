import { init, Client, IBasicOutputBuilderOptions} from "@iota/client-wasm/web";
import type { AddressTypes, FeatureTypes, HexEncodedString, INativeToken, UnlockConditionTypes } from '@iota/types';
import { ACCOUNTS_CONTRACT, EMPTY_BUFFER, EMPTY_BUFFER_BYTE_LENGTH, ENDING_SIGNAL_BYTE, EXTERNALLY_OWNED_ACCOUNT, EXTERNALLY_OWNED_ACCOUNT_TYPE_ID, GAS_BUDGET, TRANSFER_ALLOWANCE } from "./constant";
import { Allowance, ILayer2Parameters } from "./types";
interface Assets {
    nativeTokens?: INativeToken[];
    nftId?: HexEncodedString;
}


//client.buildBasicOutput()
import { WriteStream, Converter } from '@iota/util.js'
import BigInteger from "big-integer";
import { convertDateToUnixTimestamp } from "./util";

export async function getIotaClient() {
    await init('./client_wasm_bg.wasm')
    return new Client({
        nodes: ['https://api.testnet.shimmer.network'],
        localPow: true
      });
}

export const sendTransaction = async (client:Client) => {
    const BasicOutputBuilderOption = getOutputOptions()
    const BasicOutput = await client.buildBasicOutput(BasicOutputBuilderOption);
}

export function getLayer2MetadataForTransfer(layer2Address: string,rawAmount:string,nativeTokenId?: string,
    surplus?: string): string {
    const metadataStream = new WriteStream()

    metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    metadataStream.writeUInt64('gasBudget', GAS_BUDGET)

    const encodedAddress = encodeAddress(layer2Address.toLowerCase())
    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAllowance(rawAmount,nativeTokenId,surplus)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    metadataStream.writeUInt16('end', ENDING_SIGNAL_BYTE)
    const metadata = '0x' + metadataStream.finalHex()
    return metadata
}

function encodeSmartContractParameters(parameters: [string, string][]): Uint8Array {
    const encodedParameters = new WriteStream()
    encodedParameters.writeUInt32('parametersLength', parameters.length)

    for (const parameter of parameters) {
        const [key, value] = parameter

        const keyBytes = Converter.utf8ToBytes(key)
        encodedParameters.writeUInt16('keyLength', key.length)
        encodedParameters.writeBytes('keyBytes', keyBytes.length, keyBytes)

        const valueBytes = Converter.hexToBytes(value)
        encodedParameters.writeUInt32('valueLength', valueBytes.length)
        encodedParameters.writeBytes('valueBytes', valueBytes.length, valueBytes)
    }
    return encodedParameters.finalBytes()
}

function encodeAddress(address: string): string {
    const encodedAddress = new WriteStream()
    encodedAddress.writeUInt8('Address Type ID', EXTERNALLY_OWNED_ACCOUNT_TYPE_ID)
    const addressBytes = Converter.hexToBytes(address)
    for (let i=0;i<addressBytes.length;i++) {
        encodedAddress.writeUInt8('Address byte', addressBytes[i])
    }
    return encodedAddress.finalHex()
}

function encodeAllowance(rawAmount: string,
    nativeTokenId?: string,
    surplus?: string): Uint8Array {
    const allowance = new WriteStream()
    const tokenBuffer = new WriteStream()

    //if (transactionDetails.type === NewTransactionType.TokenTransfer) {
    if (true) {
        allowance.writeUInt8('encodedAllowance', Allowance.Set)

        
        if (nativeTokenId == undefined) {
            allowance.writeUInt64('iotaAmount', BigInteger(rawAmount))
            allowance.writeUInt16('noTokens', EMPTY_BUFFER_BYTE_LENGTH)
            allowance.writeUInt16('emptyTokenBuffer', EMPTY_BUFFER)
        } else {
            allowance.writeUInt64('iotaAmount', BigInteger(surplus ?? '0'))

            tokenBuffer.writeUInt16('amountOfTokens', 1)
            const tokenIdBytes = Converter.hexToBytes(nativeTokenId.substring(2))
            tokenBuffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes)
            tokenBuffer.writeUInt256('amount', BigInteger(rawAmount))
            const tokenBufferBytes = tokenBuffer.finalBytes()

            allowance.writeUInt16('tokensLength', tokenBufferBytes.length)
            allowance.writeBytes('tokenBuffer', tokenBufferBytes.length, tokenBufferBytes)
        }
    }
    return allowance.finalBytes()
}
function addGasBudget(rawAmount: string): string {
    const bigAmount = BigInteger(rawAmount).add(GAS_BUDGET)
    return bigAmount.toString()
}
export function getOutputOptions(
    senderAddress: AddressTypes,
    expirationDate: Date,
    recipientAddress: string,
    rawAmount: string,
    nativeTokenId?: string,
    metadata?: HexEncodedString,
    tag?: string,
    giftStorageDeposit?: boolean,
    surplus?: string,
    layer2Parameters?: ILayer2Parameters,
    nftId?: string
): IBasicOutputBuilderOptions {
    const unixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const bigAmount = BigInteger(rawAmount)

    let amount: string
    if (nativeTokenId && surplus) {
        amount = surplus
    } else {
        amount = nativeTokenId ? '0' : bigAmount.toString()
    }

    if (tag != undefined) {
        tag = Converter.utf8ToHex(tag, true)
    }
    if (layer2Parameters) {
        amount = addGasBudget(amount)
        metadata = getLayer2MetadataForTransfer(recipientAddress,rawAmount,nativeTokenId,surplus)
        recipientAddress = layer2Parameters.networkAddress
    } else {
        if (metadata) 
        metadata = Converter.utf8ToHex(metadata, true)
    }

    const assets: Assets = {}
    if (nftId) {
        assets.nftId = nftId
    } else if (nativeTokenId) {
        assets.nativeTokens = [
            {
                id: nativeTokenId,
                amount: '0x' + bigAmount.toString(16),
            },
        ]
    }
    const features:FeatureTypes[] = []
    if (metadata) {
        features.push({type:2,data:metadata})
    }
    if (layer2Parameters) {
        features.push({type:0,address:senderAddress})
    }
    if (tag) {
        features.push({type:3,tag})
    }
    const unlockConditions:UnlockConditionTypes[] = [];
    if (unixTime) {
        unlockConditions.push({type:2,unixTime})
    }
    return <IBasicOutputBuilderOptions>{
        recipientAddress,
        amount,
        features,
        unlockConditions,
        ...((nativeTokenId || nftId) && { assets }),
        storageDeposit: {
            returnStrategy: giftStorageDeposit ? 'Gift' : 'Return',
        },
    }
}