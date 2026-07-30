import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnomalyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-zinc-500">No anomaly data available.</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          {/* Subtle Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          
          <XAxis 
            dataKey="date" 
            stroke="#52525b" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 11 }} 
            tickFormatter={(tick) => new Date(tick).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            dy={10}
          />
          <YAxis 
            yAxisId="left" 
            stroke="#52525b" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 11 }} 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#52525b" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 11 }} 
            tickFormatter={(val) => `$${val}`} 
          />
          
          {/* Clean Flat Tooltip */}
          <Tooltip 
            cursor={{ fill: '#18181b' }} // zinc-900
            contentStyle={{ 
              backgroundColor: '#09090b', // zinc-950
              borderColor: '#27272a', // zinc-800
              color: '#f4f4f5', // zinc-100
              borderRadius: '6px', 
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: '#a1a1aa' }} // zinc-400
            labelStyle={{ color: '#71717a', marginBottom: '4px' }} // zinc-500
          />
          
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#a1a1aa' }} iconType="circle" />
          
          {/* Flat Monochromatic Bars */}
          <Bar yAxisId="left" dataKey="status_mismatch" name="Status Mismatch" stackId="a" fill="#18181b" stroke="#27272a" />
          <Bar yAxisId="left" dataKey="duplicate" name="Duplicates" stackId="a" fill="#27272a" stroke="#3f3f46" />
          <Bar yAxisId="left" dataKey="missing" name="Missing in Gateway" stackId="a" fill="#3f3f46" stroke="#52525b" />
          <Bar yAxisId="left" dataKey="amount_mismatch" name="Amount Error" stackId="a" fill="#52525b" stroke="#71717a" />
          <Bar yAxisId="left" dataKey="timestamp_mismatch" name="Time Drift" stackId="a" fill="#71717a" stroke="#a1a1aa" radius={[2, 2, 0, 0]} />
          
          {/* Sharp Solid Line (No Glow) */}
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="revenue_at_risk" 
            name="Revenue at Risk" 
            stroke="#ffffff" 
            strokeWidth={2} 
            dot={{ r: 3, fill: '#09090b', stroke: '#ffffff', strokeWidth: 2 }} 
            activeDot={{ r: 5, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 }} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalyChart;
