import React from 'react';
import { CircularityEngineResult } from '../types';

interface EngineDecisionTraceProps {
  analysis: CircularityEngineResult;
  compact?: boolean;
}

export const EngineDecisionTrace: React.FC<EngineDecisionTraceProps> = ({ analysis, compact = false }) => {
  return (
    <div className="w-full bg-[#121212] text-[#F8F6F0] border-2 border-[#121212] p-5 brutal-shadow">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div>
          <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#CCFF00]">
            Circularity Engine Decision Log
          </span>
        </div>
        <div className="text-xs text-zinc-400 font-mono">
          Deterministic LCA
        </div>
      </div>

      {/* Metrics Stack */}
      <div className="py-4 space-y-3 font-sans">
        {analysis.traceMetrics.map((metric) => {
          const ratingColor =
            metric.rating === 'HIGH'
              ? 'text-[#CCFF00]'
              : metric.rating === 'MED'
              ? 'text-[#FFE600]'
              : 'text-zinc-400';

          return (
            <div key={metric.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold font-mono text-[11px] ${ratingColor}`}>[{metric.rating}]</span>
                  <span className="font-mono text-zinc-400 text-xs">{metric.score}%</span>
                </div>
              </div>

              {/* Square Block Bar */}
              <div className="flex items-center justify-between bg-zinc-900 px-3 py-1.5 border border-zinc-800 font-mono text-xs">
                <span className="tracking-widest text-[#CCFF00] select-none">
                  {metric.blockBar}
                </span>
                <span className="text-[11px] text-zinc-400 truncate max-w-[220px] pl-2 font-sans">
                  {metric.notes}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Output Banner */}
      <div className="mt-2 p-3.5 bg-[#CCFF00] text-[#121212] border-2 border-[#121212] space-y-0.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#121212]">
          Decision Rationale
        </div>
        <div className="font-grotesk text-sm font-black uppercase leading-tight">
          {analysis.engineDecisionSummary.replace('DECISION:', 'Decision:')}
        </div>
      </div>

      {/* Impact summary row */}
      {!compact && (
        <div className="mt-4 pt-3 border-t border-zinc-800 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-zinc-900 p-2 border border-zinc-800">
            <div className="text-[10px] text-zinc-400">Waste Avoided</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {analysis.wasteAvoidedKg} <span className="text-xs text-[#CCFF00]">kg</span>
            </div>
          </div>
          <div className="bg-zinc-900 p-2 border border-zinc-800">
            <div className="text-[10px] text-zinc-400">Carbon Avoided</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {analysis.carbonDebtAvoidedKgCO2} <span className="text-xs text-[#CCFF00]">kg CO2e</span>
            </div>
          </div>
          <div className="bg-zinc-900 p-2 border border-zinc-800">
            <div className="text-[10px] text-zinc-400">Residual Value</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              ${analysis.estimatedResidualValueUsd}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
