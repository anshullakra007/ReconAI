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
        <tbody className="divide-y divide-dark-border">
          {data.map((tx) => (
            <tr key={tx.id} className="hover:bg-dark-900 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">
                {tx.id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                {new Date(tx.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                ${tx.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                {tx.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 text-xs font-medium rounded border ${
                  tx.anomaly_type === 'STATUS_MISMATCH' ? 'bg-dark-900 text-slate-300 border-slate-600' :
                  tx.anomaly_type === 'MISSING_IN_GATEWAY' ? 'bg-dark-900 text-slate-300 border-slate-600' :
                  tx.anomaly_type === 'DUPLICATE' ? 'bg-dark-900 text-slate-300 border-slate-600' :
                  'bg-dark-900 text-slate-300 border-slate-700'
                }`}>
                  {tx.anomaly_type ? tx.anomaly_type.replace(/_/g, ' ') : 'NORMAL'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
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
