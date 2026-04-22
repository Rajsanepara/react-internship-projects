import React from 'react';
import { Filter } from 'lucide-react';

interface MonthFilterProps {
  selectedMonth: string;
  onChange: (month: string) => void;
}

export const MonthFilter: React.FC<MonthFilterProps> = ({ selectedMonth, onChange }) => {
  return (
    <div className="glass-panel month-filter">
      <Filter size={18} style={{ color: "var(--text-muted)" }} />
      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Filter by Month:</span>
      <input 
        type="month" 
        value={selectedMonth}
        onChange={(e) => onChange(e.target.value)}
        className="filter-input"
      />
      {selectedMonth && (
        <button className="clear-btn" onClick={() => onChange("")}>
          Clear
        </button>
      )}
    </div>
  );
};
