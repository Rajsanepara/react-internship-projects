import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const Summary: React.FC = () => {
  const { totalIncome, totalExpense, balance } = useTransactions();

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className="summary-grid fade-in">
      <div className="glass-panel summary-card">
        <div className="summary-icon"><DollarSign size={48} /></div>
        <p className="summary-title">Total Balance</p>
        <h3 className={`summary-value ${balance < 0 ? 'text-danger' : 'text-main'}`}>
          {formatter.format(balance)}
        </h3>
      </div>
      
      <div className="glass-panel summary-card">
        <div className="summary-icon text-success"><TrendingUp size={48} /></div>
        <p className="summary-title" style={{ color: "var(--success)" }}>Total Income</p>
        <h3 className="summary-value text-success">
          {formatter.format(totalIncome)}
        </h3>
      </div>

      <div className="glass-panel summary-card">
        <div className="summary-icon text-danger"><TrendingDown size={48} /></div>
        <p className="summary-title" style={{ color: "var(--danger)" }}>Total Expense</p>
        <h3 className="summary-value text-danger">
          {formatter.format(totalExpense)}
        </h3>
      </div>
    </div>
  );
};
