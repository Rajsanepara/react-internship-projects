import React from 'react';
import { TransactionProvider } from './context/TransactionContext';
import { Summary } from './components/Summary';
import { TransactionForm } from './components/TransactionForm';
import { SummaryChart } from './components/SummaryChart';
import { TransactionList } from './components/TransactionList';
import { MonthFilter } from './components/MonthFilter';
import { useTransactions } from './hooks/useTransactions';
import { useMonthFilter } from './hooks/useMonthFilter';
import type { Transaction } from './types/transaction';
import { Wallet } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { transactions } = useTransactions();
  const { selectedMonth, setSelectedMonth, filteredTransactions } = useMonthFilter(transactions);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | undefined>(undefined);

  return (
    <div className="app-container fade-in">
      <header className="header">
        <div className="header-icon">
          <Wallet size={32} />
        </div>
        <div>
          <h1 className="header-title">Expense Tracker</h1>
          <p className="header-subtitle">Manage your finances with clarity.</p>
        </div>
      </header>

      <Summary />

      <div className="main-grid">
        <div className="left-column">
           <TransactionForm 
              key={editingTransaction ? editingTransaction.id : 'new-form'}
              initialData={editingTransaction} 
              onSuccess={() => setEditingTransaction(undefined)} 
           />
           <SummaryChart />
        </div>

        <div className="right-column">
          <div className="list-header">
            <h2 className="list-title">Your History</h2>
          </div>
          
          <MonthFilter selectedMonth={selectedMonth} onChange={setSelectedMonth} />
          
          <TransactionList 
             transactions={filteredTransactions} 
             onEditRequest={setEditingTransaction}
          />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TransactionProvider>
      <Dashboard />
    </TransactionProvider>
  );
};

export default App;
