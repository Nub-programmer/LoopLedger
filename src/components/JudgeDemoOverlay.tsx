import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { playClickSound } from '../services/audio';

export const DEMO_STEPS = [
  {
    index: 0,
    shortTitle: 'Scan and Detect',
    page: 'scan',
    sampleItemId: 'tablet'
  },
  {
    index: 1,
    shortTitle: 'Circularity',
    page: 'scan',
    sampleItemId: 'tablet'
  },
  {
    index: 2,
    shortTitle: 'Passport',
    page: 'passports',
    passportId: 'LOOP-7K3M92'
  },
  {
    index: 3,
    shortTitle: 'Repair',
    page: 'passports',
    passportId: 'LOOP-7K3M92'
  },
  {
    index: 4,
    shortTitle: 'Transfer',
    page: 'exchange'
  },
  {
    index: 5,
    shortTitle: 'Impact',
    page: 'impact'
  }
];

interface JudgeDemoOverlayProps {
  isActive: boolean;
  onClose: () => void;
  onSelectStep: (stepIndex: number) => void;
  currentStepIndex: number;
}

export const JudgeDemoOverlay: React.FC<JudgeDemoOverlayProps> = ({
  isActive,
  onClose,
  onSelectStep,
  currentStepIndex
}) => {
  useEffect(() => {
    if (isActive && currentStepIndex === DEMO_STEPS.length - 1) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.15 },
          colors: ['#CCFF00', '#FFE600', '#121212', '#0F3822']
        });
      } catch (e) {
        // Ignore confetti error
      }
    }
  }, [isActive, currentStepIndex]);

  if (!isActive) return null;

  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const progressPercent = ((currentStepIndex + 1) / DEMO_STEPS.length) * 100;

  const handleNext = () => {
    playClickSound();
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      onSelectStep(currentStepIndex + 1);
    } else {
      onSelectStep(0);
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (currentStepIndex > 0) {
      onSelectStep(currentStepIndex - 1);
    }
  };

  return (
    <div className="w-full bg-[#121212] text-white border-b-2 border-[#121212] z-30 transition-all">
      {/* Thin Top Progress Line */}
      <div className="w-full bg-zinc-800 h-1">
        <div
          className="h-full bg-[#CCFF00] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 min-h-[56px]">
        {/* Left: Judge Demo badge & step indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-grotesk font-black text-xs uppercase tracking-wider text-[#CCFF00] bg-zinc-900 px-2 py-1 border border-zinc-700">
            Judge Demo
          </span>
          <span className="text-xs font-semibold text-zinc-300">
            Step {currentStepIndex + 1} of {DEMO_STEPS.length}
          </span>
        </div>

        {/* Center: In-line Steps List (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 text-xs">
          {DEMO_STEPS.map((s, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={s.shortTitle}
                onClick={() => {
                  playClickSound();
                  onSelectStep(idx);
                }}
                className={`px-3 py-1 font-medium transition-colors border ${
                  isCurrent
                    ? 'bg-[#CCFF00] text-[#121212] border-[#CCFF00] font-bold'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {idx + 1}. {s.shortTitle}
              </button>
            );
          })}
        </div>

        {/* Mobile current step label */}
        <div className="lg:hidden text-xs font-bold text-[#CCFF00] truncate">
          {currentStep.shortTitle}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0 text-xs font-bold">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-2.5 py-1.5 bg-zinc-900 text-zinc-300 hover:text-white disabled:opacity-30 border border-zinc-700 flex items-center gap-1"
            title="Previous step"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 bg-[#CCFF00] text-[#121212] hover:bg-[#b8e600] border border-[#121212] flex items-center gap-1 brutal-shadow-sm brutal-btn"
          >
            <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Restart Demo' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-700 ml-1"
            title="Exit demo mode"
            aria-label="Exit demo mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
