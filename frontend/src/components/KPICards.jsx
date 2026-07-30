import React from 'react';
import { Database, AlertTriangle, DollarSign } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="tour-kpis">
      {cards.map((card, idx) => (
        <div key={idx} className="p-6 rounded-lg border border-zinc-800 bg-[#111] flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <p className="text-zinc-400 text-sm font-medium tracking-wide">{card.title}</p>
              {card.title === "Total Processed" && <InfoTooltip text="The total volume of transactions successfully parsed by ReconAI today." position="right" />}
              {card.title === "Anomalies Detected" && <InfoTooltip text="Transactions that failed reconciliation due to mismatches in status, amount, or time." position="right" />}
              {card.title === "Revenue at Risk" && <InfoTooltip text="The total dollar amount of failed or mismatched transactions currently blocked." position="left" />}
            </div>
            <div className="text-zinc-600">{card.icon}</div>
          </div>
          <div>
            <p className="text-3xl font-semibold text-zinc-100 tracking-tight">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
