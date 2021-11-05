export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export enum TodoActions {
  WALLET_LOADING="WALLET_LOADING",
  SET_WALLET="SET_WALLET",
  ADD_TRANSACTION="ADD_TRANSACTION",
  CLEAR_TRANSACTION="CLEAR_TRANSACTION"
}

interface TodoActionType<T, P> {
  type: T;
  payload: P;
}

export type TodoAction =
    | TodoActionType<typeof TodoActions.WALLET_LOADING, boolean>
    | TodoActionType<typeof TodoActions.SET_WALLET, any>
    | TodoActionType<typeof TodoActions.ADD_TRANSACTION, any[]>
    | TodoActionType<typeof TodoActions.CLEAR_TRANSACTION, any[]>
;