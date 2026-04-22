import React, { useMemo } from 'react';
import { useForm } from '../hooks/useForm';
import type { Transaction } from '../types/transaction';
import { useTransactions } from '../hooks/useTransactions';
import { PlusCircle, Edit3 } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other Income'];
const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Utilities', 'Shopping', 'Entertainment', 'Healthcare', 'Other Expense'];

interface FormProps {
  initialData?: Transaction;
  onSuccess?: () => void;
}

export const TransactionForm: React.FC<FormProps> = ({ initialData, onSuccess }) => {
  const { addTransaction, editTransaction } = useTransactions();
  
  const isEditing = !!initialData;
  const initialValues = initialData || {
    id: crypto.randomUUID(),
    amount: 0,
    type: 'expense' as const,
    category: EXPENSE_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0]
  };

  const { values, handleChange, setFieldValue, validate, errors, resetForm } = useForm(initialValues);

  const categories = useMemo(() => {
    return values.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  }, [values.type]);

  React.useEffect(() => {
    if (!categories.includes(values.category)) {
      setFieldValue('category', categories[0]);
    }
  }, [values.type, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validate({
      amount: (val) => (!val || val <= 0 ? 'Amount must be greater than 0' : null),
      category: (val) => (!val ? 'Category is required' : null),
      date: (val) => (!val ? 'Date is required' : null)
    });

    if (!isValid) return;

    if (isEditing) {
      editTransaction(values as Transaction);
    } else {
      addTransaction({
        ...(values as Transaction),
        id: crypto.randomUUID()
      });
      resetForm();
      setFieldValue('id', crypto.randomUUID());
    }

    if (onSuccess) onSuccess();
  };

  return (
    <div className="glass-panel fade-in">
      <h2 className="form-title">
        {isEditing ? <Edit3 style={{ color: "var(--accent)" }} /> : <PlusCircle style={{ color: "var(--accent)" }} />}
        {isEditing ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        <div className="type-switch">
          <label>
            <input 
              type="radio" 
              name="type" 
              value="income" 
              checked={values.type === 'income'} 
              onChange={handleChange}
            />
            <span>Income</span>
          </label>
          <label>
            <input 
              type="radio" 
              name="type" 
              value="expense" 
              checked={values.type === 'expense'} 
              onChange={handleChange}
            />
            <span>Expense</span>
          </label>
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input 
            type="number" 
            name="amount" 
            value={values.amount || ''} 
            onChange={handleChange} 
            step="0.01" 
            placeholder="0.00"
            className="input-base"
            style={errors.amount ? { borderColor: "var(--danger)" } : {}}
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            name="category" 
            value={values.category} 
            onChange={handleChange}
            className="input-base"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            name="date" 
            value={values.date} 
            onChange={handleChange}
            className="input-base"
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        <button type="submit" className="btn-primary">
          {isEditing ? 'Save Changes' : 'Add to Tracker'}
        </button>
      </form>
    </div>
  );
};
