/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ScannerZone } from './components/ScannerZone';
import { PassportsPage } from './components/PassportsPage';
import { ExchangeMarketplace } from './components/ExchangeMarketplace';
import { ImpactDashboard } from './components/ImpactDashboard';
import { AboutSection } from './components/AboutSection';
import { JudgeDemoOverlay, DEMO_STEPS } from './components/JudgeDemoOverlay';
import { 
  getStoredPassports, 
  savePassports, 
  getStoredExchangeListings, 
  saveExchangeListings,
  resetToSeedData,
  SEED_PASSPORTS
} from './services/storage';
import { ProductPassport, ExchangeListing, LifecycleEvent } from './types';
import { playClickSound } from './services/audio';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'scan' | 'passports' | 'exchange' | 'impact' | 'about'>('home');
  const [passports, setPassports] = useState<ProductPassport[]>([]);
  const [exchangeListings, setExchangeListings] = useState<ExchangeListing[]>([]);
  const [selectedPassportId, setSelectedPassportId] = useState<string>('LOOP-7K3M92');
  const [isJudgeDemoActive, setIsJudgeDemoActive] = useState<boolean>(false);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setPassports(getStoredPassports());
    setExchangeListings(getStoredExchangeListings());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handlePassportCreated = (newPassport: ProductPassport) => {
    const updated = [newPassport, ...passports];
    setPassports(updated);
    savePassports(updated);
    setSelectedPassportId(newPassport.id);
    showToast(`Digital Product Passport created (${newPassport.id})`);
  };

  const handleAddLifecycleEvent = (passportId: string, newEvent: Omit<LifecycleEvent, 'id'>) => {
    const updated = passports.map((p) => {
      if (p.id === passportId) {
        const eventWithId: LifecycleEvent = {
          ...newEvent,
          id: `evt-${Date.now()}`
        };
        return {
          ...p,
          updatedAt: newEvent.timestamp,
          events: [...p.events, eventWithId]
        };
      }
      return p;
    });

    setPassports(updated);
    savePassports(updated);
    showToast(`Lifecycle event saved for ${passportId}`);
  };

  const handleCreateExchangeListing = (listingData: Omit<ExchangeListing, 'id' | 'listedDate' | 'status'>) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newListing: ExchangeListing = {
      ...listingData,
      id: `ex-${Date.now()}`,
      status: 'AVAILABLE',
      listedDate: today
    };

    const updated = [newListing, ...exchangeListings];
    setExchangeListings(updated);
    saveExchangeListings(updated);

    if (listingData.passportId) {
      const updatedPassports = passports.map((p) => {
        if (p.id === listingData.passportId) {
          return { ...p, status: 'AVAILABLE ON EXCHANGE' as const };
        }
        return p;
      });
      setPassports(updatedPassports);
      savePassports(updatedPassports);
    }

    showToast('Listing published to Community Exchange');
  };

  const handleClaimExchangeItem = (listingId: string, claimantName: string) => {
    const updatedListings = exchangeListings.map((item) => {
      if (item.id === listingId) {
        return {
          ...item,
          status: 'CLAIMED' as const,
          claimedBy: claimantName
        };
      }
      return item;
    });

    setExchangeListings(updatedListings);
    saveExchangeListings(updatedListings);

    const claimedListing = exchangeListings.find((i) => i.id === listingId);
    if (claimedListing?.passportId) {
      handleAddLifecycleEvent(claimedListing.passportId, {
        eventType: 'TRANSFER',
        title: `Transferred to ${claimantName}`,
        description: 'Item reserved via LoopLedger Community Exchange for extended second life.',
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        operatorOrOwner: claimantName,
        location: claimedListing.location,
        verified: true
      });
    }

    showToast(`Item reserved for ${claimantName}`);
  };

  const handleResetData = () => {
    resetToSeedData();
    setPassports(getStoredPassports());
    setExchangeListings(getStoredExchangeListings());
    setSelectedPassportId('LOOP-7K3M92');
    showToast('Catalog reset to initial sample state');
  };

  const handleStartJudgeDemo = () => {
    setIsJudgeDemoActive(true);
    setJudgeDemoStep(0);
    setCurrentPage('scan');
  };

  const handleSelectJudgeStep = (stepIdx: number) => {
    setJudgeDemoStep(stepIdx);
    const target = DEMO_STEPS[stepIdx];
    if (target) {
      setCurrentPage(target.page as any);
      if (target.passportId) {
        setSelectedPassportId(target.passportId);
      }
    }
  };

  const featuredPassport = passports.find((p) => p.id === selectedPassportId) || passports[0] || SEED_PASSPORTS[0];

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#121212] font-sans antialiased selection:bg-[#CCFF00] selection:text-[#121212] flex flex-col justify-between">
      <div className="sticky top-0 z-40 bg-[#F8F6F0]">
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartDemo={handleStartJudgeDemo}
          passportCount={passports.length}
        />

        <JudgeDemoOverlay
          isActive={isJudgeDemoActive}
          onClose={() => setIsJudgeDemoActive(false)}
          onSelectStep={handleSelectJudgeStep}
          currentStepIndex={judgeDemoStep}
        />
      </div>

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            featuredPassport={featuredPassport}
            exchangeListings={exchangeListings}
            passports={passports}
            onSelectPassport={(id) => {
              setSelectedPassportId(id);
              setCurrentPage('passports');
            }}
          />
        )}

        {currentPage === 'scan' && (
          <ScannerZone
            onPassportCreated={handlePassportCreated}
            onNavigateToPassport={(id) => {
              setSelectedPassportId(id);
              setCurrentPage('passports');
            }}
            autoLoadPreset={isJudgeDemoActive ? 'tablet' : undefined}
          />
        )}

        {currentPage === 'passports' && (
          <PassportsPage
            passports={passports}
            selectedPassportId={selectedPassportId}
            onSelectPassport={(id) => setSelectedPassportId(id)}
            onNavigateToScan={() => setCurrentPage('scan')}
            onAddLifecycleEvent={handleAddLifecycleEvent}
            onListExchange={(passport) => {
              handleCreateExchangeListing({
                passportId: passport.id,
                title: passport.name,
                category: passport.category,
                condition: passport.currentCondition,
                location: passport.ownerLocation,
                priceType: 'COMMUNITY PRICE',
                priceUsd: 35,
                imageUrl: passport.imageUrl,
                description: `Digital Product Passport ${passport.id}. Circularity score: ${passport.analysis.circularityScore}/100.`
              });
              setCurrentPage('exchange');
            }}
          />
        )}

        {currentPage === 'exchange' && (
          <ExchangeMarketplace
            listings={exchangeListings}
            passports={passports}
            onClaimItem={handleClaimExchangeItem}
            onCreateListing={handleCreateExchangeListing}
            onExplorePassport={(id) => {
              setSelectedPassportId(id);
              setCurrentPage('passports');
            }}
          />
        )}

        {currentPage === 'impact' && (
          <ImpactDashboard passports={passports} />
        )}

        {currentPage === 'about' && (
          <AboutSection />
        )}
      </main>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-[#CCFF00] border-2 border-[#121212] px-4 py-3 font-grotesk text-xs font-bold uppercase brutal-shadow-lg">
          {toastMessage}
        </div>
      )}

      <footer className="w-full bg-[#121212] text-white border-t-2 border-[#121212] py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-black text-[#CCFF00] uppercase">
              LOOPLEDGER
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300">Circular Product Infrastructure</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>UN SDG 12</span>
            <span>·</span>
            <span>EU DPP Aligned</span>
            <span>·</span>
            <span>HackTrack '26</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                handleResetData();
              }}
              className="text-[#CCFF00] hover:underline"
            >
              Reset Demo Catalog
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
