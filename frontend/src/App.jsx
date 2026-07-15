import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Search, Filter, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import KPICards from './components/KPICards';
import AnomalyChart from './components/AnomalyChart';
import TransactionTable from './components/TransactionTable';
import AIInsights from './components/AIInsights';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Filters and States
  const [filterType, setFilterType] = useState('ALL');
  const [filterCurrency, setFilterCurrency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [kpiRes, trendsRes, chartRes, transRes, insightsRes] = await Promise.all([
        axios.get(`${API_URL}/api/kpis`),
        axios.get(`${API_URL}/api/insights/trends`),
        axios.get(`${API_URL}/api/chart-data`),
        axios.get(`${API_URL}/api/anomalies?limit=50`), // Fetch more so we can filter locally
        axios.get(`${API_URL}/api/insights`)
      ]);
      setKpis(kpiRes.data);
      setTrends(trendsRes.data);
      setChartData(chartRes.data);
      setTransactions(transRes.data);
      setInsights(insightsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateInsights = async () => {
    setIsAiLoading(true);
    
    const aiPromise = axios.post(`${API_URL}/api/analyze-errors`);
    
    toast.promise(aiPromise, {
      loading: 'Running AI Diagnostics...',
      success: 'AI Diagnostics completed successfully!',
      error: 'Failed to run AI diagnostics.',
    });

    try {
      await aiPromise;
      await fetchData();
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filterType !== 'ALL' && tx.anomaly_type !== filterType) return false;
    if (filterCurrency !== 'ALL' && tx.currency !== filterCurrency) return false;
    if (searchQuery && !tx.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-xl font-semibold text-blue-400 flex items-center gap-2">
          <Activity className="animate-pulse" /> Loading ReconAI...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-xl font-semibold text-rose-500 bg-rose-500/10 p-6 rounded-xl border border-rose-500/50">
          Failed to connect to backend server
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6 md:p-8">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } }} />
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-2">
              <Activity className="text-slate-400" size={28} strokeWidth={1.5} />
              ReconAI
            </h1>
            <p className="text-sm text-slate-400 mt-1 font-medium tracking-wide uppercase">Command Center</p>
          </div>
        </header>

        {/* KPIs & Trends */}
        <section className="space-y-4">
          {kpis && <KPICards data={kpis} />}
          {trends && (
            <div className="bg-dark-800 border border-dark-border rounded-lg p-3 px-4 flex items-center gap-3">
              <span className={`flex h-2 w-2 rounded-full ${trends.direction === 'increase' ? 'bg-red-500' : 'bg-green-500'}`}></span>
              <p className="text-sm text-slate-300">
                <strong className={trends.direction === 'increase' ? 'text-slate-100 font-medium' : 'text-slate-100 font-medium'}>
                  {trends.summary}
                </strong>
              </p>
            </div>
          )}
        </section>

        {/* Charts & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-dark-800 border border-dark-border rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-400 mb-6 uppercase tracking-wider">Anomalies Over Time</h2>
            <AnomalyChart data={chartData} />
          </section>
          
          <section className="bg-dark-800 border border-dark-border rounded-xl p-6 flex flex-col h-[400px]">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">AI Insights</h2>
               <button 
                 onClick={generateInsights}
                 disabled={isAiLoading}
                 className={`flex items-center gap-2 bg-white text-black hover:bg-slate-200 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${isAiLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
               >
                 {isAiLoading ? <Loader2 size={16} className="animate-spin text-black" /> : null}
                 {isAiLoading ? 'Analyzing...' : 'Run Diagnostics'}
               </button>
             </div>
             <div className="flex-1 overflow-y-auto pr-2">
                <AIInsights data={insights} />
             </div>
          </section>
        </div>

        {/* Filter Toolbar & Data Table */}
        <section className="bg-dark-800 border border-dark-border rounded-xl flex flex-col">
          <div className="p-4 border-b border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">Anomalous Records</h2>
            
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text" 
                  placeholder="Search TXN ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 bg-dark-900 border border-dark-border text-slate-200 text-sm rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:border-slate-500 transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2 relative flex-1 md:flex-none min-w-[150px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none" size={14} />
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-border text-slate-200 text-sm rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:border-slate-500 appearance-none transition-colors"
                >
                  <option value="ALL">All Types</option>
                  <option value="STATUS_MISMATCH">Status Mismatch</option>
                  <option value="MISSING_IN_GATEWAY">Missing</option>
                  <option value="DUPLICATE">Duplicate</option>
                  <option value="AMOUNT_MISMATCH">Amount Error</option>
                  <option value="TIMESTAMP_MISMATCH">Time Drift</option>
                </select>
              </div>

              <select 
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="bg-dark-900 border border-dark-border text-slate-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-500 appearance-none transition-colors flex-none"
              >
                <option value="ALL">All Currencies</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          
          <TransactionTable data={filteredTransactions} />
        </section>

      </div>
    </div>
  );
}

export default App;
