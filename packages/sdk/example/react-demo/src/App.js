import React, { useEffect, useState, useRef } from 'react';
import IotaSDK from 'tanglepaysdk-client';
import './App.css';

function App() {
  const [installed, setInstalled] = useState(false);
  const iota = useRef(IotaSDK).current;

  useEffect(() => {
    console.log('effect called');
    iota._events.on('iota-ready', async () => {
      console.log('iota-ready');
      iota.on('accountsChanged', changeAccountHandler);
      setInstalled(true);
      await connect();
    });
  }, []);

  const [texts, setTexts] = useState([]);

  const showText = (text) => {
    setTexts((s) => [...s, text]);
  };

  const connect = async () => {
    try {
      const res = await iota.request({
        method: 'iota_connect',
        params: {
          // expires: 3000000
        },
      });
      showText(`Connect result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`Connect result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const changeAccountHandler = (e) => {
    showText(`Switch account event: ${JSON.stringify(e)}`);
  };

  const [signData, setSignData] = useState({ content: '' });
  const sign = async () => {
    const { content } = signData;
    if (!content) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'iota_sign',
        params: {
          content,
        },
      });
      showText(`Sign result: ${JSON.stringify(res)}`);
    } catch (error) {
      showText(`Sign result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const getAccounts = async () => {
    try {
      const res = await iota.request({
        method: 'iota_accounts',
      });
      showText(`GetAccounts result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`GetAccounts result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const [assetsList, setAssetsList] = useState([]);
  const getBalances = async () => {
    if (assetsList.length) {
      try {
        // iota balance
        const res = await iota.request({
          method: 'iota_getBalance',
          params: {
            assetsList, // ['iota','soonaverse','smr','asmb']
            // addressList:addressList,
            addressList: [], // current addressList
          },
        });
        showText(`Get balance result: ${JSON.stringify(res)}`);
        return res;
      } catch (error) {
        showText(`Get balance result: ${JSON.stringify(error)}`);
        return error;
      }
    }
  };

  const [assetsListShimmer, setAssetsListShimmer] = useState([]);
  const getBalancesShimmer = async (addressList) => {
    if (assetsListShimmer.length) {
      try {
        // shimmer balance
        const res = await iota.request({
          method: 'iota_getBalance',
          params: {
            assetsListShimmer, // ['smr']
            // addressList:addressList,
            addressList: [], // current addressList
          },
        });

        showText(`Get balance(shimmer) result: ${JSON.stringify(res)}`);
        return res;
      } catch (error) {
        showText(`Get balance(shimmer) result: ${JSON.stringify(error)}`);
        return error;
      }
    }
  };

  const [iotaSendData, setIotaSendData] = useState({
    address: '',
    amount: '',
    data: '',
    unit: 'IOTA',
    metadata: '',
    tag: '',
  });
  const sendTransaction = async () => {
    const { address, amount, data, tag, unit, metadata } = iotaSendData;
    if (!address || !amount) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'iota_sendTransaction',
        params: {
          to: address,
          value: parseFloat(amount),
          data,
          unit,
          tag,
          metadata
        },
      });

      showText(`Send Transaction result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`Send Transaction result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const [shimmerSendData, setShimmerSendData] = useState({
    address: '',
    amount: '',
    data: '',
    tag: '',
    metadata: '',
    unit: 'SMR',
  });
  const sendTransactionShimmer = async () => {
    const { address, amount, data, tag, unit, metadata } = shimmerSendData;
    if (!address || !amount) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'iota_sendTransaction',
        params: {
          to: address,
          value: parseFloat(amount),
          data,
          unit,
          tag,
          metadata,
        },
      });

      showText(`Send Transaction result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`Send Transaction result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const [sendShimmerTokenData, setSendShimmerTokenData] = useState({
    address: '',
    amount: '',
    data: '',
    tag: '',
    assetId: '',
    metadata: '',
  });
  const sendTransactionShimmerToken = async () => {
    const { address, amount, data, tag, assetId, metadata } =
      sendShimmerTokenData;
    if (!address || !amount || !assetId) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'iota_sendTransaction',
        params: {
          to: address,
          value: parseFloat(amount),
          data,
          assetId,
          tag,
          metadata,
        },
      });

      showText(`Send Transaction result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`Send Transaction result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const [sendShimmerNFTData, setSendShimmerNFTData] = useState({
    address: '',
    data: '',
    tag: '',
    nftId: '',
    metadata: '',
  });
  const sendTransactionShimmerNft = async () => {
    const { address, data, tag, metadata, nftId } = sendShimmerNFTData;
    if (!address || !nftId) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'iota_sendTransaction',
        params: {
          to: address,
          data,
          nftId,
          tag,
          metadata,
        },
      });

      showText(`Send Transaction result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`Send Transaction result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const [iotaNetwork, setIotaNetwork] = useState('');
  const changeAccount = async () => {
    if (!iotaNetwork) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'iota_changeAccount',
        params: {
          network: iotaNetwork, //mainnet ,iota-evm
        },
      });

      showText(`Change Account result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`Change Account result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const [address, setAddress] = useState('');
  const getPublicKey = async () => {
    if (!address) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'iota_getPublicKey',
        params: { address },
      });
      showText(`Get publicKey result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`Get publicKey result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const [personalSignContent, setPersonalSignContent] = useState('');
  const ethPersonalSign = async (bool) => {
    if (!personalSignContent) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'personal_sign',
        params: {
          content: personalSignContent,
        },
      });
      showText(`Sign result: ${JSON.stringify(res)}`);
    } catch (error) {
      showText(`Sign result: ${JSON.stringify(error)}`);
    }
  };

  const [ethAssetsList, setEthAssetsList] = useState([]);
  const getEthBalances = async (addressList) => {
    if (ethAssetsList.length <= 0) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'eth_getBalance',
        params: {
          assetsList: ethAssetsList, // ['evm','soonaverse']
          // addressList:addressList,
          addressList: [], // current addressList
        },
      });

      showText(`Get eth balance result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`Get eth balance result: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const [sendContractData, setSendContractData] = useState({
    address: '',
    data: '',
  });
  const ethSendContractTransaction = async () => {
    const { address, data } = sendContractData;
    if (!address || !data) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'eth_sendTransaction',
        params: {
          to: address,
          data,
        },
      });

      showText(`Send Transaction result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`Send Transaction result: ${error}`);
      return error;
    }
  };

  const [importContractData, setImportContractData] = useState({
    contract: '',
  });
  const ethImportContract = async () => {
    const { contract } = importContractData;
    if (!contract) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'eth_importContract',
        params: {
          contract,
        },
      });

      showText(`import contract result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`import contract error: ${JSON.stringify(error)}`);
      return error;
    }
  };

  const [importNFTData, setImportNFTData] = useState({
    nft: '',
    tokenId: undefined,
  });
  const ethImportNFT = async () => {
    const { nft, tokenId } = importNFTData;
    if (!nft || !tokenId) {
      return;
    }
    try {
      const res = await iota.request({
        method: 'eth_importNFT',
        params: {
          nft,
          tokenId: parseInt(tokenId),
        },
      });

      showText(`import nft result: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      showText(`import nft error: ${JSON.stringify(error)}`);
      return error;
    }
  };

  return (
    <div className="App">
      <Header />
      <h2>Wallet status</h2>
      <div id="status">
        {installed ? (
          <div>
            <p>TanglePay installed</p>
            <p>Version {iota.tanglePayVersion || '--'}</p>
          </div>
        ) : (
          'TanglePay not installed'
        )}
      </div>
      <div className="content">
        <div className="left">
          <h2>API examples</h2>

          <div className="block">
            <h4>iota_connect</h4>
            <button onClick={connect} className="btn btn-primary">
              Connect
            </button>
          </div>

          <div className="block">
            <h4>iota_sign</h4>
            <div className="address-input">
              <input
                id="sign_data"
                type="text"
                placeholder="content"
                value={signData.content}
                onChange={(e) => setSignData({ content: e.target.value })}
              />
            </div>
            <button onClick={sign} className="btn btn-primary">
              Sign
            </button>
          </div>
          <div className="block">
            <h4>iota_accounts</h4>
            <button onClick={getAccounts} className="btn btn-primary">
              Get accounts
            </button>
          </div>
          <div className="block">
            <h4>iota_getBalance</h4>
            <div className="radio-con">
              {[
                { value: 'iota' },
                { value: 'soonaverse' },
                { value: 'smr' },
                { value: 'asmb' },
              ].map(({ value }) => (
                <span key={value}>
                  <input
                    type="checkbox"
                    checked={assetsList.includes(value)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        setAssetsList((s) => [...s, value]);
                      } else {
                        setAssetsList((s) => s.filter((i) => i !== value));
                      }
                    }}
                  />
                  <span>{value}</span>
                </span>
              ))}
            </div>
            <button onClick={getBalances} className="btn btn-primary">
              Get balances
            </button>
          </div>

          <div className="block">
            <h4>iota_getBalance ( shimmer )</h4>
            <div className="radio-con">
              {[{ value: 'smr' }, { value: 'soonaverse' }].map(({ value }) => (
                <span key={value}>
                  <input
                    type="checkbox"
                    checked={assetsListShimmer.includes(value)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        setAssetsListShimmer((s) => [...s, value]);
                      } else {
                        setAssetsListShimmer((s) =>
                          s.filter((i) => i !== value),
                        );
                      }
                    }}
                  />
                  <span>{value}</span>
                </span>
              ))}
            </div>
            <button onClick={getBalancesShimmer} className="btn btn-primary">
              Get balances ( shimmer )
            </button>
          </div>
          <div className="block">
            <h4>iota_sendTransaction</h4>
            <div className="address-input">
              <input
                id="iota_address"
                type="text"
                value={iotaSendData.address}
                onChange={(e) =>
                  setIotaSendData((s) => ({
                    ...s,
                    address: e.target.value,
                  }))
                }
                placeholder="send to ( address ) "
              />
              <input
                id="iota_amount"
                type="number"
                placeholder="amount"
                value={iotaSendData.amount}
                onChange={(e) =>
                  setIotaSendData((s) => ({
                    ...s,
                    amount: e.target.value,
                  }))
                }
              />
              <input
                id="iota_metadata"
                placeholder="metadata"
                value={iotaSendData.metadata}
                onChange={(e) =>
                  setIotaSendData((s) => ({
                    ...s,
                    metadata: e.target.value,
                  }))
                }
              />
              <input
                id="iota_tag"
                placeholder="tag"
                value={iotaSendData.tag}
                onChange={(e) =>
                  setIotaSendData((s) => ({
                    ...s,
                    tag: e.target.value,
                  }))
                }
              />
              <input
                id="iota_data"
                placeholder="data"
                value={iotaSendData.data}
                onChange={(e) =>
                  setIotaSendData((s) => ({
                    ...s,
                    data: e.target.value,
                  }))
                }
              />
              <input
                id="iota_unit"
                placeholder="unit (Optional)"
                value={iotaSendData.unit}
                onChange={(e) =>
                  setIotaSendData((s) => ({
                    ...s,
                    unit: e.target.value,
                  }))
                }
              />
            </div>
            <button onClick={sendTransaction} className="btn btn-primary">
              Send Transaction
            </button>
          </div>
          <div className="block">
            <h4>shimmer_sendTransaction</h4>
            <div className="address-input">
              <input
                id="shimmer_address"
                type="text"
                placeholder="send to ( address ) "
                value={shimmerSendData.address}
                onChange={(e) =>
                  setShimmerSendData((s) => ({
                    ...s,
                    address: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_amount"
                type="number"
                placeholder="amount"
                value={shimmerSendData.amount}
                onChange={(e) =>
                  setShimmerSendData((s) => ({
                    ...s,
                    amount: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_tag"
                placeholder="tag"
                value={shimmerSendData.tag}
                onChange={(e) =>
                  setShimmerSendData((s) => ({
                    ...s,
                    tag: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_metadata"
                placeholder="metadata"
                value={shimmerSendData.metadata}
                onChange={(e) =>
                  setShimmerSendData((s) => ({
                    ...s,
                    metadata: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_data"
                placeholder="data"
                value={shimmerSendData.data}
                onChange={(e) =>
                  setShimmerSendData((s) => ({
                    ...s,
                    data: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_unit"
                placeholder="unit (Optional)"
                value={shimmerSendData.unit}
                onChange={(e) =>
                  setShimmerSendData((s) => ({
                    ...s,
                    unit: e.target.value,
                  }))
                }
              />
            </div>
            <button
              onClick={sendTransactionShimmer}
              className="btn btn-primary">
              Send Transaction
            </button>
          </div>
        </div>

        <div className="middle">
          <div className="block">
            <h4>shimmer_token_sendTransaction</h4>
            <div className="address-input">
              <input
                id="shimmer_token_address"
                type="text"
                placeholder="send to ( address ) "
                value={sendShimmerTokenData.address}
                onChange={(e) =>
                  setSendShimmerTokenData((s) => ({
                    ...s,
                    address: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_token_amount"
                type="number"
                placeholder="amount"
                value={sendShimmerTokenData.amount}
                onChange={(e) =>
                  setSendShimmerTokenData((s) => ({
                    ...s,
                    amount: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_token_tag"
                placeholder="tag"
                value={sendShimmerTokenData.tag}
                onChange={(e) =>
                  setSendShimmerTokenData((s) => ({
                    ...s,
                    tag: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_token_metadata"
                placeholder="metadata"
                value={sendShimmerTokenData.metadata}
                onChange={(e) =>
                  setSendShimmerTokenData((s) => ({
                    ...s,
                    metadata: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_token_data"
                placeholder="data"
                value={sendShimmerTokenData.data}
                onChange={(e) =>
                  setSendShimmerTokenData((s) => ({
                    ...s,
                    data: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_token_assetId"
                placeholder="assetId"
                value={sendShimmerTokenData.assetId}
                onChange={(e) =>
                  setSendShimmerTokenData((s) => ({
                    ...s,
                    assetId: e.target.value,
                  }))
                }
              />
            </div>
            <button
              onClick={sendTransactionShimmerToken}
              className="btn btn-primary">
              Send Transaction
            </button>
          </div>
          <div className="block">
            <h4>shimmer_nft_sendTransaction</h4>
            <div className="address-input">
              <input
                id="shimmer_nft_address"
                type="text"
                placeholder="send to ( address ) "
                value={sendShimmerNFTData.address}
                onChange={(e) =>
                  setSendShimmerNFTData((s) => ({
                    ...s,
                    address: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_nft_tag"
                placeholder="tag"
                value={sendShimmerNFTData.tag}
                onChange={(e) =>
                  setSendShimmerNFTData((s) => ({
                    ...s,
                    tag: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_nft_metadata"
                placeholder="metadata"
                value={sendShimmerNFTData.metadata}
                onChange={(e) =>
                  setSendShimmerNFTData((s) => ({
                    ...s,
                    metadata: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_nft_data"
                placeholder="data"
                value={sendShimmerNFTData.data}
                onChange={(e) =>
                  setSendShimmerNFTData((s) => ({
                    ...s,
                    data: e.target.value,
                  }))
                }
              />
              <input
                id="shimmer_nft_assetId"
                placeholder="nftId"
                value={sendShimmerNFTData.nftId}
                onChange={(e) =>
                  setSendShimmerNFTData((s) => ({
                    ...s,
                    nftId: e.target.value,
                  }))
                }
              />
            </div>
            <button
              onClick={sendTransactionShimmerNft}
              className="btn btn-primary">
              Send Transaction
            </button>
          </div>
          <div className="block">
            <h4>iota_changeAccount</h4>
            <div className="radio-con">
              {[
                { value: 'mainnet', label: 'iota mainnet' },
                { value: 'iota-evm', label: 'iota-evm' },
                {
                  value: 'bsc',
                  label: 'bsc',
                },
              ].map(({ value, label }) => (
                <span key={value}>
                  <input
                    type="radio"
                    name="changeAccount"
                    checked={iotaNetwork === value}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        setIotaNetwork(value);
                      }
                    }}
                  />
                  <span>{label}</span>
                </span>
              ))}
            </div>
            <button onClick={changeAccount} className="btn btn-primary">
              Change Account
            </button>
          </div>
          <div className="block">
            <h4>iota_getPublicKey</h4>
            <div className="address-input">
              <input
                id="public_key_address"
                type="text"
                placeholder="publickey address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button onClick={getPublicKey} className="btn btn-primary">
              Get PublicKey
            </button>
          </div>
          <div className="block">
            <h4>personal_sign</h4>
            <div className="address-input">
              <input
                id="sign_eth_data"
                type="text"
                placeholder="content"
                value={personalSignContent}
                onChange={(e) => setPersonalSignContent(e.target.value)}
              />
            </div>
            <button onClick={ethPersonalSign} className="btn btn-primary">
              Personal Sign
            </button>
          </div>
          <div className="block">
            <h4>eth_getBalance</h4>
            <div className="radio-con">
              {[{ value: 'evm' }, { value: 'soonaverse' }].map(({ value }) => (
                <span key={value}>
                  <input
                    type="checkbox"
                    checked={ethAssetsList.includes(value)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        setEthAssetsList((s) => [...s, value]);
                      } else {
                        setEthAssetsList((s) => s.filter((i) => i !== value));
                      }
                    }}
                  />
                  <span>{value}</span>
                </span>
              ))}
            </div>
            <button onClick={getEthBalances} className="btn btn-primary">
              Get Eth balances
            </button>
          </div>
          <div className="block">
            <h4>eth_sendTransaction (contract)</h4>
            <div className="address-input">
              <input
                id="eth_contract_address"
                type="text"
                placeholder="send to ( address ) "
                value={sendContractData.address}
                onChange={(e) =>
                  setSendContractData((s) => ({
                    ...s,
                    address: e.target.value,
                  }))
                }
              />
              <input
                id="eth_contract_data"
                placeholder="data"
                value={sendContractData.data}
                onChange={(e) =>
                  setSendContractData((s) => ({
                    ...s,
                    data: e.target.value,
                  }))
                }
              />
            </div>
            <button
              onClick={ethSendContractTransaction}
              className="btn btn-primary">
              ETH Send Transaction
            </button>
          </div>
          <div className="block">
            <h4>eth_importContract (contract)</h4>
            <div className="address-input">
              <input
                id="eth_import_contract"
                type="text"
                placeholder="contract"
                value={importContractData.contract}
                onChange={(e) =>
                  setImportContractData((s) => ({
                    ...s,
                    contract: e.target.value,
                  }))
                }
              />
            </div>
            <button onClick={ethImportContract} className="btn btn-primary">
              ETH Import Contract
            </button>
          </div>
          <div className="block">
            <h4>eth_importNFT</h4>
            <div className="address-input">
              <input
                id="eth_import_contract"
                type="text"
                placeholder="contract"
                value={importNFTData.nft}
                onChange={(e) =>
                  setImportNFTData((s) => ({
                    ...s,
                    nft: e.target.value,
                  }))
                }
              />
              <input
                id="eth_import_contract"
                type="text"
                placeholder="tokenId"
                value={importNFTData.tokenId}
                onChange={(e) =>
                  setImportNFTData((s) => ({
                    ...s,
                    tokenId: e.target.value,
                  }))
                }
              />
            </div>
            <button onClick={ethImportNFT} className="btn btn-primary">
              ETH Import NFT
            </button>
          </div>
        </div>

        <div className="right">
          <div id="text">
            {texts.map((text, index) => (
              <div key={index} style={{ marginTop: 30 }}>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <>
      <h2>TanglePay-SDK</h2>
      Hi, this is the demo site of integrating your DApp with IOTA using
      TanglePay wallet.
      <br />
      For more details, please refer to the spec
      <a
        href="https://github.com/TanglePay/TanglePay-SDK"
        rel="noreferrer"
        style={{ marginLeft: 8 }}
        target="_blank">
        here
      </a>
      .
    </>
  );
}

export default App;
