export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // Sticking to ISO string for easier serialization
}

export interface Category {
  name: string;
}

export interface TransactionState {
  transactions: Transaction[];
}

export type TransactionAction =
  | { type: "ADD"; payload: Transaction }
  | { type: "DELETE"; payload: string }
  | { type: "EDIT"; payload: Transaction };
