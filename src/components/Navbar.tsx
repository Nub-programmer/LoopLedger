import React, { useState } from 'react';
import { Menu, X, Play } from 'lucide-react';
import { playClickSound } from '../services/audio';

interface NavbarProps {
  currentPage: 'home' | 'scan' | 'passports' | 'exchange' | 'impact' | 'about';
  onNavigate: (page: 'home' | 'scan' | 'passports' | 'exchange' | 'impact' | 'about') => void;
  onStartDemo: () => void;
  passportCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onStartDemo,
  passportCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: 'home' | 'scan' | 'passports' | 'exchange' | 'impact' | 'about') => {
    playClickSound();
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F8F6F0] border-b-2 border-[#121212] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-1 text-left focus:outline-hidden"
            >
              <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#121212] uppercase hover:opacity-90">
                LOOPLEDGER
              </span>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {(
              [
                { id: 'scan', label: 'Scan' },
                { id: 'passports', label: 'Passports' },
                { id: 'exchange', label: 'Exchange' },
                { id: 'impact', label: 'Impact' },
                { id: 'about', label: 'About' }
              ] as const
            ).map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-1.5 text-sm font-grotesk font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#CCFF00] text-[#121212] border-2 border-[#121212] brutal-shadow-sm'
                      : 'text-[#121212] hover:bg-[#EFECE4] border-2 border-transparent'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-3">
            {/* Judge Demo CTA */}
            <button
              onClick={() => {
                playClickSound();
                onStartDemo();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE600] text-[#121212] border-2 border-[#121212] font-grotesk font-bold text-xs sm:text-sm tracking-tight brutal-shadow-sm brutal-btn"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Judge Demo</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 border-2 border-[#121212] bg-white text-[#121212] hover:bg-[#CCFF00] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Clean Fullscreen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-[#F8F6F0] flex flex-col justify-between p-6 border-b-4 border-[#121212] md:hidden overflow-y-auto">
          <div className="space-y-3 pt-2">
            <div className="flex flex-col gap-2">
              {[
                { id: 'home', label: 'Home', desc: 'Product Overview & Mission' },
                { id: 'scan', label: 'Scan', desc: 'Identify items and find their next life' },
                { id: 'passports', label: 'Passports', desc: `Verified product catalog (${passportCount})` },
                { id: 'exchange', label: 'Exchange', desc: 'Community circular marketplace' },
                { id: 'impact', label: 'Impact', desc: 'Waste diversion & carbon metrics' },
                { id: 'about', label: 'About', desc: 'Why LoopLedger was built' }
              ].map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as any)}
                    className={`w-full text-left p-4 border-2 border-[#121212] transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#CCFF00] text-[#121212] brutal-shadow font-black'
                        : 'bg-white hover:bg-[#EFECE4] text-[#121212]'
                    }`}
                  >
                    <div>
                      <div className="font-display text-2xl font-black">{item.label}</div>
                      <div className="text-xs text-[#555555] mt-0.5">{item.desc}</div>
                    </div>
                    <span className="text-xl font-bold">→</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t-2 border-[#121212] space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartDemo();
              }}
              className="w-full py-3.5 bg-[#FFE600] text-[#121212] border-2 border-[#121212] font-grotesk font-bold text-sm tracking-tight brutal-shadow flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Judge Demo</span>
            </button>
            <div className="text-center text-xs text-[#71717A]">
              LoopLedger · Circular Product Infrastructure
            </div>
          </div>
        </div>
      )}
    </>
  );
};
