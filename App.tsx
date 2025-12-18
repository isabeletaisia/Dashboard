
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Overview from './views/Overview';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingUpload from './components/LandingUpload';
import { AdData, Filters } from './types';

const STORAGE_KEY = 'metacore_ads_data';

const AppContent: React.FC = () => {
  const [adsData, setAdsData] = useState<AdData[]>([]);
  const [filters, setFilters] = useState<Filters>({
    datePreset: '30d',
    dateRange: [null, null],
    resultType: 'purchases',
    selectedProduct: '', 
    selectedCampaign: '',
    selectedAdSet: '',
    selectedAd: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setAdsData(parsed);
      } catch (e) { console.error(e); }
    }
  }, []);

  const filteredData = useMemo(() => {
    if (!adsData.length) return [];
    
    let filtered = adsData;
    const now = new Date();
    const parseDate = (d: string) => new Date(d);

    if (filters.datePreset !== 'all') {
      let days = 30;
      if (filters.datePreset === '7d') days = 7;
      if (filters.datePreset === '14d') days = 14;
      
      if (filters.datePreset === 'mtd') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(item => parseDate(item.date) >= startOfMonth);
      } else {
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - days);
        filtered = filtered.filter(item => parseDate(item.date) >= cutoff);
      }
    }

    if (filters.selectedProduct) filtered = filtered.filter(item => item.product === filters.selectedProduct);
    if (filters.selectedCampaign) filtered = filtered.filter(item => item.campaignName === filters.selectedCampaign);
    if (filters.selectedAdSet) filtered = filtered.filter(item => item.adSetName === filters.selectedAdSet);
    if (filters.selectedAd) filtered = filtered.filter(item => item.adName === filters.selectedAd);
    
    return filtered;
  }, [adsData, filters]);

  const handleUpload = (data: AdData[]) => {
    setAdsData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleClear = () => {
    if (confirm("Deseja apagar os dados importados?")) {
      setAdsData([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleResetAll = () => {
    setFilters({
      datePreset: '30d',
      dateRange: [null, null],
      resultType: 'purchases',
      selectedProduct: '',
      selectedCampaign: '',
      selectedAdSet: '',
      selectedAd: ''
    });
  };

  if (adsData.length === 0) return <LandingUpload onUpload={handleUpload} />;

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Sidebar 
        rawData={adsData} 
        selectedProduct={filters.selectedProduct} 
        onSelectProduct={(p) => setFilters(f => ({ ...f, selectedProduct: p, selectedCampaign: '', selectedAdSet: '', selectedAd: '' }))} 
        onResetAll={handleResetAll}
      />
      <div className="lg:pl-[260px]">
        <Header 
          filters={filters} 
          setFilters={setFilters} 
          data={filteredData}
          rawData={adsData}
          onUpload={handleUpload} 
          onClear={handleClear}
          hasData={true}
        />
        <main className="max-w-[1600px] mx-auto p-4 lg:p-10 pb-20">
          <Routes>
            <Route path="/" element={<Overview data={filteredData} filters={filters} setFilters={setFilters} rawData={adsData} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
