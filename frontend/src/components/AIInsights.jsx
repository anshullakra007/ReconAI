import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const TypewriterText = ({ text, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return <span>{displayedText}{index < text.length && <span className="animate-pulse">|</span>}</span>;
};

const AIInsights = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
        <p>No diagnostics run. Click "Run Diagnostics" to analyze anomalies.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((insight) => (
        <div key={insight.id} className="p-5 rounded-lg border border-zinc-800 bg-[#111]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-300 border border-zinc-700 bg-zinc-800 text-xs font-medium px-2.5 py-1 rounded">
              {insight.anomaly_type.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-zinc-500">
              {insight.affected_count} records
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                <AlertCircle size={14} />
                <h4 className="text-xs font-medium text-zinc-400">Root Cause</h4>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed pl-5">
                <TypewriterText text={insight.root_cause_summary} speed={10} />
              </p>
            </div>
            
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                <CheckCircle2 size={14} />
                <h4 className="text-xs font-medium text-zinc-400">Recommendation</h4>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed pl-5">
                <TypewriterText text={insight.recommended_action} speed={15} />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIInsights;
