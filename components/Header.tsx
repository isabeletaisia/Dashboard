
import React, { useMemo } from 'react';
import { Filters, AdData, DatePreset } from '../types';
import { Upload, Package, Filter, Trash2, Calendar, Layers, Layout, Share } from 'lucide-react';
import Selector from './SearchableSelect';
import { parseAdsCSV } from '../services/csvService';

interface HeaderProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  data: AdData[];
  rawData: AdData[];
  onUpload: (data: AdData[]) => void;
  onClear: () => void;
  hasData: boolean;
}

const Header: React.FC<HeaderProps> = ({ filters, setFilters, rawData, onUpload, onClear }) => {
  const productOptions = useMemo(() => {
    const products = Array.from(new Set(rawData.map(d => d.product))).filter(Boolean).sort();
    return products.filter(p => p !== 'POSTS TURBINADOS').concat(products.includes('POSTS TURBINADOS') ? ['POSTS TURBINADOS'] : []);
  }, [rawData]);
  
  const campaignOptions = useMemo(() => {
    let src = rawData;
    if (filters.selectedProduct) src = src.filter(d => d.product === filters.selectedProduct);
    return Array.from(new Set(src.map(d => d.campaignName))).sort();
  }, [rawData, filters.selectedProduct]);

  const adSetOptions = useMemo(() => {
    let src = rawData;
    if (filters.selectedProduct) src = src.filter(d => d.product === filters.selectedProduct);
    if (filters.selectedCampaign) src = src.filter(d => d.campaignName === filters.selectedCampaign);
    return Array.from(new Set(src.map(d => d.adSetName))).sort();
  }, [rawData, filters.selectedProduct, filters.selectedCampaign]);

  const adOptions = useMemo(() => {
    let src = rawData;
    if (filters.selectedProduct) src = src.filter(d => d.product === filters.selectedProduct);
    if (filters.selectedCampaign) src = src.filter(d => d.campaignName === filters.selectedCampaign);
    if (filters.selectedAdSet) src = src.filter(d => d.adSetName === filters.selectedAdSet);
    return Array.from(new Set(src.map(d => d.adName))).sort();
  }, [rawData, filters.selectedProduct, filters.selectedCampaign, filters.selectedAdSet]);

  const datePresets: { label: string, value: DatePreset }[] = [
    { label: 'Últimos 7 dias', value: '7d' },
    { label: 'Últimos 14 dias', value: '14d' },
    { label: 'Últimos 30 dias', value: '30d' },
    { label: 'Mês Atual (MTD)', value: 'mtd' },
    { label: 'Todo Período', value: 'all' },
  ];

  const handleExport = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100 w-full h-20 flex items-center shadow-sm no-print">
      <div className="max-w-[1600px] w-full mx-auto px-8 flex items-center justify-between">
        
        <div className="flex items-center gap-2 py-2 flex-1 overflow-x-auto no-scrollbar">
          <Selector
            placeholder="Período"
            options={datePresets.map(p => p.label)}
            value={datePresets.find(p => p.value === filters.datePreset)?.label || ''}
            onChange={(val) => {
              const preset = datePresets.find(p => p.label === val)?.value || '30d';
              setFilters(f => ({ ...f, datePreset: preset }));
            }}
            icon={<Calendar size={16} />}
          />

          <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block" />

          <Selector
            placeholder="Produto"
            options={productOptions}
            value={filters.selectedProduct}
            onChange={(val) => setFilters(f => ({ ...f, selectedProduct: val, selectedCampaign: '', selectedAdSet: '', selectedAd: '' }))}
            icon={<Package size={16} />}
          />

          <Selector
            placeholder="Campanha"
            options={campaignOptions}
            value={filters.selectedCampaign}
            onChange={(val) => setFilters(f => ({ ...f, selectedCampaign: val, selectedAdSet: '', selectedAd: '' }))}
            icon={<Filter size={16} />}
          />
        </div>

        <div className="flex items-center gap-3 ml-4">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-[12px] font-bold hover:bg-gray-100 transition-all border border-gray-200"
          >
            <Share size={14} />
            <span className="hidden sm:inline">Exportar PDF</span>
          </button>

          <button onClick={onClear} className="p-2.5 text-gray-300 hover:text-red-500 transition-colors shrink-0" title="Apagar Banco de Dados">
            <Trash2 size={20} />
          </button>
          
          <label className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[12px] font-bold cursor-pointer hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 shrink-0">
            <Upload size={14} strokeWidth={3} />
            <span className="hidden xl:inline">Importar</span>
            <input type="file" accept=".csv" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) parseAdsCSV(f).then(res => onUpload(res.data));
            }} />
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;
