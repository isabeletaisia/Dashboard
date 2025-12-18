
import React from 'react';
import { motion } from 'framer-motion';

interface KPICardProps {
  label: string;
  value: string;
  sparklineData?: number[];
}

const KPICard: React.FC<KPICardProps> = ({ label, value, sparklineData }) => {
  const points = sparklineData && sparklineData.length > 1 
    ? sparklineData.slice(-15).map((v, i, arr) => {
        const max = Math.max(...arr) || 1;
        const min = Math.min(...arr) || 0;
        const range = max - min || 1;
        const x = (i / (arr.length - 1)) * 50;
        const y = 18 - ((v - min) / range) * 14;
        return `${x},${y}`;
      }).join(' ')
    : "0,10 50,10";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="apple-card p-6 flex flex-col justify-between min-h-[140px]"
    >
      <div className="flex justify-between items-start">
        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        {sparklineData && (
          <svg width="50" height="20" className="text-emerald-500 overflow-visible">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        )}
      </div>
      
      <div className="mt-4">
        <span className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
          {value}
        </span>
      </div>
    </motion.div>
  );
};

export default KPICard;
