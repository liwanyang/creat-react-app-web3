// import { useEffect } from 'react';
// import detectEthereumProvider from '@metamask/detect-provider';
// import Web3 from 'web3';
// import { BridgeSDK } from './bridge-sdk';
// import { useState } from 'react';
// import { useActiveWeb3React, useETHBalances } from './hooks';
// import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
// import { injected } from './connectors';
// const configs = require('./bridge-sdk/configs');

import BN from "bn.js";

// const bridgeSDK = new BridgeSDK({ logLevel: 2 });
const aaa = () => {

  // const [address, setAddress] = useState<string>('')
  // const [fromBalance, setFromBalance] = useState<any>('0')
  // const [allowance, setAllowance] = useState<any>('0')

  // const initBridge = async () => {
  //   console.log('初始化桥......')
  //   console.log('configs.testnet', configs.testnet)
  //   await bridgeSDK.init(configs.testnet);
  //   bridgeSDK.setUseMetamask(true);
  // }

  // const signIn = async () => {
  //   try {
  //     const provider: any = await detectEthereumProvider();

  //     // @ts-ignore
  //     if (provider !== window.ethereum) {
  //       console.error('Do you have multiple wallets installed?');
  //     }

  //     provider.on('accountsChanged', (accounts: string[]) => {
  //       console.log('accounts: ', accounts)
  //       setAddress(accounts[0])
  //     });

  //     provider
  //       .request({ method: 'eth_requestAccounts' })
  //       .then(async (params: any) => {
  //         // @ts-ignore
  //         const web3 = new Web3(window.web3.currentProvider);
  //         await provider.request({
  //           method: 'wallet_requestPermissions',
  //           params: [
  //             {
  //               eth_accounts: {},
  //             },
  //           ],
  //         });
  //       })

  //   } catch (e) {
  //   }
  // }

  // useEffect(() => {
  //   const address = '0xfd74bde80577f3752cfc9a49a8568469f4eebdff'
  //   // setAddress(address)
  //   // initBridge()
  //   // // signIn()
  //   // getBalance(address)
  // }, [])

  // const getBalance = async (address: string) => {
  //   const result = await bridgeSDK.ethClient?.ethMethodsBUSD.checkEthBalance(address);
  //   console.log('res: ', result);
  //   setFromBalance(result)
  // }

  // const transfer = async () => {
  //   const toAddress = '0xCF84767C6177a2EdC829880eD3b87d8482362c0F'
  //   await bridgeSDK.ethClient?.ethMethodsBUSD.depositToken(toAddress, 1, (xxx: any) => {
  //     console.log(xxx)
  //   })
  // }

  // const allowanceFn = async () => {
  //   const xxx = await bridgeSDK.ethClient?.ethMethodsBUSD.allowance((xxx: any) => {
  //     console.log(xxx)
  //   })
  //   console.log('授权额度: ', xxx)
  //   setAllowance(xxx)
  // }

  // const approve = async () => {
  //   bridgeSDK.ethClient?.ethMethodsBUSD.approveEthManger(188, (hash: string) => {
  //     console.log('hash: ', hash)
  //   })
  // }
  
  // const { active, connector, activate, error } = useWeb3React()

  // const userEthBalance = useETHBalances(['0xFd74BDe80577f3752cFC9a49A8568469F4eEBdfF'])

  // console.log('userEthBalance', userEthBalance)

  // useEffect(() => {
  //   activate(injected, undefined, true).catch(error => {
  //     if (error instanceof UnsupportedChainIdError) {
  //       activate(injected)
  //     }
  //   })
  // }, [])
}


