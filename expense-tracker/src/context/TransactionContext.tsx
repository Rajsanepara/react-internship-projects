import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode, Dispatch } from "react";
import type { TransactionState, TransactionAction } from "../types/transaction";

// 1. Initial configuration
const initialState: TransactionState = {
  transactions: [],
};

// 2. Local storage helper for lazy initialization
const init = (initialState: TransactionState): TransactionState => {
  try {
    const localData = localStorage.getItem("expense-tracker-transactions");
    if (localData) {
      return { transactions: JSON.parse(localData) };
    }
  } catch (error) {
    console.error("Failed to load transactions from localStorage", error);
  }
  return initialState;
};

// 3. Reducer: Pure function handling state transitions
export const transactionReducer = (
  state: TransactionState,
  action: TransactionAction
): TransactionState => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "DELETE":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "EDIT":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    default:
      return state;
  }
};

// 4. Context creation
export const TransactionContext = createContext<{
  state: TransactionState;
  dispatch: Dispatch<TransactionAction>;
} | null>(null);

// 5. Provider component
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState, init);

  // Sync to local storage on every transaction shift
  useEffect(() => {
    localStorage.setItem("expense-tracker-transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};
