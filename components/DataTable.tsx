
import React, { useState, useMemo } from 'react';
import { AdData } from '../types';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps {
  data: AdData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [pageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('spend');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const aggregatedData = useMemo(() => {
    const map = new Map<string, any>();
    data.forEach(item => {
      const key = item.adName;
      if (!map.has(key)) {
        map.set(key, { ...item });
      } else {
        const existing = map.get(key);
        existing.spend += item.spend;
        existing.impressions += item.impressions;
        existing.linkClicks += item.linkClicks;
        existing.purchases += item.purchases;
        existing.video95 += item.video95;
        existing.plays += item.plays;
      }
    });

    return Array.from(map.values()).map(c => ({
      ...c,
      ctr: c.impressions > 0 ? (c.linkClicks / c.impressions) * 100 : 0,
      retention: c.plays > 0 ? (c.video95 / c.plays) * 100 : 0,
      cpa: c.purchases > 0 ? c.spend / c.purchases : 0,
      cpc: c.linkClicks > 0 ? c.spend / c.linkClicks : 0
    }));
  }, [data]);

  const sortedData = useMemo(() => {
    return [...aggregatedData].sort((a, b) => {
      const valA = (a as any)[sortField] ?? 0;
      const valB = (b as any)[sortField] ?? 0;
      return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [aggregatedData, sortField, sortOrder]);

  const currentRows = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const Header = ({ field, label }: { field: string, label: string }) => (
    <th onClick={() => { setSortField(field); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} 
      className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:bg-gray-50 transition-all select-none border-b border-gray-100">
      <div className="flex items-center gap-2">
        {label} 
        <ArrowUpDown size={12} className={`transition-colors ${sortField === field ? 'text-blue-600' : 'text-gray-200'}`} />
      </div>
    </th>
  );

  return (
    <div className="apple-card overflow-hidden bg-white">
      <div className="p-7 border-b border-gray-50 flex items-center justify-between bg-white">
        <div>
          <h3 className="text-sm font-black text-[#1D1D1F] uppercase tracking-wider mb-1">Métricas Técnicas</h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Performance Consolidada por Criativo</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FBFBFB]">
              <Header field="adName" label="Anúncio" />
              <Header field="spend" label="Investimento" />
              <Header field="purchases" label="Vendas" />
              <Header field="cpa" label="CPA" />
              <Header field="cpc" label="CPC" />
              <Header field="ctr" label="CTR Norm." />
              <Header field="retention" label="Vídeo 95%" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentRows.map((row, i) => (
              <tr key={i} className="hover:bg-blue-50/20 transition-colors group">
                <td className="px-6 py-5 min-w-[240px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-[#1D1D1F] line-clamp-1 group-hover:text-blue-600 transition-colors">{row.adName}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{row.campaignName}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[11px] font-black text-[#1D1D1F]">{formatCurrency(row.spend)}</td>
                <td className="px-6 py-5 text-[11px] font-black text-blue-600">{row.purchases}</td>
                <td className="px-6 py-5 text-[11px] font-bold text-gray-500">{row.purchases > 0 ? formatCurrency(row.cpa) : '—'}</td>
                <td className="px-6 py-5 text-[11px] font-bold text-gray-500">{formatCurrency(row.cpc)}</td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-600">{formatPercent(row.ctr)}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${row.retention > 15 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <span className="text-[11px] font-black text-gray-700">{formatPercent(row.retention)}</span>
                  </div>
                </td>
              </tr>
            ))}
            {currentRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                  Sem dados para exibir.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 flex justify-between items-center bg-[#FBFBFB] border-t border-gray-50">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-white border border-gray-200 rounded-xl hover:text-blue-600 transition-all shadow-sm disabled:opacity-30">
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {currentPage} / {Math.ceil(sortedData.length / pageSize) || 1}
        </span>
        <button disabled={currentPage >= Math.ceil(sortedData.length / pageSize)} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-white border border-gray-200 rounded-xl hover:text-blue-600 transition-all shadow-sm disabled:opacity-30">
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default DataTable;
