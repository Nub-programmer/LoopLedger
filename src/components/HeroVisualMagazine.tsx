import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ArrowUpRight, ShieldCheck, RefreshCw, Wrench } from 'lucide-react';
import { playClickSound } from '../services/audio';

interface HeroVisualMagazineProps {
  onExplorePassport?: (id: string) => void;
}

export const HeroVisualMagazine: React.FC<HeroVisualMagazineProps> = ({ onExplorePassport }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL('https://loopledger.local/passports/LOOP-7K3M92', {
      margin: 1,
      width: 140,
      color: {
        dark: '#121212',
        light: '#FFFFFF'
      }
    }).then(setQrUrl).catch(console.error);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none min-h-[420px] lg:min-h-[480px] flex items-center justify-center select-none py-4">
      {/* Floating Badge 1: Top Right */}
      <div 
        className="absolute top-2 right-2 sm:right-6 z-20 bg-[#CCFF00] border-2 border-[#121212] px-3 py-1.5 font-grotesk text-xs font-black uppercase brutal-shadow-sm rotate-3 hover:rotate-0 transition-transform duration-200"
      >
        <span className="flex items-center gap-1.5 text-[#121212]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Passport</span>
        </span>
      </div>

      {/* Floating Badge 2: Top Left */}
      <div className="absolute top-6 left-0 sm:left-4 z-20 bg-[#FFE600] border-2 border-[#121212] p-2 brutal-shadow-sm -rotate-6">
        <div className="flex items-center gap-1 font-grotesk text-xs font-black text-[#121212]">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Zero Landfill</span>
        </div>
      </div>

      {/* Floating Badge 3: Bottom Left Metric */}
      <div className="absolute bottom-4 left-2 sm:left-6 z-20 bg-[#121212] text-[#CCFF00] border-2 border-[#121212] px-3 py-1.5 text-xs font-bold brutal-shadow-white rotate-2">
        <span>64 kg CO2e Avoided</span>
      </div>

      {/* MAIN TILTED PASSPORT CARD */}
      <div
        onClick={() => {
          playClickSound();
          if (onExplorePassport) onExplorePassport('LOOP-7K3M92');
        }}
        className="relative z-10 w-full max-w-[360px] sm:max-w-[400px] bg-white border-2 border-[#121212] brutal-shadow-xl p-5 -rotate-2 hover:rotate-0 transition-all duration-300 cursor-pointer group"
      >
        {/* Card Header Strip */}
        <div className="flex items-start justify-between pb-3 border-b-2 border-[#121212]">
          <div>
            <div className="text-[10px] tracking-wider text-[#71717A] uppercase font-semibold">
              Digital Product Passport
            </div>
            <div className="font-display text-2xl font-black tracking-tight text-[#121212] flex items-center gap-2">
              <span>LOOP 7K3M92</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF00]" />
            </div>
          </div>
          <div className="px-2 py-0.5 bg-[#121212] text-white text-xs font-bold">
            2026
          </div>
        </div>

        {/* Product Spec Row */}
        <div className="py-4 grid grid-cols-12 gap-3 items-center border-b-2 border-dashed border-[#121212]">
          {/* Left item details */}
          <div className="col-span-7 space-y-1">
            <div className="text-[10px] text-[#71717A] uppercase font-semibold">Product</div>
            <div className="font-grotesk text-lg font-black text-[#121212] leading-tight">
              School Tablet 10.1"
            </div>
            <div className="text-xs text-[#555555]">
              District Education Fleet
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#121212]">
              <Wrench className="w-3.5 h-3.5 text-[#121212]" />
              <span>Status: In Repair</span>
            </div>
          </div>

          {/* Right Score Badge */}
          <div className="col-span-5 flex flex-col items-center justify-center p-3 bg-[#CCFF00] border-2 border-[#121212] brutal-shadow-sm">
            <div className="text-[9px] font-bold text-[#121212] uppercase tracking-wider">
              Circularity
            </div>
            <div className="font-display text-3xl font-black text-[#121212] leading-none my-0.5">
              87<span className="text-xs font-grotesk font-bold">/100</span>
            </div>
            <div className="text-[10px] font-bold text-[#121212]">
              High Value
            </div>
          </div>
        </div>

        {/* Next Best Action Action Strip */}
        <div className="my-3 p-3 bg-[#121212] text-white border-2 border-[#121212] flex items-center justify-between group-hover:bg-[#0F3822] transition-colors">
          <div>
            <div className="text-[9px] text-[#CCFF00] uppercase tracking-wider font-semibold">
              Next Best Action
            </div>
            <div className="font-grotesk text-base font-black text-white tracking-wide flex items-center gap-1">
              <span>Repair First</span>
              <ArrowUpRight className="w-4 h-4 text-[#CCFF00]" />
            </div>
          </div>
          <div className="text-right text-xs text-zinc-300">
            <div className="text-[#CCFF00] font-medium">Port fix restores 90%</div>
          </div>
        </div>

        {/* Footer: QR Code */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="Passport QR Code"
                className="w-12 h-12 border border-[#121212] p-0.5 bg-white shrink-0"
              />
            ) : (
              <div className="w-12 h-12 bg-zinc-200 border border-[#121212] flex items-center justify-center text-xs">
                QR
              </div>
            )}
            <div className="space-y-0.5">
              <div className="text-[10px] text-[#71717A]">
                Scan to verify history
              </div>
              <div className="text-xs font-bold text-[#121212]">
                EU DPP Standard
              </div>
            </div>
          </div>

          <div className="w-20 h-8 barcode-pattern border border-[#121212]" />
        </div>
      </div>
    </div>
  );
};
