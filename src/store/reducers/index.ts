import { History } from "history";
import { combineReducers } from "redux";
import { Wallet } from "../../use-wallet/types";
import * as todoReducer from "./todo";

export interface RootState {
  allTransaction: any[]
  wallet:Wallet
}

export default (history: History) =>
	combineReducers({
		...todoReducer,
	});