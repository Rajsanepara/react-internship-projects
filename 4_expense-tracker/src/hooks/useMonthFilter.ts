import { useState, useMemo } from "react";
import type { Transaction } from "../types/transaction";

export function useMonthFilter(transactions: Transaction[]) {
  // Use YYYY-MM string as the internal state for HTML month input compatibility
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const filteredTransactions = useMemo(() => {
    if (!selectedMonth) return transactions;
    
    return transactions.filter((t) => {
      const date = new Date(t.date);
      const year = date.getFullYear();
      // getMonth() is 0-indexed, pad start with 0
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}` === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  return {
    selectedMonth,
    setSelectedMonth,
    filteredTransactions,
  };
}
