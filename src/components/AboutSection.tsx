import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      {/* Manifest Hero Header */}
      <div className="space-y-6">
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#121212] uppercase tracking-tight leading-[0.95]">
          THIS ISN'T A<br />
          RECYCLING APP.
        </h1>

        <div className="p-6 bg-[#CCFF00] border-2 border-[#121212] brutal-shadow max-w-3xl">
          <p className="font-grotesk text-xl sm:text-2xl font-black text-[#121212] uppercase leading-tight">
            "It is open infrastructure for giving products another life."
          </p>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 01 */}
        <div className="bg-white border-2 border-[#121212] p-6 brutal-shadow space-y-3">
          <div className="font-display text-4xl font-black text-[#121212]">01</div>
          <h3 className="font-display text-xl font-black text-[#121212] uppercase">
            Deterministic Decision Engine
          </h3>
          <p className="text-xs text-[#444444] leading-relaxed">
            Most sustainability apps offer vague tips. LoopLedger computes a deterministic Life Cycle Assessment (LCA) model evaluating repairability, embodied carbon, and residual utility to recommend the highest-value intervention.
          </p>
        </div>

        {/* Pillar 02 */}
        <div className="bg-white border-2 border-[#121212] p-6 brutal-shadow space-y-3">
          <div className="font-display text-4xl font-black text-[#121212]">02</div>
          <h3 className="font-display text-xl font-black text-[#121212] uppercase">
            Digital Product Passports
          </h3>
          <p className="text-xs text-[#444444] leading-relaxed">
            Aligned with the European Union Digital Product Passport (EU DPP) standards, every product receives a persistent record with its bill of materials, repair logs, and verified chain of custody.
          </p>
        </div>

        {/* Pillar 03 */}
        <div className="bg-white border-2 border-[#121212] p-6 brutal-shadow space-y-3">
          <div className="font-display text-4xl font-black text-[#121212]">03</div>
          <h3 className="font-display text-xl font-black text-[#121212] uppercase">
            Community Exchange
          </h3>
          <p className="text-xs text-[#444444] leading-relaxed">
            A direct transfer network between schools, maker collectives, workshops, and students so working equipment passes smoothly to someone who needs it before reaching a landfill.
          </p>
        </div>
      </div>

      {/* Standards & UN SDG Compliance */}
      <div className="bg-[#121212] text-white border-2 border-[#121212] p-6 sm:p-8 brutal-shadow space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
          <h2 className="font-display text-2xl font-black text-[#CCFF00] uppercase">
            Standards & Interoperability
          </h2>
          <span className="text-xs text-zinc-400">UN SDG 12 Aligned</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <div className="text-[#CCFF00] font-bold uppercase">UN Sustainable Development Goal 12</div>
            <p className="text-zinc-300 leading-relaxed">
              Target 12.5: Substantially reduce waste generation through prevention, reduction, repair, and reuse. LoopLedger quantifies kilograms of avoided raw material extraction directly on each passport.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-[#CCFF00] font-bold uppercase">Multimodal Image Analysis</div>
            <p className="text-zinc-300 leading-relaxed">
              Uses Gemini multimodal vision for optical identification and condition assessment, paired with client-side deterministic evaluation logic to ensure reliability and reproducible rankings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
