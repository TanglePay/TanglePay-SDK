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
  INftOutput,
  ICommonOutput,
  OutputTypes,
} from '@iota/types';
const DEFAULT_PROTOCOL_VERSION = 2;
import {
  ACCOUNTS_CONTRACT,
  CONTRACT_ADDRESS,
  CONTRACT_ALIAS_ID,
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
  async setup(path?:string){
    await init(path ? path : './client_wasm_bg.wasm');
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
  
  async getOutputForNftSend(
    nftId: string
  ){
    const outputs = await this.getNftOutputs();
    if (!outputs) return;
    for (const outputResp of outputs) {
        if ((outputResp.output as INftOutput ).nftId === nftId) {
          return outputResp;
        }
    }
    
  }
  
  async getNftOutputs():Promise<IOutputResponse[]|undefined>{
    if (!this._client) return
    const outputIdsResponse = await this._client.nftOutputIds([
      { address:this._fromAddressBech32??'' },
    ]);
    let addressOutputs = await this._client.getOutputs(outputIdsResponse);
    console.log('all nft outputs',addressOutputs)
    return addressOutputs;
  }
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
    console.log('all outputs',addressOutputs)
    // Filter out spent outputs
    addressOutputs = addressOutputs.filter(o=>!o.metadata.isSpent)
    console.log('unspent outputs',addressOutputs)
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
  private _getAmountFromTransactionDetails({rawAmount,nftId,nativeTokenId,surplus}:{
    rawAmount: string;
    nftId?: string;
    nativeTokenId?: string;
    surplus?: string;
  }){
    if (!nftId) {
      
      if (nativeTokenId) {
          rawAmount = surplus ?? '0'
      } else {
          rawAmount = BigInt(rawAmount).toString()
      }
  } else if (nftId) {
      rawAmount = surplus ?? '0'
  } else {
      rawAmount = '0'
  }
    return rawAmount ?? '0';
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
      nftOutput?: INftOutput;
      expirationDate?: Date;
    },
  ): Promise<IBasicOutput | INftOutput> {
    if (!this._client) throw new Error('client not init')
    let {
      nativeTokenId,
      metadata,
      tag,
      giftStorageDeposit,
      surplus,
      layer2Parameters,
      nftId,
      nftOutput,
      expirationDate,
    } = ext;
    const unixTime = expirationDate
      ? convertDateToUnixTimestamp(expirationDate)
      : undefined;
    let amount = this._getAmountFromTransactionDetails({rawAmount,nftId,nativeTokenId,surplus});
    amount = layer2Parameters ? this._addGasBudget(amount) : amount; 
    const bigAmount = BigInteger(rawAmount);
  
  
    if (tag != undefined) {
      tag = Converter.utf8ToHex(tag, true);
    }
    metadata = layer2Parameters ? this._getLayer2MetadataForTransfer(
      recipientAddress,
      rawAmount,
      nativeTokenId,
      surplus,
    ) : (metadata ? Converter.utf8ToHex(metadata, true) : metadata);
      
    recipientAddress = layer2Parameters ? await this._client.bech32ToHex(layer2Parameters.networkAddress) : recipientAddress;
    
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
    const unlockConditions: UnlockConditionTypes[] = [{type:0,address:{type:8,aliasId:
      CONTRACT_ALIAS_ID
    }}];
    if (unixTime) {
      unlockConditions.push({ type: 2, unixTime });
    }
    if (nftId && nftOutput) return {
      type:6,
      amount:this._addGasBudget(nftOutput.amount),
      nftId,
      immutableFeatures:nftOutput.immutableFeatures,
      features,
      unlockConditions,
    };
    return {
      type:3,
      amount,
      features,
      unlockConditions,
    };
  }

  async sendTransaction(
    toAddr: string,
    amount: string,
    nftId?: string,
  ){
    if (!(this._client && this._fromAddressBech32)) return;
    let nftOutput:IOutputResponse|undefined
    if (nftId) {
      nftOutput = await this.getOutputForNftSend(nftId);
    }
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
    
    if (nftOutput) {
      inputs.push({
        type: 0,
        transactionId: nftOutput.metadata.transactionId,
        transactionOutputIndex: nftOutput.metadata.outputIndex,
      });
    }
    const outputs: OutputTypes[] = [];
    
    const basicOutput: IBasicOutput | INftOutput = await this._getOutputOptions(
      { type: 0, pubKeyHash: this._fromAddressHex??'' },
      toAddr,
      amount,
      {
        nftId,
        nftOutput: nftOutput?.output as INftOutput,
        layer2Parameters: {
          networkAddress: CONTRACT_ADDRESS,
        },
      },
    );
    console.log('receiveroutputs',basicOutput)
    outputs.push(basicOutput);
    if (totalFunds.gt(amountToSend)) {
      // The remaining output that remains in the origin address
      let remainingFund = totalFunds.minus(BigInteger(basicOutput.amount))
      const remainderBasicOutput: IBasicOutput = {
        type: 3,
        amount: remainingFund.toString(),
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
    console.log(blockOption)
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





