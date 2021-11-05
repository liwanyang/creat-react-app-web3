import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next'
import logo from '../../image/logo.svg';
import { ChainUnsupportedError, useWallet,useWalletBalancex } from '../../use-wallet'
import { ChainIds, TokenNames} from '../../constants/index';
import { useQueryParam, StringParam } from 'use-query-params';
import EthereumLogo from '../../image/ethereum-logo.png'
import BigNumber from 'bignumber.js';
import { Web3Status } from '../../components/web3-status';
import { getNetworkName, truncateAddressString } from '../../use-wallet/utils';
import { useSelector } from 'react-redux';
import {RootState} from '../../store/reducers'
import { useActions } from '../../store/actions';
import * as ConfigActions from '../../store/actions/todo';
import { useWeb3React } from '@web3-react/core';
import { ChainUnsupportedErrorCom } from '../../components/ChainUnsupportedErrorCom';
import './index.scss'
export const Headers = () => {
  const configActions: typeof ConfigActions =  useActions(ConfigActions);
  
  const { t } = useTranslation();
  const wallet = useWallet()

  const [network] = useQueryParam('network', StringParam);

  useEffect(() => {
    const chainName = network || 'aitd';
    wallet.connect(chainName)
  }, [])
  const { active, error, chainId } = useWeb3React()
  // 获取所有与合约交易的记录；
  const allTransaction: any[] = useSelector((state: RootState) => state.allTransaction);
  const loads = allTransaction.filter(item => item.load).length
  
  const UnSupportChain = getNetworkName(chainId!) === 'Unknown' || chainId === -1
  return (
    <section>
      {UnSupportChain && <ChainUnsupportedErrorCom/>}
      <section className='headers'>
        <header>
          <section className="container">
            <img className="logo" src={logo} alt="" />
            <div className="account-info">
              <div className="blance">
                {new BigNumber(wallet.balancex).toFixed(2)}
                <img src={EthereumLogo} alt="" />
              </div>
              {
                loads ? <Web3Status></Web3Status>:
                (
                  <div className="account">
                    {truncateAddressString(wallet.account || '')}
                  </div>
                )
              }
            </div>
          </section>
        </header>
      </section>
    </section>
  )
}