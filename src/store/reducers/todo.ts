import { Wallet } from '../../use-wallet/types';
import { Todo, TodoAction, TodoActions } from '../model/index';
import createReducer from './createReducer';

export const allTransaction= createReducer<any[]>([], {
	[TodoActions.ADD_TRANSACTION](state: any[], action: TodoAction) {
    const lengths = state.filter(item => item.type=== action.payload.type).length
    if (lengths) {
      const obj = JSON.parse(JSON.stringify(state))
      obj.forEach((item: { type: any; load: any; }) => {
        if (item.type=== action.payload.type) {
          return item.load = action.payload.load
        }
        return item
      })
      return obj
    }
    return [...state, action.payload]
	},
  [TodoActions.CLEAR_TRANSACTION] (state: any[], action: TodoAction) {
    return action.payload
  }
})
export const wallet = createReducer<any>({}, {
	[TodoActions.SET_WALLET](state: any, action: TodoAction) {
		return {
      account: action.payload.account,
      balance: action.payload.balance,
      balancex: action.payload.balancex,
      // chainId: action.payload.chainId,
      // connect: action.payload.connect,
      // connector: action.payload.connector,
      // connectors: action.payload.connectors,
      // error: action.payload.error,
      // ethereum: action.payload.ethereum,
      // getBlockNumber:action.payload.getBlockNumber,
      // networkName: action.payload.networkName,
      // reset: action.payload.reset,
      // status: action.payload.status,
      // type: action.payload.type,
      totalDepositBalance: action.payload.totalDepositBalance,
      totalLoanBalance: action.payload.totalLoanBalance,
      totalLoanableBalance: action.payload.totalLoanableBalance,
    }
	}
});