import React from 'react';
import { Database, AlertTriangle, DollarSign } from 'lucide-react';

const KPICards = ({ data }) => {
  const cards = [
    {
      title: "Total Processed",
      value: data.total_processed.toLocaleString(),
      icon: <Database className="text-slate-400" size={18} strokeWidth={1.5} />,
    },
    {
      title: "Anomalies Detected",
      value: data.anomalies_detected.toLocaleString(),
      icon: <AlertTriangle className="text-slate-400" size={18} strokeWidth={1.5} />,
    },
    {
      title: "Revenue at Risk",
      value: `$${data.revenue_at_risk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="text-slate-400" size={18} strokeWidth={1.5} />,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="rounded-xl p-5 border border-dark-border bg-dark-800 flex flex-col justify-between hover:bg-dark-700 transition-colors cursor-default">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-400 text-sm font-medium tracking-wide">{card.title}</p>
            {card.icon}
          </div>
          <div>
            <p className="text-3xl font-semibold text-slate-100 tracking-tight">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
