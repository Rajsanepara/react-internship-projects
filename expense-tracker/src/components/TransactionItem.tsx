import React from 'react';
import type { Transaction } from '../types/transaction';
import { useTransactions } from '../hooks/useTransactions';
import { Trash2, TrendingDown, TrendingUp } from 'lucide-react';

interface Props {
  transaction: Transaction;
  onEdit: (t: Transaction) => void;
}

export const TransactionItem: React.FC<Props> = ({ transaction, onEdit }) => {
  const { deleteTransaction } = useTransactions();
  const isIncome = transaction.type === 'income';

  return (
    <div className={`transaction-item ${isIncome ? 'income' : 'expense'}`}>
      <div className="item-left">
        <div className={`item-icon ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
        <div className="item-details">
          <h4>{transaction.category}</h4>
          <p>{transaction.date}</p>
        </div>
      </div>

      <div className="item-right">
        <span className={`item-amount ${isIncome ? 'text-success' : 'text-danger'}`}>
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </span>
        
        <div className="item-actions">
          <button 
             onClick={() => onEdit(transaction)}
             className="btn-icon"
             aria-label="Edit"
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Edit</span>
          </button>
          <button 
             onClick={() => deleteTransaction(transaction.id)}
             className="btn-icon danger"
             aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
