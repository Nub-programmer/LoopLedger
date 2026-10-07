import { 
  CategoryType, 
  CircularityEngineResult, 
  NextLifeAction, 
  ActionRank, 
  DecisionTraceMetric 
} from '../types';

export interface EvaluationInput {
  name: string;
  category: CategoryType;
  condition: 'PRISTINE' | 'LIGHT WEAR' | 'MINOR FAULT' | 'HEAVILY DAMAGED' | 'PARTS ONLY';
  faultDescription?: string;
  ageYears?: number;
  materials?: string[];
  powerSource?: 'BATTERY' | 'CORDED' | 'MANUAL' | 'NONE';
}

function generateBlockBar(score: number): string {
  const totalBlocks = 10;
  const filledBlocks = Math.min(10, Math.max(0, Math.round(score / 10)));
  const emptyBlocks = totalBlocks - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
}

export function evaluateCircularity(input: EvaluationInput): CircularityEngineResult {
  const { category, condition, ageYears = 2 } = input;

  let functionalityScore = 50;
  let repairabilityScore = 65;
  let reusePotentialScore = 60;
  let materialRecoveryScore = 40;
  let wasteAvoidedKg = 4.2;
  let carbonDebtAvoidedKgCO2 = 38.5;
  let estimatedResidualValueUsd = 120;
  let repairDifficulty: 'VERY LOW' | 'MODERATE' | 'SPECIALIZED' | 'UNECONOMICAL' = 'MODERATE';

  switch (category) {
    case 'ELECTRONICS':
      repairabilityScore = 78;
      reusePotentialScore = 72;
      materialRecoveryScore = 35;
      wasteAvoidedKg = 2.4;
      carbonDebtAvoidedKgCO2 = 64.2;
      estimatedResidualValueUsd = 180;
      break;
    case 'FURNITURE':
      repairabilityScore = 88;
      reusePotentialScore = 80;
      materialRecoveryScore = 55;
      wasteAvoidedKg = 18.5;
      carbonDebtAvoidedKgCO2 = 42.0;
      estimatedResidualValueUsd = 110;
      break;
    case 'TEXTILES':
      repairabilityScore = 85;
      reusePotentialScore = 82;
      materialRecoveryScore = 45;
      wasteAvoidedKg = 1.8;
      carbonDebtAvoidedKgCO2 = 22.4;
      estimatedResidualValueUsd = 45;
      break;
    case 'TOOLS':
      repairabilityScore = 92;
      reusePotentialScore = 86;
      materialRecoveryScore = 60;
      wasteAvoidedKg = 4.8;
      carbonDebtAvoidedKgCO2 = 34.0;
      estimatedResidualValueUsd = 85;
      break;
    case 'BOOKS':
      repairabilityScore = 60;
      reusePotentialScore = 95;
      materialRecoveryScore = 70;
      wasteAvoidedKg = 1.2;
      carbonDebtAvoidedKgCO2 = 8.5;
      estimatedResidualValueUsd = 25;
      break;
    case 'APPLIANCES':
      repairabilityScore = 80;
      reusePotentialScore = 65;
      materialRecoveryScore = 50;
      wasteAvoidedKg = 12.0;
      carbonDebtAvoidedKgCO2 = 52.0;
      estimatedResidualValueUsd = 95;
      break;
    default:
      repairabilityScore = 65;
      reusePotentialScore = 60;
      materialRecoveryScore = 40;
      wasteAvoidedKg = 3.0;
      carbonDebtAvoidedKgCO2 = 25.0;
      estimatedResidualValueUsd = 50;
      break;
  }

  switch (condition) {
    case 'PRISTINE':
      functionalityScore = 95;
      reusePotentialScore = Math.min(98, reusePotentialScore + 20);
      repairabilityScore = 90;
      materialRecoveryScore = 20;
      repairDifficulty = 'VERY LOW';
      break;
    case 'LIGHT WEAR':
      functionalityScore = 82;
      reusePotentialScore = Math.min(90, reusePotentialScore + 10);
      repairabilityScore = 88;
      materialRecoveryScore = 28;
      repairDifficulty = 'VERY LOW';
      break;
    case 'MINOR FAULT':
      functionalityScore = 48;
      repairabilityScore = Math.min(94, repairabilityScore + 8);
      reusePotentialScore = 68;
      materialRecoveryScore = 32;
      repairDifficulty = 'MODERATE';
      break;
    case 'HEAVILY DAMAGED':
      functionalityScore = 22;
      repairabilityScore = Math.max(35, repairabilityScore - 25);
      reusePotentialScore = 35;
      materialRecoveryScore = 65;
      repairDifficulty = 'SPECIALIZED';
      break;
    case 'PARTS ONLY':
      functionalityScore = 10;
      repairabilityScore = 20;
      reusePotentialScore = 25;
      materialRecoveryScore = 85;
      repairDifficulty = 'UNECONOMICAL';
      break;
  }

  if (ageYears > 5) {
    functionalityScore = Math.max(15, functionalityScore - 12);
    estimatedResidualValueUsd = Math.max(15, estimatedResidualValueUsd * 0.6);
  }

  let repairScore = Math.round(repairabilityScore * 0.95 + (condition === 'MINOR FAULT' ? 15 : 0));
  let reuseScore = Math.round(reusePotentialScore * 0.9 + (condition === 'PRISTINE' ? 18 : 0));
  let transferScore = Math.round((functionalityScore * 0.6) + (reusePotentialScore * 0.4));
  let partsScore = Math.round((materialRecoveryScore * 0.6) + (100 - functionalityScore) * 0.5);
  let upcycleScore = Math.round((repairabilityScore * 0.4) + (materialRecoveryScore * 0.4) + 15);
  let remanufactureScore = Math.round((repairabilityScore * 0.5) + (partsScore * 0.4));
  let recycleScore = Math.round(materialRecoveryScore * 0.7);

  repairScore = Math.min(98, Math.max(15, repairScore));
  reuseScore = Math.min(98, Math.max(12, reuseScore));
  transferScore = Math.min(96, Math.max(10, transferScore));
  partsScore = Math.min(95, Math.max(10, partsScore));
  upcycleScore = Math.min(90, Math.max(8, upcycleScore));
  remanufactureScore = Math.min(88, Math.max(10, remanufactureScore));
  recycleScore = Math.min(92, Math.max(15, recycleScore));

  const allActions: { action: NextLifeAction; score: number; note: string }[] = [
    { action: 'REPAIR', score: repairScore, note: 'Component-level fix restores baseline utility.' },
    { action: 'REUSE', score: reuseScore, note: 'Direct redeployment to peer or community user.' },
    { action: 'TRANSFER', score: transferScore, note: 'Relist on circular exchange with chain of custody.' },
    { action: 'PARTS RECOVERY', score: partsScore, note: 'Harvest intact submodules for modular repairs.' },
    { action: 'UPCYCLE', score: upcycleScore, note: 'Repurpose structural housing and chassis elements.' },
    { action: 'REMANUFACTURE', score: remanufactureScore, note: 'Factory-grade recertification and overhaul.' },
    { action: 'RECYCLE', score: recycleScore, note: 'Material separation and elemental recovery.' }
  ];

  allActions.sort((a, b) => b.score - a.score);

  const primaryAction = allActions[0].action;

  const circularityScore = Math.round(
    (allActions[0].score * 0.55) + 
    (allActions[1].score * 0.25) + 
    (Math.max(10, 100 - recycleScore) * 0.20)
  );

  const rankedActions: ActionRank[] = allActions.map((item, idx) => ({
    rank: String(idx + 1).padStart(2, '0'),
    action: item.action,
    score: item.score,
    recommendationNote: item.note,
    isPrimary: idx === 0
  }));

  const traceMetrics: DecisionTraceMetric[] = [
    {
      key: 'FUNC',
      label: 'FUNCTIONALITY',
      score: functionalityScore,
      rating: functionalityScore > 75 ? 'HIGH' : functionalityScore > 40 ? 'MED' : 'LOW',
      blockBar: generateBlockBar(functionalityScore),
      notes: condition === 'MINOR FAULT' ? 'Sub-system offline; core PCB & chassis intact.' : 'Operational baseline.'
    },
    {
      key: 'REPAIR',
      label: 'REPAIRABILITY',
      score: repairabilityScore,
      rating: repairabilityScore > 75 ? 'HIGH' : repairabilityScore > 40 ? 'MED' : 'LOW',
      blockBar: generateBlockBar(repairabilityScore),
      notes: 'Standard fasteners and modular parts detected.'
    },
    {
      key: 'REUSE',
      label: 'REUSE POTENTIAL',
      score: reusePotentialScore,
      rating: reusePotentialScore > 75 ? 'HIGH' : reusePotentialScore > 40 ? 'MED' : 'LOW',
      blockBar: generateBlockBar(reusePotentialScore),
      notes: 'High demand in regional school & student exchange.'
    },
    {
      key: 'MAT_REC',
      label: 'MATERIAL RECOVERY',
      score: materialRecoveryScore,
      rating: materialRecoveryScore > 65 ? 'HIGH' : materialRecoveryScore > 35 ? 'MED' : 'LOW',
      blockBar: generateBlockBar(materialRecoveryScore),
      notes: 'Recycling incurs loss of structural embodied value.'
    }
  ];

  let materialsBreakdown = [
    { material: 'Aluminum Chassis', percentage: 48 },
    { material: 'Silicate Glass', percentage: 24 },
    { material: 'Lithium/Cobalt Cell', percentage: 16 },
    { material: 'Copper & Traces', percentage: 12 }
  ];

  if (category === 'FURNITURE') {
    materialsBreakdown = [
      { material: 'Solid Oak / Plywood', percentage: 65 },
      { material: 'Steel Fasteners & Base', percentage: 22 },
      { material: 'Recycled Poly Foam', percentage: 13 }
    ];
  } else if (category === 'TEXTILES') {
    materialsBreakdown = [
      { material: 'Organic Cotton Denim', percentage: 88 },
      { material: 'Brass Rivets & Zippers', percentage: 7 },
      { material: 'Elastane Thread', percentage: 5 }
    ];
  } else if (category === 'TOOLS') {
    materialsBreakdown = [
      { material: 'Hardened Tool Steel', percentage: 55 },
      { material: 'Glass-Filled Nylon', percentage: 25 },
      { material: 'Copper Armature Wire', percentage: 20 }
    ];
  }

  let engineDecisionSummary = 'Decision: Repair preserves more existing value than material recovery.';
  if (primaryAction === 'REUSE' || primaryAction === 'TRANSFER') {
    engineDecisionSummary = 'Decision: Direct redeployment delivers zero-carbon lifecycle extension.';
  } else if (primaryAction === 'PARTS RECOVERY') {
    engineDecisionSummary = 'Decision: Harvesting intact submodules prevents down-cycling.';
  } else if (primaryAction === 'RECYCLE') {
    engineDecisionSummary = 'Decision: Structural integrity depleted; material separation recommended.';
  }

  return {
    circularityScore,
    primaryAction,
    actionRationale: `Circularity score of ${circularityScore}/100 indicates high residual utility. ${primaryAction} intervention avoids approximately ${carbonDebtAvoidedKgCO2} kg CO2e and ${wasteAvoidedKg} kg landfill mass.`,
    rankedActions,
    traceMetrics,
    wasteAvoidedKg,
    carbonDebtAvoidedKgCO2,
    estimatedResidualValueUsd,
    repairDifficulty,
    materialsBreakdown,
    engineDecisionSummary
  };
}
