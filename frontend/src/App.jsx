import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity } from 'lucide-react';
import KPICards from './components/KPICards';
import AnomalyChart from './components/AnomalyChart';
import TransactionTable from './components/TransactionTable';
import AIInsights from './components/AIInsights';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [kpiRes, chartRes, transRes, insightsRes] = await Promise.all([
        axios.get(`${API_URL}/api/kpis`),
        axios.get(`${API_URL}/api/chart-data`),
        axios.get(`${API_URL}/api/anomalies?limit=20`),
        axios.get(`${API_URL}/api/insights`)
      ]);
      setKpis(kpiRes.data);
      setChartData(chartRes.data);
      setTransactions(transRes.data);
      setInsights(insightsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateInsights = async () => {
    try {
      await axios.post(`${API_URL}/api/analyze-errors`);
      fetchData();
    } catch (error) {
      console.error("Error generating insights:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-xl font-semibold text-blue-400 flex items-center gap-2">
          <Activity className="animate-pulse" /> Loading ReconAI...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Activity className="text-blue-500" size={32} />
              ReconAI Command Center
            </h1>
            <p className="text-slate-400 mt-1">Intelligent Reconciliation & Anomaly Detection</p>
          </div>
        </header>

        {/* KPIs */}
        <section>
          {kpis && <KPICards data={kpis} />}
        </section>

        {/* Charts & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-dark-800 border border-slate-700/50 rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4">Anomalies Over Time</h2>
            <AnomalyChart data={chartData} />
          </section>
          
          <section className="bg-dark-800 border border-slate-700/50 rounded-xl p-6 shadow-xl flex flex-col h-[400px] relative overflow-hidden">
             {/* Premium glowing background element */}
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
             
             <div className="flex items-center justify-between mb-4 relative z-10">
               <h2 className="text-lg font-semibold text-white">AI Insights</h2>
               <button 
                 onClick={generateInsights}
                 className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)]"
               >
                 Run AI Diagnostics
               </button>
             </div>
             <div className="flex-1 overflow-y-auto pr-2 relative z-10">
                <AIInsights data={insights} />
             </div>
          </section>
        </div>

        {/* Data Table */}
        <section className="bg-dark-800 border border-slate-700/50 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          </div>
          <TransactionTable data={transactions} />
        </section>

      </div>
    </div>
  );
}

export default App;
