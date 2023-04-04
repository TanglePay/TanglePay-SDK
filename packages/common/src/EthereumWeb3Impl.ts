import Web3 from 'web3';
import type { BlockNumber } from 'web3-core';

let client_: Web3 | undefined;

export const setWeb3Client = (client: Web3) => {
  client_ = client;
};

// eth_getBlockByNumber
export const ethGetBlockByNumber = async (
  blockHashOrBlockNumber: BlockNumber | string,
  returnTransactionObjects: boolean,
) => {
  // @ts-ignore
  const res = await client_?.eth.getBlock(blockHashOrBlockNumber,returnTransactionObjects);
  return res;
};

// eth_gasPrice
export const ethGasPrice = async () => {
  const res = await client_?.eth.getGasPrice();
  return res;
};

// eth_sign
export const ethSign = async (dataToSign: string, address: string) => {
  const res = await client_?.eth.sign(dataToSign, address);
  return res;
};

// eth_personal_sign
export const ethPersonalSign = async (
  dataToSign: string,
  address: string,
  password: string,
) => {
  const res = await client_?.eth.personal.sign(dataToSign, address, password);
  return res;
};
