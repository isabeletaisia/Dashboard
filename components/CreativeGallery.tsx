
import React, { useState, useMemo } from 'react';
import { AdData } from '../types';
import { formatPercent, formatCurrency } from '../utils/formatters';
import { Play, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreativeGalleryProps {
  ads: AdData[];
}

const ImageWithPlaceholder: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#F5F5F7] overflow-hidden">
      {/* Placeholder / Loading State */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          >
            <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback para erro */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-2">
          <ImageIcon size={24} strokeWidth={1.5} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Erro de Mídia</span>
        </div>
      )}

      {src ? (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50 gap-2">
          <Play size={32} strokeWidth={1.5} />
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Vídeo/Reel</span>
        </div>
      )}
    </div>
  );
};

const CreativeGallery: React.FC<CreativeGalleryProps> = ({ ads }) => {
  const aggregatedAds = useMemo(() => {
    const map = new Map<string, any>();
    ads.forEach(ad => {
      const key = ad.adName;
      if (!map.has(key)) map.set(key, { ...ad });
      else {
        const e = map.get(key);
        e.spend += ad.spend; 
        e.linkClicks += ad.linkClicks;
        e.impressions += ad.impressions; 
        e.purchases += ad.purchases;
      }
    });
    return Array.from(map.values()).sort((a, b) => b.spend - a.spend);
  }, [ads]);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between px-2">
        <div>
          <h3 className="text-xl font-black text-[#1D1D1F] tracking-tight">Galeria de Criativos</h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Impacto visual e conversão</p>
        </div>
        <span className="bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
          {aggregatedAds.length} Criativos Únicos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {aggregatedAds.map((ad, idx) => {
          const cpa = ad.purchases > 0 ? ad.spend / ad.purchases : 0;
          const ctr = ad.impressions > 0 ? (ad.linkClicks / ad.impressions) * 100 : 0;

          return (
            <motion.div 
              key={ad.adName + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
              className="apple-card group overflow-hidden border border-gray-100/50 flex flex-col h-full hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] bg-white"
            >
              <div className="aspect-[4/5] relative bg-gray-50">
                <ImageWithPlaceholder src={ad.thumbnailUrl} alt={ad.adName} />
                
                {/* Badge de Ranking */}
                {ad.engagementRanking !== 'UNKNOWN' && (
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      ad.engagementRanking === 'ABOVE_AVERAGE' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white/90 backdrop-blur text-gray-600'
                    }`}>
                      {ad.engagementRanking === 'ABOVE_AVERAGE' ? 'Alta Performance' : 'Engaj. Médio'}
                    </span>
                  </div>
                )}

                {/* Link Externo */}
                {ad.permalink && (
                  <a 
                    href={ad.permalink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-gray-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-blue-600 shadow-lg scale-90 group-hover:scale-100"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                  <h4 className="text-[13px] font-black text-gray-900 leading-tight mb-1 line-clamp-2 min-h-[2rem]">
                    {ad.adName}
                  </h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">
                    {ad.campaignName}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-5 pt-5 border-t border-gray-50 mt-auto">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Gasto</span>
                    <span className="text-[12px] font-black text-gray-900">{formatCurrency(ad.spend)}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">CTR Real</span>
                    <span className="text-[12px] font-black text-blue-600">{formatPercent(ctr)}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Vendas</span>
                    <div className="flex items-center gap-1.5">
                       <span className="text-[12px] font-black text-gray-900">{ad.purchases}</span>
                       {ad.purchases > 5 && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">CPA</span>
                    <span className={`text-[12px] font-black ${cpa > 0 && cpa < 30 ? 'text-emerald-500' : 'text-gray-900'}`}>
                      {cpa > 0 ? formatCurrency(cpa) : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CreativeGallery;
