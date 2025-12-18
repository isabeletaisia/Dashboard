
import React from 'react';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { DollarSign, Target, ShoppingCart, TrendingUp } from 'lucide-react';

interface LeaderboardItem {
  name: string;
  value: number;
}

interface LeaderboardSectionProps {
  title: string;
  items: LeaderboardItem[];
  icon: React.ReactNode;
  format: (val: number) => string;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ title, items, icon, format }) => {
  const maxValue = Math.max(...items.map(i => i.value), 1);

  return (
    <div className="apple-card p-6 flex flex-col h-full bg-white border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>
        <h4 className="text-[13px] font-black text-gray-900 tracking-tight">{title}</h4>
      </div>

      <div className="space-y-6 flex-1">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-end gap-4">
              <span className="text-[11px] font-bold text-gray-500 truncate flex-1">
                <span className="text-gray-300 mr-2">{idx + 1}.</span>
                {item.name}
              </span>
              <span className="text-[11px] font-black text-gray-900 shrink-0">{format(item.value)}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="h-full flex items-center justify-center italic text-[10px] text-gray-300 uppercase tracking-widest font-black">
            Sem dados
          </div>
        )}
      </div>
    </div>
  );
};

interface LeaderboardProps {
  data: any[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const topBySpend = React.useMemo(() => 
    [...data].sort((a, b) => b.spend - a.spend).slice(0, 5)
    .map(i => ({ name: i.adName, value: i.spend })), [data]);

  const topByLeads = React.useMemo(() => 
    [...data].sort((a, b) => b.leads - a.leads).slice(0, 5)
    .map(i => ({ name: i.adName, value: i.leads })), [data]);

  const topByPurchases = React.useMemo(() => 
    [...data].sort((a, b) => b.purchases - a.purchases).slice(0, 5)
    .map(i => ({ name: i.adName, value: i.purchases })), [data]);

  const bestCPA = React.useMemo(() => {
    return [...data]
      .filter(i => i.purchases >= 1)
      .map(i => ({ name: i.adName, value: i.spend / i.purchases }))
      .sort((a, b) => a.value - b.value)
      .slice(0, 5);
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <LeaderboardSection 
        title="Top por Investimento" 
        items={topBySpend} 
        icon={<DollarSign size={16} />} 
        format={formatCurrency} 
      />
      <LeaderboardSection 
        title="Top por Leads" 
        items={topByLeads} 
        icon={<Target size={16} />} 
        format={(v) => v.toString()} 
      />
      <LeaderboardSection 
        title="Top por Compras" 
        items={topByPurchases} 
        icon={<ShoppingCart size={16} />} 
        format={(v) => v.toString()} 
      />
      <LeaderboardSection 
        title="Melhor CPA" 
        items={bestCPA} 
        icon={<TrendingUp size={16} />} 
        format={formatCurrency} 
      />
    </div>
  );
};

export default Leaderboard;
