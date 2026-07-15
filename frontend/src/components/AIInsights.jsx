import React from 'react';
import { Bot, AlertCircle, CheckCircle2 } from 'lucide-react';

const AIInsights = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
        <Bot size={40} className="text-slate-600 opacity-50" />
        <p>No insights generated yet.</p>
        <p className="text-sm">Click "Run AI Diagnostics" above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((insight) => (
        <div key={insight.id} className="relative bg-dark-900 rounded-lg p-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-[0_0_10px_rgba(79,70,229,0.5)]">
              {insight.anomaly_type.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-indigo-300 font-medium bg-indigo-500/10 px-2 py-1 rounded-full">
              {insight.affected_count} records
            </span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-rose-400 mb-1">
                <AlertCircle size={16} />
                <h4 className="text-sm font-semibold text-slate-200">Root Cause Summary</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-5 font-light">
                {insight.root_cause_summary}
              </p>
            </div>
            
            <div className="pt-2 border-t border-slate-700/50">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <CheckCircle2 size={16} />
                <h4 className="text-sm font-semibold text-slate-200">Recommended Action</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-5 font-light">
                {insight.recommended_action}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIInsights;
