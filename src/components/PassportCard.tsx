import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { ProductPassport } from '../types';
import { 
  ArrowUpRight, 
  Printer, 
  PlusCircle, 
  ShoppingBag, 
  History, 
  Check, 
  Copy, 
  Maximize2
} from 'lucide-react';
import { playClickSound } from '../services/audio';

interface PassportCardProps {
  passport: ProductPassport;
  onLogEvent?: (passport: ProductPassport) => void;
  onListExchange?: (passport: ProductPassport) => void;
  onViewTimeline?: (passport: ProductPassport) => void;
  isHeroPreview?: boolean;
}

export const PassportCard: React.FC<PassportCardProps> = ({
  passport,
  onLogEvent,
  onListExchange,
  onViewTimeline,
  isHeroPreview = false
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showFullQR, setShowFullQR] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const payload = `https://loopledger.local/passports/${passport.id}?score=${passport.analysis.circularityScore}&next=${passport.analysis.primaryAction}`;
    QRCode.toDataURL(payload, {
      margin: 1,
      width: 200,
      color: {
        dark: '#121212',
        light: '#FFFFFF'
      }
    }).then(setQrDataUrl).catch(console.error);
  }, [passport]);

  const handleCopyId = () => {
    playClickSound();
    navigator.clipboard.writeText(passport.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <>
      <div
        ref={cardRef}
        className="w-full bg-white border-2 border-[#121212] brutal-shadow-lg relative overflow-hidden"
      >
        {/* Top Header Banner */}
        <div className="bg-[#121212] text-[#F8F6F0] px-4 py-2.5 flex items-center justify-between border-b-2 border-[#121212]">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm sm:text-base font-black tracking-wider text-[#CCFF00] uppercase">
              LOOPLEDGER
            </span>
            <span className="text-zinc-500">·</span>
            <span className="font-grotesk text-xs tracking-wider text-zinc-300 uppercase">
              Digital Product Passport
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF00]" />
            <span className="text-xs font-bold text-[#CCFF00]">
              Verified Record
            </span>
          </div>
        </div>

        {/* Passport Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Vertical Spine (Desktop) */}
          <div className="hidden md:flex md:col-span-1 bg-[#EFECE4] border-r-2 border-[#121212] items-center justify-center py-6 select-none">
            <div className="transform -rotate-90 whitespace-nowrap font-grotesk text-xs font-bold tracking-widest text-[#121212] uppercase">
              Product History & Custody
            </div>
          </div>

          {/* Central Body */}
          <div className="col-span-1 md:col-span-8 p-5 sm:p-6 space-y-5">
            {/* ID & Status Row */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b-2 border-[#121212]">
              <div>
                <div className="text-xs text-[#71717A] uppercase font-semibold">
                  Passport ID
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="font-mono text-2xl font-black text-[#121212] tracking-tight">
                    {passport.id}
                  </h3>
                  <button
                    onClick={handleCopyId}
                    title="Copy Passport ID"
                    className="p-1 border border-[#121212] hover:bg-[#CCFF00] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#121212]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <div className="text-xs text-[#71717A] uppercase font-semibold">
                  Status
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#CCFF00] border border-[#121212] font-grotesk text-xs font-bold text-[#121212] mt-0.5">
                  <span>{passport.status}</span>
                </div>
              </div>
            </div>

            {/* Product Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-[#71717A] uppercase font-semibold">Product</div>
                <div className="font-grotesk text-base font-bold text-[#121212] truncate mt-0.5">
                  {passport.name}
                </div>
              </div>

              <div>
                <div className="text-[#71717A] uppercase font-semibold">Category</div>
                <div className="font-semibold text-[#121212] mt-0.5">
                  {passport.category}
                </div>
              </div>

              <div>
                <div className="text-[#71717A] uppercase font-semibold">Condition</div>
                <div className="font-semibold text-[#121212] mt-0.5">
                  {passport.currentCondition}
                </div>
              </div>

              <div>
                <div className="text-[#71717A] uppercase font-semibold">Current Custodian</div>
                <div className="font-semibold text-[#121212] truncate mt-0.5">
                  {passport.ownerName}
                </div>
              </div>

              <div>
                <div className="text-[#71717A] uppercase font-semibold">Location</div>
                <div className="text-[#555555] truncate mt-0.5">
                  {passport.ownerLocation}
                </div>
              </div>

              <div>
                <div className="text-[#71717A] uppercase font-semibold">Created</div>
                <div className="font-mono text-xs font-bold text-[#121212] mt-0.5">
                  {passport.createdAt}
                </div>
              </div>
            </div>

            {/* Materials Breakdown */}
            <div className="p-3 bg-[#FAF8F5] border border-[#121212]">
              <div className="text-xs font-bold text-[#121212] uppercase mb-1.5">
                Bill of Materials
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {passport.analysis.materialsBreakdown.map((m, idx) => (
                  <span key={idx} className="bg-white border border-[#121212] px-2 py-0.5 text-[#121212]">
                    {m.material} <strong className="text-[#0F3822]">{m.percentage}%</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            {!isHeroPreview && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {onLogEvent && (
                  <button
                    onClick={() => {
                      playClickSound();
                      onLogEvent(passport);
                    }}
                    className="px-3.5 py-1.5 bg-[#CCFF00] border border-[#121212] text-[#121212] font-grotesk font-bold text-xs flex items-center gap-1.5 brutal-shadow-sm brutal-btn"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Log Lifecycle Event</span>
                  </button>
                )}

                {onListExchange && passport.status !== 'AVAILABLE ON EXCHANGE' && (
                  <button
                    onClick={() => {
                      playClickSound();
                      onListExchange(passport);
                    }}
                    className="px-3.5 py-1.5 bg-white border border-[#121212] text-[#121212] font-grotesk font-bold text-xs flex items-center gap-1.5 brutal-shadow-sm brutal-btn"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>List on Exchange</span>
                  </button>
                )}

                {onViewTimeline && (
                  <button
                    onClick={() => {
                      playClickSound();
                      onViewTimeline(passport);
                    }}
                    className="px-3.5 py-1.5 bg-[#FFE600] border border-[#121212] text-[#121212] font-grotesk font-bold text-xs flex items-center gap-1.5 brutal-shadow-sm brutal-btn"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>View Timeline ({passport.events.length})</span>
                  </button>
                )}

                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1.5 bg-white border border-[#121212] text-[#555555] hover:text-[#121212] text-xs flex items-center gap-1 hover:bg-[#EFECE4] transition-colors"
                  title="Print Passport Sheet"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Ticket Stub: Score + QR Code */}
          <div className="col-span-1 md:col-span-3 bg-[#FAF8F5] border-t-2 md:border-t-0 md:border-l-2 md:border-dashed border-[#121212] p-5 flex flex-col justify-between items-center text-center">
            {/* Score Stamp */}
            <div className="w-full bg-[#CCFF00] border-2 border-[#121212] p-3 brutal-shadow-sm mb-3">
              <div className="text-[10px] font-bold text-[#121212] uppercase tracking-wider">
                Circularity Score
              </div>
              <div className="font-display text-4xl font-black text-[#121212] leading-none my-1">
                {passport.analysis.circularityScore}
                <span className="text-sm font-grotesk font-bold">/100</span>
              </div>
              <div className="text-[11px] font-black uppercase text-[#121212]">
                {passport.analysis.primaryAction} FIRST →
              </div>
            </div>

            {/* Live QR Code */}
            <div className="my-auto space-y-2">
              <div 
                onClick={() => setShowFullQR(true)}
                className="p-2 bg-white border-2 border-[#121212] inline-block brutal-shadow-sm cursor-pointer group"
                title="Click to expand QR Code"
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR for ${passport.id}`}
                    className="w-24 h-24 mx-auto"
                  />
                ) : (
                  <div className="w-24 h-24 bg-zinc-100 flex items-center justify-center text-xs">
                    Loading QR...
                  </div>
                )}
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#71717A] mt-1 group-hover:text-[#121212]">
                  <Maximize2 className="w-3 h-3" />
                  <span>Expand QR</span>
                </div>
              </div>
            </div>

            {/* Barcode Footer */}
            <div className="w-full pt-2 mt-2 border-t border-dashed border-[#121212]">
              <div className="w-full h-6 barcode-pattern border border-[#121212] mb-1" />
              <div className="font-mono text-[9px] text-[#71717A]">
                {passport.id}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Fullscreen QR Modal */}
      {showFullQR && (
        <div className="fixed inset-0 z-50 bg-[#121212]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-3 border-[#121212] p-6 max-w-sm w-full brutal-shadow-xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b-2 border-[#121212] pb-2">
              <span className="font-display font-black text-lg text-[#121212] uppercase">
                Product Passport QR
              </span>
              <span className="font-mono text-xs font-bold text-[#121212] bg-[#CCFF00] px-2 py-0.5 border border-[#121212]">
                {passport.id}
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F5] border-2 border-[#121212]">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${passport.id}`}
                  className="w-56 h-56 mx-auto"
                />
              )}
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              Scan with any mobile camera to view verified chain-of-custody and circular lifecycle history.
            </p>

            <button
              onClick={() => setShowFullQR(false)}
              className="w-full py-2 bg-[#CCFF00] text-[#121212] font-grotesk font-bold text-xs uppercase border-2 border-[#121212] brutal-shadow brutal-btn"
            >
              Close QR Inspector
            </button>
          </div>
        </div>
      )}
    </>
  );
};
