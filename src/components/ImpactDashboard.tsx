import React from 'react';
import { ProductPassport } from '../types';
import { calculateAggregatedImpact } from '../services/storage';
import { Leaf, DollarSign } from 'lucide-react';

interface ImpactDashboardProps {
  passports: ProductPassport[];
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ passports }) => {
  const impact = calculateAggregatedImpact(passports);

  const interventionBreakdown = [
    { label: 'Repairs Completed', count: impact.repairedCount, percentage: 46, color: 'bg-[#CCFF00]' },
    { label: 'Reused & Transferred', count: impact.transferredCount, percentage: 32, color: 'bg-[#FFE600]' },
    { label: 'Parts Harvested', count: impact.partsHarvestedCount, percentage: 14, color: 'bg-white' },
    { label: 'Closed-Loop Recycled', count: impact.recycledCount, percentage: 8, color: 'bg-[#71717A]' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-[#121212]">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#121212] uppercase leading-none">
            REAL MATERIAL<br />
            DIVERSION.
          </h1>
        </div>

        <div className="max-w-xs text-xs text-[#121212] space-y-1 bg-white border-2 border-[#121212] p-4 brutal-shadow-sm">
          <div className="font-bold text-[#0F3822]">Impact Estimates & Rigor</div>
          <div className="text-[11px] text-[#555555]">
            Calculated across GHG Protocol Scope 3 LCA baselines for electronics, furniture, and textiles.
          </div>
        </div>
      </div>

      {/* 3 Large Poster Metric Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-[#CCFF00] border-2 border-[#121212] p-6 sm:p-8 brutal-shadow flex flex-col justify-between">
          <div className="text-xs font-bold text-[#121212] uppercase tracking-wider">
            Items Diverted
          </div>
          <div className="my-6">
            <div className="font-display text-6xl sm:text-7xl lg:text-8xl font-black text-[#121212] leading-none tabular-nums">
              {String(impact.totalItemsDiverted).padStart(2, '0')}
            </div>
            <div className="font-grotesk text-lg sm:text-xl font-black text-[#121212] uppercase tracking-tight mt-2">
              Items Given<br />Another Life
            </div>
          </div>
          <div className="text-[11px] text-[#121212] border-t border-[#121212] pt-2 font-medium">
            Recorded in verified passport catalog
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#121212] text-white border-2 border-[#121212] p-6 sm:p-8 brutal-shadow flex flex-col justify-between">
          <div className="text-xs font-bold text-[#CCFF00] uppercase tracking-wider">
            Landfill Prevented
          </div>
          <div className="my-6">
            <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-[#CCFF00] leading-none tabular-nums">
              {impact.totalWasteAvoidedKg} <span className="text-2xl sm:text-3xl font-grotesk font-bold text-white">kg</span>
            </div>
            <div className="font-grotesk text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-2">
              Estimated Waste<br />Avoided
            </div>
          </div>
          <div className="text-[11px] text-zinc-400 border-t border-zinc-800 pt-2 font-medium">
            Solid hardware and bulk material retained
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#FFE600] border-2 border-[#121212] p-6 sm:p-8 brutal-shadow flex flex-col justify-between">
          <div className="text-xs font-bold text-[#121212] uppercase tracking-wider">
            Lifecycle Extensions
          </div>
          <div className="my-6">
            <div className="font-display text-6xl sm:text-7xl lg:text-8xl font-black text-[#121212] leading-none tabular-nums">
              {String(impact.totalLifecycleExtensions).padStart(2, '0')}
            </div>
            <div className="font-grotesk text-lg sm:text-xl font-black text-[#121212] uppercase tracking-tight mt-2">
              Lifecycle<br />Extensions
            </div>
          </div>
          <div className="text-[11px] text-[#121212] border-t border-[#121212] pt-2 font-medium">
            Repairs, upgrades, and secondary transfers
          </div>
        </div>
      </div>

      {/* Carbon & Economy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-[#121212] p-6 brutal-shadow space-y-3">
          <div className="flex items-center justify-between border-b border-[#121212] pb-3">
            <span className="text-xs font-bold text-[#121212] uppercase">
              Embodied Carbon Preserved
            </span>
            <Leaf className="w-4 h-4 text-[#0F3822]" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-black text-[#121212] tabular-nums">
              {impact.totalEmbodiedCarbonSavedKgCO2}
            </span>
            <span className="text-xs font-bold text-[#0F3822]">kg CO2 equivalent</span>
          </div>

          <p className="text-xs text-[#555555] leading-relaxed">
            Preserving functional hardware prevents primary extraction, refining, and manufacturing emissions from virgin raw materials.
          </p>
        </div>

        <div className="bg-white border-2 border-[#121212] p-6 brutal-shadow space-y-3">
          <div className="flex items-center justify-between border-b border-[#121212] pb-3">
            <span className="text-xs font-bold text-[#121212] uppercase">
              Community Economic Value Saved
            </span>
            <DollarSign className="w-4 h-4 text-[#121212]" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-black text-[#121212] tabular-nums">
              ${impact.totalEconomicValueRetainedUsd.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-[#121212]">USD residual value</span>
          </div>

          <p className="text-xs text-[#555555] leading-relaxed">
            Direct replacement cost savings kept within local schools, makerspaces, and community organizations.
          </p>
        </div>
      </div>

      {/* Intervention Distribution Bars */}
      <div className="bg-white border-2 border-[#121212] p-6 brutal-shadow space-y-5">
        <div className="flex items-center justify-between border-b-2 border-[#121212] pb-3">
          <h3 className="font-display text-xl font-black text-[#121212] uppercase">
            Distribution of Circular Actions
          </h3>
          <span className="text-xs font-bold bg-[#121212] text-[#CCFF00] px-2 py-0.5">
            Total Events: {passports.reduce((acc, p) => acc + p.events.length, 0)}
          </span>
        </div>

        <div className="space-y-3.5">
          {interventionBreakdown.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#121212]">
                <span>{item.label}</span>
                <span className="tabular-nums">
                  {item.count} events · {item.percentage}%
                </span>
              </div>
              
              <div className="w-full bg-[#EFECE4] h-3.5 border-2 border-[#121212]">
                <div
                  className={`h-full ${item.color} border-r border-[#121212]`}
                  style={{ width: `${Math.max(8, item.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
