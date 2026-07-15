import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnomalyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-slate-500">No anomaly data available.</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            tickFormatter={(tick) => new Date(tick).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          />
          <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fill: '#10b981', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
          <Tooltip 
            cursor={{ fill: '#1e293b' }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar yAxisId="left" dataKey="status_mismatch" name="Status Mismatch" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="left" dataKey="duplicate" name="Duplicates" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="left" dataKey="missing" name="Missing in Gateway" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="left" dataKey="amount_mismatch" name="Amount Error" stackId="a" fill="#d946ef" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="left" dataKey="timestamp_mismatch" name="Time Drift" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          
          <Line yAxisId="right" type="monotone" dataKey="revenue_at_risk" name="Revenue at Risk" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalyChart;
