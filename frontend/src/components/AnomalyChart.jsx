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
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#525252" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#737373', fontSize: 11 }} 
            tickFormatter={(tick) => new Date(tick).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            dy={10}
          />
          <YAxis yAxisId="left" stroke="#525252" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11 }} />
          <YAxis yAxisId="right" orientation="right" stroke="#525252" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
          <Tooltip 
            cursor={{ fill: '#171717' }}
            contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#ededed', borderRadius: '0.375rem', fontSize: '12px' }}
            itemStyle={{ color: '#d4d4d4' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#a3a3a3' }} iconType="circle" />
          <Bar yAxisId="left" dataKey="status_mismatch" name="Status Mismatch" stackId="a" fill="#171717" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="left" dataKey="duplicate" name="Duplicates" stackId="a" fill="#262626" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="left" dataKey="missing" name="Missing in Gateway" stackId="a" fill="#404040" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="left" dataKey="amount_mismatch" name="Amount Error" stackId="a" fill="#737373" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="left" dataKey="timestamp_mismatch" name="Time Drift" stackId="a" fill="#a3a3a3" radius={[2, 2, 0, 0]} />
          
          <Line yAxisId="right" type="monotone" dataKey="revenue_at_risk" name="Revenue at Risk" stroke="#ffffff" strokeWidth={2} dot={{ r: 3, fill: '#0a0a0a', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#ffffff' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalyChart;
