import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Search, Filter, Loader2, Play, LayoutDashboard, Database, Activity as ActivityIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import KPICards from './components/KPICards';
import AnomalyChart from './components/AnomalyChart';
import TransactionTable from './components/TransactionTable';
import AIInsights from './components/AIInsights';
import ConceptHoverboard from './components/ConceptHoverboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Layout State
  const [activeTab, setActiveTab] = useState('OVERVIEW');

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
        axios.get(`${API_URL}/api/anomalies?limit=50`),
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
    // Clear old insights immediately to trigger the typewriter effect when new data arrives
    setInsights([]);
    
    const aiPromise = axios.post(`${API_URL}/api/analyze-errors`);
    
    toast.promise(aiPromise, {
      loading: 'Asking ReconAI...',
      success: 'Analysis ready.',
      error: 'Failed to run analysis.',
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
      <div className="min-h-screen flex items-center justify-center relative bg-white">
        <div className="relative text-lg font-medium text-zinc-900 flex items-center gap-3 bg-zinc-50 border border-zinc-200 p-6 rounded-lg shadow-sm">
          <Loader2 className="animate-spin text-zinc-500" size={20} /> Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-white">
        <div className="relative text-lg font-medium text-rose-600 bg-rose-50 p-6 rounded-lg border border-rose-200 shadow-sm">
          Something went wrong
          <p className="text-sm text-zinc-600 font-normal mt-2">We couldn't reach the server. Let's try again in a few minutes.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD MODE (The Application)
  // ==========================================
  return (
    <div className="min-h-screen p-6 md:p-10 relative bg-[#0a0a0a] font-sans selection:bg-zinc-800">

      <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #27272a' } }} />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#111] border border-zinc-800 rounded-lg">
              <Activity className="text-zinc-300" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-white tracking-tight">ReconAI</h1>
                <div className="flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-900/50 px-2 py-0.5 rounded text-emerald-500 text-[10px] font-medium uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  We're actively monitoring
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Tab Navigation */}
          <div className="flex items-center bg-[#111] border border-zinc-800 p-1 rounded-lg w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('OVERVIEW')}
              className={`flex items-center gap-2 flex-1 md:flex-none justify-center px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'OVERVIEW' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <LayoutDashboard size={14} /> The Big Picture
            </button>
            <button 
              onClick={() => setActiveTab('AI_DIAGNOSTICS')}
              className={`flex items-center gap-2 flex-1 md:flex-none justify-center px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'AI_DIAGNOSTICS' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <ActivityIcon size={14} /> Ask ReconAI
            </button>
            <button 
              onClick={() => setActiveTab('LOGS')}
              className={`flex items-center gap-2 flex-1 md:flex-none justify-center px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'LOGS' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Database size={14} /> Raw Data
            </button>
          </div>
        </header>

        {/* =======================
            TAB 1: OVERVIEW 
            ======================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {kpis && <KPICards data={kpis} />}
            
            <section className="bg-[#111] border border-zinc-800 rounded-lg p-6 flex flex-col h-[500px]">
              <div className="mb-6">
                <h2 className="text-sm font-medium text-zinc-100">What broke this week?</h2>
                <p className="text-xs text-zinc-500 mt-1">This chart tracks the daily volume of reconciliation errors. The white line shows the total dollar value currently blocked by these errors.</p>
              </div>
              <div className="flex-1 w-full relative">
                <AnomalyChart data={chartData} />
              </div>
            </section>
          </div>
        )}

        {/* =======================
            TAB 2: AI DIAGNOSTICS 
            ======================= */}
        {activeTab === 'AI_DIAGNOSTICS' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section className="bg-[#111] border border-zinc-800 rounded-lg p-8 flex flex-col min-h-[600px]">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-800 pb-6">
                 <div>
                   <h2 className="text-xl font-medium text-zinc-100 mb-1">Let's figure out what went wrong.</h2>
                   <p className="text-zinc-500 text-sm max-w-2xl">
                     Have our AI assistant analyze the latest errors and tell you exactly how to fix them.
                   </p>
                 </div>
                 <button 
                   onClick={generateInsights}
                   disabled={isAiLoading}
                   className={`flex-none flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-5 py-2 rounded-md text-sm font-medium transition-colors ${isAiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   {isAiLoading ? <Loader2 size={16} className="animate-spin text-black" /> : <Play size={16} className="fill-black" />}
                   {isAiLoading ? 'Reading logs...' : 'Ask ReconAI to investigate'}
                 </button>
               </div>
               
               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <AIInsights data={insights} />
               </div>
            </section>
          </div>
        )}

        {/* =======================
            TAB 3: DATA LOGS 
            ======================= */}
        {activeTab === 'LOGS' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section className="bg-[#111] border border-zinc-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-medium text-zinc-100">The Raw Data</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Filter and investigate individual anomalous transactions.</p>
                </div>
                
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search ID..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full md:w-64 bg-[#0a0a0a] border border-zinc-800 text-zinc-100 text-sm rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 relative flex-1 md:flex-none min-w-[150px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10 pointer-events-none" size={14} />
                    <select 
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-zinc-800 text-zinc-100 text-sm rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:border-zinc-600 appearance-none transition-colors"
                    >
                      <option value="ALL">All Types</option>
                      <option value="STATUS_MISMATCH">Status Mismatch</option>
                      <option value="MISSING_IN_GATEWAY">Missing in Gateway</option>
                      <option value="DUPLICATE">Duplicate</option>
                      <option value="AMOUNT_MISMATCH">Amount Mismatch</option>
                      <option value="TIMESTAMP_MISMATCH">Time Drift</option>
                    </select>
                  </div>

                  <select 
                    value={filterCurrency}
                    onChange={(e) => setFilterCurrency(e.target.value)}
                    className="bg-[#0a0a0a] border border-zinc-800 text-zinc-100 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-zinc-600 appearance-none transition-colors flex-none"
                  >
                    <option value="ALL">All Currencies</option>
                    <option value="USD">USD Only</option>
                    <option value="EUR">EUR Only</option>
                  </select>
                </div>
              </div>
              
              <div className="relative min-h-[500px]">
                <TransactionTable data={filteredTransactions} />
              </div>
            </section>
          </div>
        )}

      </div>
      
      {/* Educational Hoverboard Widget */}
      <ConceptHoverboard />
    </div>
  );
}

export default App;
