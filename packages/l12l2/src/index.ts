import {
  init,
  Client,
  CoinType,
  initLogger,
  SHIMMER_TESTNET_BECH32_HRP,
  IBasicOutputBuilderOptions,
  IBuildBlockOptions
} from '@iota/client-wasm/web';
import type {
  AddressTypes,
  FeatureTypes,
  HexEncodedString,
  INativeToken,
  UnlockConditionTypes,
  ADDRESS_UNLOCK_CONDITION_TYPE,
  BASIC_OUTPUT_TYPE,
  Ed25519Seed,
  ED25519_ADDRESS_TYPE,
  ED25519_SIGNATURE_TYPE,
  Ed25519Address,
  IKeyPair,
  ISignatureUnlock,
  SIGNATURE_UNLOCK_TYPE,
  TRANSACTION_ESSENCE_TYPE,
  TRANSACTION_PAYLOAD_TYPE,
  ITransactionEssence,
  ITransactionPayload,
  IUTXOInput,
  UTXO_INPUT_TYPE,
  IBasicOutput,
  IBlock,
  IOutputResponse,
} from '@iota/types';
const DEFAULT_PROTOCOL_VERSION = 2;
import {
  ACCOUNTS_CONTRACT,
  EMPTY_BUFFER,
  EMPTY_BUFFER_BYTE_LENGTH,
  ENDING_SIGNAL_BYTE,
  EXTERNALLY_OWNED_ACCOUNT,
  EXTERNALLY_OWNED_ACCOUNT_TYPE_ID,
  GAS_BUDGET,
  TRANSFER_ALLOWANCE,
} from './constant';
import { Allowance, CONTRACT_FUNCTIONS, ILayer2Allowance, ILayer2Parameters, ILayer2TransferAllowanceMetadata, NativeTokenAmount, TARGET_CONTRACTS, TOKEN_ID_BYTE_LENGTH } from './types';
interface Assets {
  nativeTokens?: INativeToken[];
  nftId?: HexEncodedString;
}

import { WriteStream, Converter, ReadStream } from '@iota/util.js';
import { convertDateToUnixTimestamp, decimalToHex } from './util';
import BigInteger from 'big-integer';

class L1ToL2 {
  private _client:Client|undefined;
  private _fromAddressHex: string|undefined;
  private _fromAddressBech32: string|undefined;
  private _mnemonic: string|undefined;
  constructor(){

  }
  async setup(){
    await init('./client_wasm_bg.wasm');
    await initLogger();
    
    this._client = new Client({
      nodes: ['https://api.testnet.shimmer.network'],
      localPow: true,
    });
  }
  private _addGasBudget(rawAmount: string): string {
    const bigAmount = BigInteger(rawAmount).add(GAS_BUDGET);
    return bigAmount.toString();
  }
  
  private _encodeSmartContractParameters(
    parameters: [string, string][],
  ): Uint8Array {
    const encodedParameters = new WriteStream();
    encodedParameters.writeUInt32('parametersLength', parameters.length);
  
    for (const parameter of parameters) {
      const [key, value] = parameter;
  
      const keyBytes = Converter.utf8ToBytes(key);
      encodedParameters.writeUInt16('keyLength', key.length);
      encodedParameters.writeBytes('keyBytes', keyBytes.length, keyBytes);
  
      const valueBytes = Converter.hexToBytes(value);
      encodedParameters.writeUInt32('valueLength', valueBytes.length);
      encodedParameters.writeBytes('valueBytes', valueBytes.length, valueBytes);
    }
    return encodedParameters.finalBytes();
  }
  private _getSecretManager(){
    return {
      mnemonic:this._mnemonic!,
    };
  };
  setMnemonic(mnemonic:string){
    this._mnemonic = mnemonic
  }
  async getOutputForSend(
    amount: string,
  ){
    const targetAmount = BigInteger(amount);
    const outputs = await this.getUnspentOutputs();
    if (!outputs) return;
    for (const outputResp of outputs) {
      const output = outputResp.output;
      const resAmount = BigInteger(output.amount);
      if (resAmount.geq(targetAmount)) {
        return outputResp;
      }
    }
    return undefined;
  };
  async getUnspentOutputs():Promise<IOutputResponse[]|undefined>{
    if (!this._client) return
    const outputIdsResponse = await this._client.basicOutputIds([
      { address:this._fromAddressBech32??'' },
      { hasExpiration: false },
      { hasTimelock: false },
      { hasStorageDepositReturn: false },
    ]);
  
    // Get outputs by their IDs
    let addressOutputs = await this._client.getOutputs(outputIdsResponse);
    addressOutputs = addressOutputs.filter(o=>!o.metadata.isSpent)
    return addressOutputs;
  }
  async prepareAddress(){
    if (this._fromAddressBech32 == undefined) {
      const secretManager = this._getSecretManager();
      const addresses = await this._client?.generateAddresses(secretManager, {
        accountIndex: 0,
        range: {
          start: 0,
          end: 1,
        },
      });
      console.log('address',addresses)
      this._fromAddressBech32 = addresses? addresses[0]:undefined;
      if (this._fromAddressBech32) this._fromAddressHex = await this._client?.bech32ToHex(this._fromAddressBech32)
    }
  }
  
  private _encodeAddress(address: string): string {
    const encodedAddress = new WriteStream();
    encodedAddress.writeUInt8(
      'Address Type ID',
      EXTERNALLY_OWNED_ACCOUNT_TYPE_ID,
    );
    const addressBytes = Converter.hexToBytes(address);
    for (let i = 0; i < addressBytes.length; i++) {
      encodedAddress.writeUInt8('Address byte', addressBytes[i]);
    }
    return encodedAddress.finalHex();
  }
  private _getLayer2MetadataForTransfer(
    layer2Address: string,
    rawAmount: string,
    nativeTokenId?: string,
    surplus?: string,
  ): string {
    const metadataStream = new WriteStream();
  
    metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT);
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT);
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE);
    metadataStream.writeUInt64('gasBudget', GAS_BUDGET);
  
    const encodedAddress = this._encodeAddress(layer2Address.toLowerCase());
    const smartContractParameters = Object.entries({ a: encodedAddress });
    const parameters = this._encodeSmartContractParameters(smartContractParameters);
    metadataStream.writeBytes(
      'smartContractParameters',
      parameters.length,
      parameters,
    );
  
    const allowance = this._encodeAllowance(rawAmount, nativeTokenId, surplus);
    metadataStream.writeBytes('allowance', allowance.length, allowance);
  
    metadataStream.writeUInt16('end', ENDING_SIGNAL_BYTE);
    const metadata = '0x' + metadataStream.finalHex();
    return metadata;
  }
  private _encodeAllowance(
    rawAmount: string,
    nativeTokenId?: string,
    surplus?: string,
  ): Uint8Array {
    const allowance = new WriteStream();
    const tokenBuffer = new WriteStream();
  
    //if (transactionDetails.type === NewTransactionType.TokenTransfer) {
    if (true) {
      allowance.writeUInt8('encodedAllowance', Allowance.Set);
  
      if (nativeTokenId == undefined) {
        allowance.writeUInt64('iotaAmount', BigInteger(rawAmount));
        allowance.writeUInt16('noTokens', EMPTY_BUFFER_BYTE_LENGTH);
        allowance.writeUInt16('emptyTokenBuffer', EMPTY_BUFFER);
      } else {
        allowance.writeUInt64('iotaAmount', BigInteger(surplus ?? '0'));
  
        tokenBuffer.writeUInt16('amountOfTokens', 1);
        const tokenIdBytes = Converter.hexToBytes(nativeTokenId.substring(2));
        tokenBuffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes);
        tokenBuffer.writeUInt256('amount', BigInteger(rawAmount));
        const tokenBufferBytes = tokenBuffer.finalBytes();
  
        allowance.writeUInt16('tokensLength', tokenBufferBytes.length);
        allowance.writeBytes(
          'tokenBuffer',
          tokenBufferBytes.length,
          tokenBufferBytes,
        );
      }
    }
    return allowance.finalBytes();
  }
  private async _getOutputOptions(
    senderAddress: AddressTypes,
    recipientAddress: string,
    rawAmount: string,
    ext: {
      nativeTokenId?: string;
      metadata?: HexEncodedString;
      tag?: string;
      giftStorageDeposit?: boolean;
      surplus?: string;
      layer2Parameters?: ILayer2Parameters;
      nftId?: string;
      expirationDate?: Date;
    },
  ): Promise<IBasicOutput> {
    if (!this._client) throw new Error('client not init')
    let {
      nativeTokenId,
      metadata,
      tag,
      giftStorageDeposit,
      surplus,
      layer2Parameters,
      nftId,
      expirationDate,
    } = ext;
    const unixTime = expirationDate
      ? convertDateToUnixTimestamp(expirationDate)
      : undefined;
    const bigAmount = BigInteger(rawAmount);
  
    let amount: string;
    if (nativeTokenId && surplus) {
      amount = surplus;
    } else {
      amount = nativeTokenId ? '0' : bigAmount.toString();
    }
  
    if (tag != undefined) {
      tag = Converter.utf8ToHex(tag, true);
    }
    if (layer2Parameters) {
      amount = this._addGasBudget(amount);
      metadata = this._getLayer2MetadataForTransfer(
        recipientAddress,
        rawAmount,
        nativeTokenId,
        surplus,
      );
      recipientAddress = await this._client.bech32ToHex(layer2Parameters.networkAddress)
    } else {
      if (metadata) metadata = Converter.utf8ToHex(metadata, true);
    }
  
    const assets: Assets = {};
    if (nftId) {
      assets.nftId = nftId;
    } else if (nativeTokenId) {
      assets.nativeTokens = [
        {
          id: nativeTokenId,
          amount: '0x' + bigAmount.toString(16),
        },
      ];
    }
    const features: FeatureTypes[] = [];
    if (metadata) {
      features.push({ type: 2, data: metadata });
    }
    if (layer2Parameters) {
      features.push({ type: 0, address: senderAddress });
    }
    if (tag) {
      features.push({ type: 3, tag });
    }
    //TODO aliasId
    const unlockConditions: UnlockConditionTypes[] = [{type:0,address:{type:8,aliasId:
      '0x6b6d8fe5994842cdf529bd6b1ef5eaf6f5f3da1e5b7951c3c2a5085aca672ce3'
      //'0x9d42573526902b116c905fcb2248847cc6c63c64e5c2af89d0c625ce6eaae5ec'
    }}];
    if (unixTime) {
      unlockConditions.push({ type: 2, unixTime });
    }
    return {
      type:3,
      amount,
      features,
      unlockConditions,
      ...((nativeTokenId || nftId) && { assets }),
    };
  }

  async sendTransaction(
    toAddr: string,
    amount: string,
  ){
    if (!(this._client && this._fromAddressBech32)) return;
    const outputDetail = await this.getOutputForSend(amount);
    if (outputDetail == undefined) return;
    const totalFunds = BigInteger(outputDetail.output.amount);
  
    const amountToSend = BigInteger(amount);
  
    const inputs: IUTXOInput[] = [];
    inputs.push({
      type: 0,
      transactionId: outputDetail.metadata.transactionId,
      transactionOutputIndex: outputDetail.metadata.outputIndex,
    });
  
    const outputs: IBasicOutput[] = [];
  
    const basicOutput: IBasicOutput = await this._getOutputOptions(
      { type: 0, pubKeyHash: this._fromAddressHex??'' },
      toAddr,
      amount,
      {
        layer2Parameters: {
          networkAddress: 'rms1pp4kmrl9n9yy9n049x7kk8h4atm0tu76redhj5wrc2jsskk2vukwxvtgk9u',
            //'rms1pzw5y4e4y6gzkytvjp0ukgjgs37vd33uvnju9tuf6rrztnnw4tj7crw72ar',
        },
      },
    );
    console.log('receiveroutputs',basicOutput)
    outputs.push(basicOutput);
    if (totalFunds.gt(amountToSend)) {
      // The remaining output that remains in the origin address
      const remainderBasicOutput: IBasicOutput = {
        type: 3,
        amount: totalFunds.minus(BigInteger(basicOutput.amount)).toString(),
        nativeTokens: [],
        unlockConditions: [
          {
            type: 0,
            address: {
              type: 0,
              pubKeyHash: this._fromAddressHex??'',
            },
          },
        ],
        features: [],
      };
      outputs.push(remainderBasicOutput);
    }
    console.log(outputs)
    const secretManager = this._getSecretManager();
    const blockOption:IBuildBlockOptions = { inputs, outputs }
    console.log(JSON.stringify(blockOption))
    const preparedTransactionData = await this._client.prepareTransaction(
      secretManager,
      blockOption,
    );
    console.log(preparedTransactionData)
    const transactionPayload = (await this._client.signTransaction(
      secretManager,
      preparedTransactionData,
    )) as ITransactionPayload;
    console.log(transactionPayload)

    const [blockId,block] = await this._client.postBlockPayload(transactionPayload);
  
    console.log(blockId,block);
  }
  ed2bech32(address:HexEncodedString){
      this._client?.hexToBech32(address,'rms')
  }

  parseLayer2MetadataForTransfer(metadataHex: string): ILayer2TransferAllowanceMetadata {
    const metadata = Converter.hexToBytes(metadataHex)
    const readStream = new ReadStream(metadata)

    const senderContract = readStream.readUInt32('senderContract')
    const targetContract = readStream.readUInt32('targetContract')
    const contractFunction = readStream.readUInt32('contractFunction')
    const gasBudget = readStream.readUInt64('gasBudget')

    const smartContractParameters = this._parseSmartContractParameters(readStream)
    const ethereumAddress = '0x' + smartContractParameters['a'].substring(2)

    const allowance = this._parseAllowance(readStream)

    return {
        senderContract: decimalToHex(senderContract, true),
        targetContract: TARGET_CONTRACTS[targetContract] ?? decimalToHex(targetContract, true),
        contractFunction: CONTRACT_FUNCTIONS[contractFunction] ?? decimalToHex(contractFunction, true),
        gasBudget: gasBudget.toString(),
        ethereumAddress,
        baseTokenAmount: allowance?.baseTokenAmount,
        nativeTokens: allowance?.nativeTokens,
    }
}

  private _parseSmartContractParameters(readStream: ReadStream): Record<string, string> {
      const smartContractParametersAmount = readStream.readUInt32('parametersLength')
      const smartContractParameters: Record<string, string> = {}

      for (let index = 0; index < smartContractParametersAmount; index++) {
          const keyLength = readStream.readUInt16('keyLength')
          const keyBytes = readStream.readBytes('keyValue', keyLength)

          const valueLength = readStream.readUInt32('valueLength')
          const valueBytes = readStream.readBytes('valueBytes', valueLength)

          const key = Converter.bytesToUtf8(keyBytes)
          const value = Converter.bytesToHex(valueBytes)

          smartContractParameters[key] = value
      }

      return smartContractParameters
  }

  private _parseAllowance(readStream: ReadStream): ILayer2Allowance {
      const allowance = readStream.readUInt8('allowance')

      if (allowance === Allowance.Set) {
          const baseTokenAmount = readStream.readUInt64('baseTokenAmount').toString()
          readStream.readUInt16('tokenBufferBytesLength')
          const tokenAmount = readStream.readUInt16('tokenAmount')
          const nativeTokens: NativeTokenAmount[] = []

          for (let token = 0; token < tokenAmount; token++) {
              const tokenId = Converter.bytesToHex(readStream.readBytes('tokenId', TOKEN_ID_BYTE_LENGTH))
              const amount = readStream.readUInt256('tokenAmount').toString()
              nativeTokens.push({ tokenId, amount })
          }

          return {
              baseTokenAmount,
              nativeTokens,
          }
      } else {
        //@ts-ignore
          return
      }
  }
}
const instance = new L1ToL2
//@ts-ignore
window.l1tol2 = instance
export default instance





