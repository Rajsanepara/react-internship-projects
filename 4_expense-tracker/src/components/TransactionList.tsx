import React from 'react';
import { TransactionItem } from './TransactionItem';
import type { Transaction } from '../types/transaction';
import { Receipt } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onEditRequest: (t: Transaction) => void;
}

export const TransactionList: React.FC<Props> = ({ transactions, onEditRequest }) => {
  if (transactions.length === 0) {
    return (
      <div className="glass-panel empty-state fade-in">
        <Receipt size={48} />
        <h3 style={{ fontSize: "1.125rem", fontWeight: 500, color: "var(--text-main)" }}>No transactions found</h3>
        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", maxWidth: "250px" }}>
          Looks like there are no transactions for this period. Add one above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel fade-in">
      <div className="transaction-list">
        {transactions.map(transaction => (
          <TransactionItem 
             key={transaction.id} 
             transaction={transaction}
             onEdit={onEditRequest}
          />
        ))}
      </div>
    </div>
  );
};
