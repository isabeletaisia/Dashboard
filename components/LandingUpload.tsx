
import React, { useState } from 'react';
import { Upload, BarChart3, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { parseAdsCSV } from '../services/csvService';
import { AdData } from '../types';

interface LandingUploadProps {
  onUpload: (data: AdData[]) => void;
}

const LandingUpload: React.FC<LandingUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      alert("Por favor, envie um arquivo CSV.");
      return;
    }
    try {
      const { data } = await parseAdsCSV(file);
      onUpload(data);
    } catch (err) {
      alert("Erro ao processar o arquivo. Verifique o formato.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <BarChart3 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Meta Analytics</h1>
          <p className="text-gray-500 text-sm">Transforme seus relatórios do Business Manager em insights acionáveis em segundos.</p>
        </div>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
            isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <input 
            type="file" 
            accept=".csv" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
              <Upload size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">Clique ou arraste o CSV</p>
              <p className="text-xs text-gray-400">Suporta exportações nativas da Meta</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600" />
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">100% Seguro</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileSpreadsheet size={18} className="text-blue-600" />
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">CSV Nativo</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BarChart3 size={18} className="text-blue-600" />
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Análise Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingUpload;
