import React, { useState } from 'react';
import { HeroVisualMagazine } from './HeroVisualMagazine';
import { MarqueeStrip } from './MarqueeStrip';
import { PassportCard } from './PassportCard';
import { EngineDecisionTrace } from './EngineDecisionTrace';
import { ProductPassport, ExchangeListing } from '../types';
import { ArrowUpRight, ArrowRight, MapPin } from 'lucide-react';
import { playClickSound } from '../services/audio';

interface HomePageProps {
  onNavigate: (page: 'home' | 'scan' | 'passports' | 'exchange' | 'impact' | 'about') => void;
  featuredPassport: ProductPassport;
  exchangeListings: ExchangeListing[];
  passports: ProductPassport[];
  onSelectPassport: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  featuredPassport,
  exchangeListings,
  passports,
  onSelectPassport
}) => {
  const [selectedShowcaseId, setSelectedShowcaseId] = useState<string>(featuredPassport.id);
  const activePassport = passports.find((p) => p.id === selectedShowcaseId) || featuredPassport;

  return (
    <div className="w-full space-y-20 sm:space-y-24 pb-16">
      <section className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#121212] uppercase tracking-wider">
              <span className="px-2.5 py-1 bg-[#CCFF00] border border-[#121212] font-grotesk">
                Circular Product Infrastructure
              </span>
              <span className="text-[#71717A]">HackTrack '26</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black text-[#121212] tracking-tighter leading-[0.92] uppercase text-balance">
              GIVE PRODUCTS<br />
              <span className="relative inline-block">
                ANOTHER LIFE.
                <span className="absolute left-0 bottom-2 right-0 h-3 sm:h-4 bg-[#CCFF00] -z-10" />
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-grotesk text-lg sm:text-xl font-bold text-[#121212] uppercase">
              <span>Repair.</span>
              <span className="text-[#CCFF00] font-black">·</span>
              <span>Reuse.</span>
              <span className="text-[#CCFF00] font-black">·</span>
              <span>Transfer.</span>
              <span className="text-[#CCFF00] font-black">·</span>
              <span>Track.</span>
            </div>

            <p className="font-sans text-base sm:text-lg text-[#333333] max-w-xl leading-relaxed">
              "Before you throw it away, find out what life comes next." LoopLedger helps identify products, assess their condition, and trace their next best life through Digital Product Passports.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  onNavigate('scan');
                }}
                className="px-8 py-4 bg-[#CCFF00] text-[#121212] border-2 border-[#121212] font-grotesk text-sm sm:text-base font-black uppercase tracking-tight brutal-shadow brutal-btn flex items-center justify-center gap-2"
              >
                <span>Scan an Item</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onNavigate('passports');
                }}
                className="px-7 py-4 bg-white hover:bg-[#EFECE4] text-[#121212] border-2 border-[#121212] font-grotesk text-sm sm:text-base font-bold uppercase tracking-tight brutal-shadow-sm brutal-btn flex items-center justify-center gap-2"
              >
                <span>View a Passport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 flex items-center gap-5 text-xs text-[#71717A] border-t border-dashed border-[#121212]">
              <div>
                <strong className="text-[#121212]">12+</strong> Products Rescued
              </div>
              <div>·</div>
              <div>
                <strong className="text-[#121212]">64 kg</strong> Carbon Avoided
              </div>
              <div className="hidden sm:inline">·</div>
              <div className="hidden sm:inline">
                <strong className="text-[#121212]">EU DPP</strong> Aligned
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroVisualMagazine
              onExplorePassport={(id) => {
                onSelectPassport(id);
                onNavigate('passports');
              }}
            />
          </div>
        </div>
      </section>

      <section className="w-full">
        <MarqueeStrip />
      </section>

      <section className="max-w-7xl mx-auto">
        <div className="bg-white border-2 border-[#121212] p-6 sm:p-10 lg:p-12 brutal-shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-8 font-display text-[140px] sm:text-[200px] font-black text-[#F8F6F0] leading-none pointer-events-none select-none z-0">
            01
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
                The Core Challenge
              </div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#121212] uppercase tracking-tight leading-[0.95] text-balance">
                WE THROW AWAY<br />
                PRODUCTS THAT<br />
                STILL HAVE LIFE.
              </h2>
            </div>

            <div className="lg:col-span-5 space-y-4 bg-[#FAF8F5] border-2 border-[#121212] p-6 brutal-shadow-sm text-xs sm:text-sm text-[#333333] leading-relaxed">
              <p>
                Every year, millions of tonnes of electronics and durable goods are discarded prematurely. In most cases, the structural frames, components, and materials are completely functional.
              </p>
              <p className="font-grotesk text-xs text-[#0F3822] font-bold border-t border-[#121212] pt-3">
                → LoopLedger connects diagnosis, digital passports, and community exchange to keep products in active circulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b-2 border-[#121212]">
          <div>
            <div className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
              How LoopLedger Works
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#121212] uppercase tracking-tight">
              Three-Step Circular Flow
            </h2>
          </div>
          <div className="text-xs text-[#71717A] font-medium">
            From scan to second life
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-[#121212] p-6 sm:p-7 brutal-shadow flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="font-display text-5xl font-black text-[#121212]">01</div>
              <h3 className="font-display text-2xl font-black text-[#121212] uppercase">
                IDENTIFY
              </h3>
              <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                Take or upload a photo of the product. Image analysis identifies the item, inspects visible condition, and checks potential faults.
              </p>
            </div>
            <div className="text-xs font-bold text-[#121212] pt-3 border-t border-dashed border-[#121212]">
              Image Diagnostics
            </div>
          </div>

          <div className="bg-[#CCFF00] border-2 border-[#121212] p-6 sm:p-7 brutal-shadow flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="font-display text-5xl font-black text-[#121212]">02</div>
              <h3 className="font-display text-2xl font-black text-[#121212] uppercase">
                DECIDE
              </h3>
              <p className="text-xs sm:text-sm text-[#121212] leading-relaxed font-medium">
                The circularity engine ranks next-life interventions (Repair vs Reuse vs Parts Harvesting) and computes carbon savings.
              </p>
            </div>
            <div className="text-xs font-black text-[#121212] pt-3 border-t border-[#121212]">
              Deterministic Engine
            </div>
          </div>

          <div className="bg-[#121212] text-white border-2 border-[#121212] p-6 sm:p-7 brutal-shadow flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="font-display text-5xl font-black text-[#CCFF00]">03</div>
              <h3 className="font-display text-2xl font-black text-white uppercase">
                TRACK
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Create a permanent Digital Product Passport with scannable QR. Log repair history, transfer ownership, or list for community reuse.
              </p>
            </div>
            <div className="text-xs font-bold text-[#CCFF00] pt-3 border-t border-zinc-800">
              Digital Product Passport
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b-2 border-[#121212]">
          <div>
            <div className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
              Signature Feature
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#121212] uppercase tracking-tight">
              Digital Product Passports
            </h2>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onNavigate('passports');
            }}
            className="px-4 py-2 bg-[#FFE600] border-2 border-[#121212] font-grotesk text-xs font-bold uppercase brutal-shadow-sm brutal-btn self-start sm:self-auto"
          >
            Explore all ({passports.length}) →
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {passports.map((p) => {
            const isSelected = p.id === activePassport.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  playClickSound();
                  setSelectedShowcaseId(p.id);
                }}
                className={`px-3.5 py-1.5 font-grotesk text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#121212] text-[#CCFF00] border-2 border-[#121212] brutal-shadow-sm'
                    : 'bg-white text-[#121212] border-2 border-[#121212] hover:bg-[#EFECE4]'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        <div className="w-full">
          <PassportCard
            passport={activePassport}
            onLogEvent={() => {
              onSelectPassport(activePassport.id);
              onNavigate('passports');
            }}
            onViewTimeline={() => {
              onSelectPassport(activePassport.id);
              onNavigate('passports');
            }}
            onListExchange={() => {
              onNavigate('exchange');
            }}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto">
        <div className="bg-[#FAF8F5] border-2 border-[#121212] p-6 sm:p-8 brutal-shadow-lg space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#121212] pb-4">
            <div>
              <div className="text-xs font-bold text-[#71717A] uppercase">
                Algorithmic Transparency
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#121212] uppercase tracking-tight">
                Circularity Engine Decision Model
              </h2>
            </div>
            <span className="text-xs font-bold bg-[#CCFF00] px-3 py-1 border border-[#121212] text-[#121212]">
              Deterministic LCA Evaluation
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3 text-xs sm:text-sm text-[#333333] leading-relaxed">
              <p>
                Rather than treating AI as an opaque black box, LoopLedger uses computer vision for feature and defect extraction, while the decision hierarchy is driven by a transparent Life Cycle Assessment (LCA) engine.
              </p>
              <div className="p-4 bg-white border-2 border-[#121212] space-y-1 mt-2">
                <div className="font-bold text-[#121212] text-xs uppercase">Hierarchy Rule:</div>
                <div className="text-xs text-[#0F3822] font-semibold">
                  Repair &gt; Direct Reuse &gt; Transfer &gt; Parts Harvesting &gt; Recycling
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <EngineDecisionTrace analysis={activePassport.analysis} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b-2 border-[#121212]">
          <div>
            <div className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
              Community Exchange
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#121212] uppercase tracking-tight">
              Items Seeking Next Life
            </h2>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onNavigate('exchange');
            }}
            className="px-4 py-2 bg-[#CCFF00] border-2 border-[#121212] font-grotesk text-xs font-black uppercase brutal-shadow-sm brutal-btn self-start sm:self-auto"
          >
            Browse All ({exchangeListings.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exchangeListings.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-[#121212] overflow-hidden brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col justify-between group"
            >
              <div className="aspect-16/10 overflow-hidden bg-[#FAF8F5] border-b-2 border-[#121212] relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 bg-[#121212] text-[#CCFF00] text-[10px] font-bold px-2 py-0.5 border border-[#121212]">
                  {item.priceType}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-[#71717A] uppercase font-semibold">{item.category}</div>
                  <h4 className="font-grotesk text-lg font-black text-[#121212] leading-tight mt-0.5">
                    {item.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-dashed border-[#121212] flex items-center justify-between text-xs">
                  <span className="text-[#71717A] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                  <button
                    onClick={() => {
                      playClickSound();
                      onNavigate('exchange');
                    }}
                    className="text-[#121212] font-bold hover:underline"
                  >
                    View →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto">
        <div className="bg-[#CCFF00] border-3 border-[#121212] p-8 sm:p-12 lg:p-14 brutal-shadow-lg text-center space-y-5">
          <div className="text-xs font-bold text-[#121212] uppercase tracking-wider">
            UN SDG 12 · Responsible Consumption & Production
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#121212] uppercase tracking-tight leading-none text-balance">
            DON'T THROW IT AWAY YET.
          </h2>

          <p className="text-sm sm:text-base text-[#121212] max-w-xl mx-auto font-medium">
            Scan your hardware, mint a digital passport, or pass it to someone who needs it.
          </p>

          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onNavigate('scan');
              }}
              className="px-8 py-3.5 bg-[#121212] text-[#CCFF00] border-2 border-[#121212] font-grotesk text-sm font-black uppercase tracking-wider brutal-shadow brutal-btn flex items-center gap-2"
            >
              <span>Find Its Next Life →</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onNavigate('exchange');
              }}
              className="px-7 py-3.5 bg-white text-[#121212] border-2 border-[#121212] font-grotesk text-sm font-bold uppercase tracking-wider brutal-shadow-sm brutal-btn"
            >
              <span>Browse Exchange</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
