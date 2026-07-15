import React from 'react';
import { Database, AlertTriangle, DollarSign } from 'lucide-react';

const KPICards = ({ data }) => {
  const cards = [
    {
      title: "Total Processed",
      value: data.total_processed.toLocaleString(),
      icon: <Database className="text-blue-400" size={24} />,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Anomalies Detected",
      value: data.anomalies_detected.toLocaleString(),
      icon: <AlertTriangle className="text-amber-400" size={24} />,
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      title: "Revenue at Risk",
      value: `$${data.revenue_at_risk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="text-rose-400" size={24} />,
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`rounded-xl p-6 border ${card.borderColor} bg-dark-800 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between`}>
          <div>
            <p className="text-slate-400 text-sm font-medium">{card.title}</p>
            <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
          </div>
          <div className={`p-4 rounded-full ${card.bgColor}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
