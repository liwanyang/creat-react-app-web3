import { Todo, TodoAction, TodoActions } from '../model/index';
import { RootState } from '../reducers/index';

export function setWallet(wallet: object): TodoAction {
	return {
		type: TodoActions.SET_WALLET,
		payload: wallet,
	};
}
export function addTransaction(transaction: any): TodoAction {
	return {
		type: TodoActions.ADD_TRANSACTION,
		payload: transaction,
	};
}
export function clearTransaction(): TodoAction {
	return {
		type: TodoActions.CLEAR_TRANSACTION,
		payload: [],
	};
}