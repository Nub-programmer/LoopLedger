import React, { useState } from 'react';
import { ProductPassport, LifecycleEvent } from '../types';
import { PassportCard } from './PassportCard';
import { LifecycleTimeline } from './LifecycleTimeline';
import { EngineDecisionTrace } from './EngineDecisionTrace';
import { PlusCircle, Search, ArrowLeft } from 'lucide-react';
import { playClickSound } from '../services/audio';

interface PassportsPageProps {
  passports: ProductPassport[];
  selectedPassportId?: string;
  onSelectPassport: (id: string) => void;
  onNavigateToScan: () => void;
  onAddLifecycleEvent: (passportId: string, event: Omit<LifecycleEvent, 'id'>) => void;
  onListExchange: (passport: ProductPassport) => void;
}

export const PassportsPage: React.FC<PassportsPageProps> = ({
  passports,
  selectedPassportId,
  onSelectPassport,
  onNavigateToScan,
  onAddLifecycleEvent,
  onListExchange
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedPassport = passports.find((p) => p.id === selectedPassportId) || null;

  const filteredPassports = passports.filter((p) => {
    const matchesCat = filterCategory === 'ALL' || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ownerLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b-2 border-[#121212]">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-black text-[#121212] uppercase tracking-tight leading-none">
            PRODUCT<br />
            PASSPORTS.
          </h1>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onNavigateToScan();
          }}
          className="px-5 py-3 bg-[#CCFF00] text-[#121212] border-2 border-[#121212] font-grotesk text-xs sm:text-sm font-black uppercase brutal-shadow brutal-btn flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Product Scan →</span>
        </button>
      </div>

      {selectedPassport ? (
        /* Detailed Passport View */
        <div className="space-y-10">
          {/* Back Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-[#121212]">
            <button
              onClick={() => {
                playClickSound();
                onSelectPassport('');
              }}
              className="flex items-center gap-1.5 font-grotesk text-xs font-bold text-[#121212] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to all passports</span>
            </button>
            <div className="text-xs font-mono font-bold bg-[#121212] text-[#CCFF00] px-2 py-0.5">
              Viewing: {selectedPassport.id}
            </div>
          </div>

          {/* Master Signature Passport Card */}
          <PassportCard
            passport={selectedPassport}
            onLogEvent={() => {}}
            onListExchange={onListExchange}
          />

          {/* Decision Engine Evaluation Log */}
          <div className="space-y-3">
            <h3 className="font-display text-2xl font-black text-[#121212] uppercase">
              Circularity Engine Evaluation Log
            </h3>
            <EngineDecisionTrace analysis={selectedPassport.analysis} />
          </div>

          {/* Lifecycle Chronology */}
          <LifecycleTimeline
            passport={selectedPassport}
            onAddEvent={onAddLifecycleEvent}
          />
        </div>
      ) : (
        /* Catalog Grid View */
        <div className="space-y-8">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'ELECTRONICS', label: 'Tech' },
                { id: 'FURNITURE', label: 'Furniture' },
                { id: 'TEXTILES', label: 'Clothing' },
                { id: 'TOOLS', label: 'Tools' },
                { id: 'APPLIANCES', label: 'Appliances' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playClickSound();
                    setFilterCategory(cat.id);
                  }}
                  className={`px-3 py-1 font-grotesk text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    filterCategory === cat.id
                      ? 'bg-[#121212] text-[#CCFF00] border-2 border-[#121212] brutal-shadow-sm'
                      : 'bg-white text-[#121212] border-2 border-[#121212] hover:bg-[#EFECE4]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="Search by ID, name, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#121212] text-xs placeholder:text-[#71717A]"
              />
              <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Passport Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPassports.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  playClickSound();
                  onSelectPassport(p.id);
                }}
                className="bg-white border-2 border-[#121212] p-5 brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                {/* Top strip */}
                <div className="flex items-center justify-between border-b border-[#121212] pb-2">
                  <span className="font-mono text-xs font-black text-[#121212]">
                    {p.id}
                  </span>
                  <span className="px-2 py-0.5 bg-[#CCFF00] text-[10px] font-bold border border-[#121212]">
                    {p.currentCondition}
                  </span>
                </div>

                {/* Body */}
                <div className="space-y-1.5">
                  <div className="text-[10px] text-[#71717A] uppercase font-semibold">{p.category}</div>
                  <h3 className="font-grotesk text-xl font-black text-[#121212] leading-tight">
                    {p.name}
                  </h3>
                  <div className="text-xs text-[#555555] truncate">
                    Custodian: {p.ownerName}
                  </div>
                </div>

                {/* Score & Next Action */}
                <div className="pt-3 border-t border-dashed border-[#121212] flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-[#71717A] uppercase font-semibold">Circularity</div>
                    <div className="font-display text-2xl font-black text-[#121212]">
                      {p.analysis.circularityScore}<span className="text-xs font-grotesk font-bold">/100</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[9px] text-[#71717A] uppercase font-semibold">Next Action</div>
                    <div className="font-grotesk text-xs font-bold text-[#0F3822]">
                      {p.analysis.primaryAction} →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
