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
        <div key={insight.id} className="relative bg-dark-900 rounded-lg p-4 border border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-dark-800 text-slate-300 border border-dark-border text-xs font-semibold px-2 py-1 rounded">
              {insight.anomaly_type.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {insight.affected_count} records
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                <AlertCircle size={14} />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Root Cause</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-5 font-normal">
                {insight.root_cause_summary}
              </p>
            </div>
            
            <div className="pt-3 border-t border-dark-border">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                <CheckCircle2 size={14} />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recommendation</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-5 font-normal">
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
