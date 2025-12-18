
import React, { useMemo } from 'react';
import { Layout, BarChart3, Package, ChevronRight } from 'lucide-react';
import { AdData } from '../types';

interface SidebarProps {
  rawData: AdData[];
  selectedProduct: string;
  onSelectProduct: (product: string) => void;
  onResetAll: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ rawData, selectedProduct, onSelectProduct, onResetAll }) => {
  const products = useMemo(() => {
    const list = Array.from(new Set(rawData.map(d => d.product))).filter(p => p !== 'POSTS TURBINADOS').sort();
    if (rawData.some(d => d.product === 'POSTS TURBINADOS')) {
      list.push('POSTS TURBINADOS');
    }
    return list;
  }, [rawData]);

  return (
    <>
      <aside className="hidden lg:flex w-[260px] flex-col fixed inset-y-0 left-0 bg-white border-r border-gray-100 z-40 p-6">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <BarChart3 size={22} strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900">Analytics</span>
        </div>

        <nav className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
          <div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 px-4">Menu</p>
            <button
              onClick={onResetAll}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all ${
                selectedProduct === '' 
                  ? 'bg-gray-900 text-white shadow-xl shadow-black/10' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <Layout size={18} strokeWidth={2.5} />
              Visão Geral
            </button>
          </div>

          <div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 px-4">Produtos</p>
            <div className="space-y-1">
              {products.map((prod) => (
                <button
                  key={prod}
                  onClick={() => onSelectProduct(prod)}
                  className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all ${
                    selectedProduct === prod 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={18} strokeWidth={2.5} className={selectedProduct === prod ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-400'} />
                    {prod}
                  </div>
                  {selectedProduct === prod && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                </button>
              ))}
            </div>
          </div>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-50">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Linhas de Dados</p>
            <p className="text-[11px] font-black text-gray-900 truncate">{rawData.length.toLocaleString()} registros</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
