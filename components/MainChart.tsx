
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatCompact } from '../utils/formatters';

interface MainChartProps {
  data: any[];
}

const CustomTooltip = ({ active, payload, label, metricLabels, metric }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formattedValue = metric === 'spend' 
      ? formatCurrency(value) 
      : value.toLocaleString('pt-BR');

    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_15px_35px_rgba(0,0,0,0.1)] rounded-2xl p-4 min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0071E3]" />
          <p className="text-[15px] font-black text-gray-900 tracking-tight">
            {formattedValue}
          </p>
        </div>
        <p className="text-[11px] font-bold text-blue-600 mt-0.5">{metricLabels[metric]}</p>
      </div>
    );
  }
  return null;
};

const MainChart: React.FC<MainChartProps> = ({ data }) => {
  const [metric, setMetric] = useState<'spend' | 'linkClicks' | 'purchases' | 'leads' | 'msgs'>('spend');

  const metricLabels: any = {
    spend: 'Investimento',
    linkClicks: 'Cliques',
    purchases: 'Vendas',
    leads: 'Leads',
    msgs: 'Conversas'
  };

  return (
    <div className="apple-card p-6 lg:p-10 flex flex-col h-[580px] bg-white border border-gray-100/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-xl font-black text-[#1D1D1F] tracking-tight mb-1">Evolução de Performance</h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">Visão analítica temporal</p>
        </div>
        
        {/* Apple-style Segmented Control */}
        <div className="flex bg-[#F5F5F7] p-1 rounded-xl border border-gray-200/50 shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar">
          {Object.entries(metricLabels).map(([k, v]: any) => (
            <button
              key={k}
              onClick={() => setMetric(k)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all duration-300 uppercase tracking-wider whitespace-nowrap ${
                metric === k 
                  ? 'bg-white text-[#0071E3] shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-[1.02]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0071E3" stopOpacity={0.12}/>
                <stop offset="95%" stopColor="#0071E3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="0" 
              vertical={false} 
              stroke="#F2F2F7" 
              strokeWidth={1}
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#86868B', fontWeight: 700 }}
              dy={15}
              minTickGap={40}
              interval="preserveStartEnd"
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#86868B', fontWeight: 700 }}
              tickFormatter={(val) => metric === 'spend' ? `R$ ${formatCompact(val)}` : formatCompact(val)}
              dx={-5}
              width={60}
            />
            
            <Tooltip 
              content={<CustomTooltip metricLabels={metricLabels} metric={metric} />}
              cursor={{ stroke: '#E5E5EA', strokeWidth: 2 }}
              animationDuration={300}
            />
            
            <Area 
              type="monotone" 
              dataKey={metric} 
              stroke="#0071E3" 
              strokeWidth={3.5}
              fillOpacity={1} 
              fill="url(#colorMetric)" 
              animationDuration={1800}
              animationEasing="ease-in-out"
              activeDot={{ 
                r: 6, 
                strokeWidth: 3, 
                stroke: '#fff', 
                fill: '#0071E3',
                className: "drop-shadow-lg"
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-50 pt-6">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <span>{metricLabels[metric]}</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-200" />
        <span>Dados processados em tempo real</span>
      </div>
    </div>
  );
};

export default MainChart;
