
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectorProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon: React.ReactNode;
}

const Selector: React.FC<SelectorProps> = ({ options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F4F4F5] border rounded-xl transition-all duration-200 hover:bg-[#E4E4E7] whitespace-nowrap ${
          isOpen ? 'ring-2 ring-blue-100 bg-white border-blue-400' : 'border-transparent'
        } ${value ? 'bg-white shadow-sm ring-1 ring-gray-100 border-gray-200' : ''}`}
      >
        <span className={value ? 'text-blue-600' : 'text-gray-400'}>{icon}</span>
        <span className={`text-[12px] font-bold truncate max-w-[120px] ${value ? 'text-gray-900' : 'text-gray-500'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[999] p-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-left overflow-hidden">
          <div className="max-h-80 overflow-y-auto no-scrollbar py-1">
            <button
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] transition-all flex items-center gap-3 mb-1 ${
                !value ? 'bg-gray-900 text-white font-bold' : 'text-gray-600 hover:bg-[#F4F4F5]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${!value ? 'border-white bg-white' : 'border-gray-300'}`}>
                {!value && <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />}
              </div>
              Todos ({placeholder})
            </button>
            
            <div className="h-px bg-gray-100 my-1.5 mx-2" />

            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] transition-all flex items-center gap-3 mb-0.5 ${
                  value === opt ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-[#F4F4F5]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${value === opt ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                  {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="truncate">{opt}</span>
              </button>
            ))}
            
            {options.length === 0 && (
              <div className="py-8 text-center text-[10px] text-gray-400 font-black uppercase tracking-widest italic">Sem Opções</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Selector;
