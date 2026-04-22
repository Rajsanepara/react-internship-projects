import { useContext, useCallback, useMemo } from "react";
import { TransactionContext } from "../context/TransactionContext";
import type { Transaction } from "../types/transaction";

export const useTransactions = () => {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }

  const { state, dispatch } = context;

  const addTransaction = useCallback((transaction: Transaction) => {
    dispatch({ type: "ADD", payload: transaction });
  }, [dispatch]);

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: "DELETE", payload: id });
  }, [dispatch]);

  const editTransaction = useCallback((transaction: Transaction) => {
    dispatch({ type: "EDIT", payload: transaction });
  }, [dispatch]);

  // Derived global state using useMemo to prevent unnecessary recalculations
  const totalIncome = useMemo(() => {
    return state.transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [state.transactions]);

  const totalExpense = useMemo(() => {
    return state.transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [state.transactions]);

  const balance = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  // For charts (Pie chart needs array of {name, value})
  const categoryBreakdown = useMemo(() => {
    const expenseTransactions = state.transactions.filter(t => t.type === "expense");
    const map = new Map<string, number>();

    expenseTransactions.forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });

    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [state.transactions]);

  return {
    transactions: state.transactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    totalIncome,
    totalExpense,
    balance,
    categoryBreakdown
  };
};
