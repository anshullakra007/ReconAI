import React from 'react';
import InfoTooltip from './InfoTooltip';

const TransactionTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="p-6 text-center text-slate-500">No anomalous records found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-[#111]">
            <th className="px-6 py-4 font-medium text-zinc-400 text-xs">Transaction ID</th>
            <th className="px-6 py-4 font-medium text-zinc-400 text-xs">Date</th>
            <th className="px-6 py-4 font-medium text-zinc-400 text-xs">Amount</th>
            <th className="px-6 py-4 font-medium text-zinc-400 text-xs">Source <InfoTooltip text="Where the data originated (INTERNAL Ledger vs GATEWAY Logs)." position="bottom" /></th>
            <th className="px-6 py-4 font-medium text-zinc-400 text-xs">Type <InfoTooltip text="The specific categorization of the anomaly." position="bottom" /></th>
            <th className="px-6 py-4 font-medium text-zinc-400 text-xs">Status Mismatch <InfoTooltip text="Internal Status vs Gateway Status" position="bottom" /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {data.map((tx) => (
            <tr key={tx.id} className="hover:bg-[#1a1a1a] transition-colors group">
              <td className="px-6 py-4 text-zinc-300 font-mono text-xs">
                {tx.id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 text-zinc-400">
                {new Date(tx.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-zinc-200">
                ${tx.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-zinc-400">
                {tx.source}
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                  {tx.anomaly_type ? tx.anomaly_type.replace(/_/g, ' ') : 'NORMAL'}
                </span>
              </td>
              <td className="px-6 py-4 text-zinc-400 flex items-center justify-between">
                <span>{tx.status}</span>
                <button className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-white hover:underline text-xs transition-all">
                  Inspect &rarr;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
