import React from 'react';

const TransactionTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="p-6 text-center text-slate-500">No anomalous records found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-dark-900 border-b border-slate-700/50">
            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Transaction ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Anomaly Type</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Mismatch</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {data.map((tx) => (
            <tr key={tx.id} className="hover:bg-dark-900/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">
                {tx.id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                {new Date(tx.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                ${tx.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                {tx.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                  tx.anomaly_type === 'STATUS_MISMATCH' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]' :
                  tx.anomaly_type === 'MISSING_IN_GATEWAY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]' :
                  tx.anomaly_type === 'DUPLICATE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {tx.anomaly_type ? tx.anomaly_type.replace(/_/g, ' ') : 'NORMAL'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                {tx.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
