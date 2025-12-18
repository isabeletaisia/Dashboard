
import React, { useMemo } from 'react';
import { AdData, Filters } from '../types';
import KPICard from '../components/KPICard';
import MainChart from '../components/MainChart';
import CreativeGallery from '../components/CreativeGallery';
import DataTable from '../components/DataTable';
import Leaderboard from '../components/Leaderboard';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface OverviewProps {
  data: AdData[];
  rawData: AdData[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const Overview: React.FC<OverviewProps> = ({ data, filters }) => {
  const stats = useMemo(() => {
    if (!data.length) return null;

    const totals = data.reduce((acc, curr) => ({
      spend: acc.spend + curr.spend,
      clicks: acc.clicks + curr.linkClicks,
      purchases: acc.purchases + curr.purchases,
      leads: acc.leads + curr.leads,
      lpv: acc.lpv + curr.lpv,
      impressions: acc.impressions + curr.impressions,
      msgs: acc.msgs + (curr.conversations || 0)
    }), { spend: 0, clicks: 0, purchases: 0, leads: 0, lpv: 0, impressions: 0, msgs: 0 });

    const timeMap = new Map();
    data.forEach(d => {
      const date = new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      const ex = timeMap.get(date) || { date, spend: 0, linkClicks: 0, purchases: 0, leads: 0, msgs: 0, raw: new Date(d.date).getTime() };
      ex.spend += d.spend; 
      ex.linkClicks += d.linkClicks; 
      ex.purchases += d.purchases; 
      ex.leads += d.leads;
      ex.msgs += (d.conversations || 0);
      timeMap.set(date, ex);
    });

    const creativeMap = new Map();
    data.forEach(d => {
      const ex = creativeMap.get(d.adName) || { ...d, spend: 0, leads: 0, purchases: 0, linkClicks: 0, impressions: 0 };
      ex.spend += d.spend;
      ex.leads += d.leads;
      ex.purchases += d.purchases;
      ex.linkClicks += d.linkClicks;
      ex.impressions += d.impressions;
      creativeMap.set(d.adName, ex);
    });

    return { 
      totals, 
      chartData: Array.from(timeMap.values()).sort((a, b) => a.raw - b.raw),
      aggregatedAds: Array.from(creativeMap.values())
    };
  }, [data]);

  if (!stats) return null;

  const cpa = stats.totals.purchases > 0 ? stats.totals.spend / stats.totals.purchases : 0;
  const cpl = stats.totals.leads > 0 ? stats.totals.spend / stats.totals.leads : 0;
  const cpc = stats.totals.clicks > 0 ? stats.totals.spend / stats.totals.clicks : 0;
  const ctr = stats.totals.impressions > 0 ? (stats.totals.clicks / stats.totals.impressions) * 100 : 0;
  const lpvRate = stats.totals.clicks > 0 ? (stats.totals.lpv / stats.totals.clicks) * 100 : 0;
  const cpMessage = stats.totals.msgs > 0 ? stats.totals.spend / stats.totals.msgs : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {filters.selectedProduct ? `${filters.selectedProduct}` : 'Visão Geral'}
        </h2>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status da Operação • {data.length.toLocaleString()} eventos processados</p>
      </div>

      {/* Grid de Métricas Primárias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <KPICard label="Investimento" value={formatCurrency(stats.totals.spend)} sparklineData={stats.chartData.map(d => d.spend)} />
        <KPICard label="Compras" value={stats.totals.purchases.toString()} sparklineData={stats.chartData.map(d => d.purchases)} />
        <KPICard label="Leads" value={stats.totals.leads.toString()} sparklineData={stats.chartData.map(d => d.leads)} />
        <KPICard label="CPA (Venda)" value={formatCurrency(cpa)} />
        <KPICard label="CPL (Lead)" value={formatCurrency(cpl)} />
      </div>

      {/* Grid de Métricas Secundárias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cliques no Link</p>
            <p className="text-xl font-black text-gray-900">{stats.totals.clicks.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CPC</p>
            <p className="text-sm font-bold text-blue-600">{formatCurrency(cpc)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Taxa de LPV</p>
            <p className="text-xl font-black text-gray-900">{formatPercent(lpvRate)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cliques/View</p>
            <div className={`w-2 h-2 rounded-full inline-block ${lpvRate > 70 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conversas</p>
            <p className="text-xl font-black text-gray-900">{stats.totals.msgs}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Custo/Conv.</p>
            <p className="text-sm font-bold text-blue-600">{cpMessage > 0 ? formatCurrency(cpMessage) : '—'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CTR Médio</p>
            <p className="text-xl font-black text-gray-900">{formatPercent(ctr)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Alcance</p>
            <p className="text-sm font-bold text-gray-500">{stats.totals.impressions.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-base font-black text-gray-900 tracking-tight">Top Performance por Criativo</h3>
        </div>
        <Leaderboard data={stats.aggregatedAds} />
      </div>

      <MainChart data={stats.chartData} />

      <CreativeGallery ads={data} />
      <DataTable data={data} />
    </div>
  );
};

export default Overview;
