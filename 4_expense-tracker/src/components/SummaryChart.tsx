import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

export const SummaryChart: React.FC = () => {
  const { categoryBreakdown } = useTransactions();

  if (categoryBreakdown.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <PieChartIcon size={48} />
        <p>No expenses to visualize yet.</p>
        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Add an expense to generate charts.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel fade-in" style={{ display: "flex", flexDirection: "column" }}>
      <h2 className="form-title">
        <PieChartIcon style={{ color: "var(--accent)" }} /> Expenses by Category
      </h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryBreakdown.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => `$${Number(value).toFixed(2)}`}
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
