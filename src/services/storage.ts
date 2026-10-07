import { ProductPassport, ExchangeListing, ImpactMetrics } from '../types';
import { evaluateCircularity } from './circularityEngine';

const STORAGE_KEY_PASSPORTS = 'loopledger_passports_v1';
const STORAGE_KEY_EXCHANGE = 'loopledger_exchange_v1';

export const SEED_PASSPORTS: ProductPassport[] = [
  {
    id: 'LOOP-7K3M92',
    name: 'School Tablet 10.1"',
    category: 'ELECTRONICS',
    brand: 'Lenovo / EduTab Pro',
    modelNumber: 'TB-X606F',
    manufactureYear: 2024,
    originalPriceUsd: 280,
    currentCondition: 'MINOR FAULT',
    status: 'ACTIVE / IN USE',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    createdAt: '01 Oct 2026',
    updatedAt: '06 Oct 2026',
    ownerName: 'St. Jude Community School',
    ownerLocation: 'District 4 Tech Hub',
    serialNumber: 'SN-EDUTAB-992144',
    repairGuideUrl: 'https://ifixit.com',
    analysis: evaluateCircularity({
      name: 'School Tablet 10.1"',
      category: 'ELECTRONICS',
      condition: 'MINOR FAULT',
      faultDescription: 'USB-C charging port loose; battery health 84%',
      ageYears: 2
    }),
    events: [
      {
        id: 'evt-1',
        eventType: 'REGISTERED',
        title: 'Initial Digital Passport Created',
        description: 'Asset registered into education fleet with initial bill of materials.',
        timestamp: '01 Oct 2026',
        operatorOrOwner: 'District IT Admin',
        location: 'Hub Central',
        verified: true
      },
      {
        id: 'evt-2',
        eventType: 'CONDITION ASSESSED',
        title: 'Optical Condition Assessment',
        description: 'Loose charging port pin detected; logic board fully functional.',
        timestamp: '03 Oct 2026',
        operatorOrOwner: 'Intake Inspector',
        location: 'Maker Lab 02',
        verified: true
      },
      {
        id: 'evt-3',
        eventType: 'REPAIR',
        title: 'Component Replacement: USB-C Daughterboard',
        description: 'Installed replacement board; battery tested at 89% peak capacity.',
        timestamp: '05 Oct 2026',
        operatorOrOwner: 'Elena Rostova',
        location: 'Repair Station B',
        verified: true
      },
      {
        id: 'evt-4',
        eventType: 'TRANSFER',
        title: 'Assigned to Secondary Student',
        description: 'Passed to robotics student for CAD modeling workshop.',
        timestamp: '06 Oct 2026',
        operatorOrOwner: 'St. Jude Robotics Lab',
        location: 'Room 304',
        verified: true
      }
    ]
  },
  {
    id: 'LOOP-3B9R14',
    name: 'Ergonomic Task Chair V2',
    category: 'FURNITURE',
    brand: 'Herman Miller Style',
    modelNumber: 'TASK-MESH-80',
    manufactureYear: 2023,
    originalPriceUsd: 450,
    currentCondition: 'LIGHT WEAR',
    status: 'AVAILABLE ON EXCHANGE',
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-73ab013f33d7?w=600&auto=format&fit=crop&q=80',
    createdAt: '28 Sep 2026',
    updatedAt: '04 Oct 2026',
    ownerName: 'Co-Working Space 09',
    ownerLocation: 'Creative Quarter',
    serialNumber: 'SN-HM-77289',
    analysis: evaluateCircularity({
      name: 'Ergonomic Task Chair V2',
      category: 'FURNITURE',
      condition: 'LIGHT WEAR',
      faultDescription: 'Armrest minor scuffing; pneumatic strut firm',
      ageYears: 3
    }),
    events: [
      {
        id: 'evt-chair-1',
        eventType: 'REGISTERED',
        title: 'Asset Onboarded',
        description: 'Surplus item registered for community exchange.',
        timestamp: '28 Sep 2026',
        operatorOrOwner: 'Facilities Team',
        location: 'Building 4',
        verified: true
      },
      {
        id: 'evt-chair-2',
        eventType: 'CONDITION ASSESSED',
        title: 'Structural Load Check',
        description: 'Hydraulic pressure test passed at 140kg limit. Mesh tension intact.',
        timestamp: '04 Oct 2026',
        operatorOrOwner: 'Inspector',
        location: 'Logistics Bay',
        verified: true
      }
    ]
  },
  {
    id: 'LOOP-9X4F82',
    name: '18V Brushless Cordless Drill',
    category: 'TOOLS',
    brand: 'DeWalt Industrial',
    modelNumber: 'DCD791',
    manufactureYear: 2024,
    originalPriceUsd: 199,
    currentCondition: 'MINOR FAULT',
    status: 'IN REPAIR',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    createdAt: '15 Sep 2026',
    updatedAt: '05 Oct 2026',
    ownerName: 'MakerSpace Tool Library',
    ownerLocation: 'Workshop East',
    serialNumber: 'SN-DW-558291',
    analysis: evaluateCircularity({
      name: '18V Brushless Cordless Drill',
      category: 'TOOLS',
      condition: 'MINOR FAULT',
      faultDescription: 'Chuck wobbles; motor coils healthy',
      ageYears: 2
    }),
    events: [
      {
        id: 'evt-tool-1',
        eventType: 'REGISTERED',
        title: 'Tool Library Check-in',
        description: 'Donated by carpentry collective for community loaning.',
        timestamp: '15 Sep 2026',
        operatorOrOwner: 'Tool Warden',
        location: 'Tool Barn',
        verified: true
      },
      {
        id: 'evt-tool-2',
        eventType: 'REPAIR',
        title: 'Keyless Chuck Re-alignment',
        description: 'Bearings cleaned and lubricated with silicone grease.',
        timestamp: '05 Oct 2026',
        operatorOrOwner: 'Marcus Vance',
        location: 'Bench 04',
        verified: true
      }
    ]
  },
  {
    id: 'LOOP-2M8K11',
    name: 'Vintage Selvedge Denim Jacket',
    category: 'TEXTILES',
    brand: "Levi's 1953 Type II Reissue",
    modelNumber: 'TX-DENIM-53',
    manufactureYear: 2022,
    originalPriceUsd: 180,
    currentCondition: 'LIGHT WEAR',
    status: 'ACTIVE / IN USE',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    createdAt: '20 Aug 2026',
    updatedAt: '02 Oct 2026',
    ownerName: 'Kavita Sharma',
    ownerLocation: 'Westside Campus',
    analysis: evaluateCircularity({
      name: 'Vintage Selvedge Denim Jacket',
      category: 'TEXTILES',
      condition: 'LIGHT WEAR',
      faultDescription: 'Pocket rivet patina; 100% heavy cotton selvedge',
      ageYears: 4
    }),
    events: [
      {
        id: 'evt-tex-1',
        eventType: 'REGISTERED',
        title: 'Garment Passport Created',
        description: 'Organic selvedge denim logged for lifetime repair record.',
        timestamp: '20 Aug 2026',
        operatorOrOwner: 'Fashion Collective',
        location: 'Atelier Central',
        verified: true
      }
    ]
  },
  {
    id: 'LOOP-5T2P66',
    name: 'Compact Pump Espresso Machine',
    category: 'APPLIANCES',
    brand: 'DeLonghi Dedica Deluxe',
    modelNumber: 'EC680M',
    manufactureYear: 2023,
    originalPriceUsd: 299,
    currentCondition: 'MINOR FAULT',
    status: 'ACTIVE / IN USE',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    createdAt: '02 Sep 2026',
    updatedAt: '05 Oct 2026',
    ownerName: 'Café Nomad Cooperative',
    ownerLocation: 'North Hall',
    analysis: evaluateCircularity({
      name: 'Compact Pump Espresso Machine',
      category: 'APPLIANCES',
      condition: 'MINOR FAULT',
      faultDescription: 'Steam valve mineral blockage; 15-bar pump operating normally',
      ageYears: 3
    }),
    events: [
      {
        id: 'evt-esp-1',
        eventType: 'REGISTERED',
        title: 'Asset Registration',
        description: 'Compact boiler system registered for community cafe.',
        timestamp: '02 Sep 2026',
        operatorOrOwner: 'Barista Union',
        location: 'Co-op Kitchen',
        verified: true
      },
      {
        id: 'evt-esp-2',
        eventType: 'REPAIR',
        title: 'Descaling & Gasket Refresh',
        description: 'Citric flush completed; high-temperature gasket installed.',
        timestamp: '05 Oct 2026',
        operatorOrOwner: 'Taro Takahashi',
        location: 'Bench 01',
        verified: true
      }
    ]
  }
];

export const SEED_EXCHANGE: ExchangeListing[] = [
  {
    id: 'ex-01',
    passportId: 'LOOP-3B9R14',
    title: 'Ergonomic Task Chair V2',
    category: 'FURNITURE',
    condition: 'Light wear, fully functional',
    location: 'District 4 Creative Hub',
    priceType: 'FREE / DONATION',
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-73ab013f33d7?w=600&auto=format&fit=crop&q=80',
    description: 'Surplus chair from studio downsizing. Mesh clean and tight. Pick up in lobby or exchange for standing desk converter.',
    contactEmail: 'studio-circular@loopledger.local',
    status: 'AVAILABLE',
    listedDate: '04 Oct 2026'
  },
  {
    id: 'ex-02',
    passportId: 'LOOP-7K3M92',
    title: 'School Tablet 10.1" (Port Serviced)',
    category: 'ELECTRONICS',
    condition: 'Repaired & certified',
    location: 'St. Jude Robotics Lab',
    priceType: 'COMMUNITY PRICE',
    priceUsd: 45,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    description: 'Fully reconditioned tablet running clean Android OS. Ideal for student coding or reading. Comes with charger.',
    contactEmail: 'robotics@stjude.edu',
    status: 'AVAILABLE',
    listedDate: '06 Oct 2026'
  },
  {
    id: 'ex-03',
    passportId: 'LOOP-9X4F82',
    title: '18V Brushless Cordless Drill',
    category: 'TOOLS',
    condition: 'Serviced chuck',
    location: 'Workshop East Tool Bay',
    priceType: 'EXCHANGE / TRADE',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy duty drill with freshly lubricated chuck. Looking to trade for wood clamps or jigsaw.',
    contactEmail: 'marcus@makerspace.org',
    status: 'AVAILABLE',
    listedDate: '05 Oct 2026'
  },
  {
    id: 'ex-04',
    passportId: 'LOOP-2M8K11',
    title: 'Vintage Selvedge Heavy Denim Jacket (Size M)',
    category: 'TEXTILES',
    condition: 'Natural patina, excellent',
    location: 'Westside Campus Locker B',
    priceType: 'EXCHANGE / TRADE',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy 14oz shuttle-loom denim. Swap for size L overshirt or camera strap.',
    contactEmail: 'kavita@campus.edu',
    status: 'AVAILABLE',
    listedDate: '02 Oct 2026'
  }
];

export function getStoredPassports(): ProductPassport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PASSPORTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  savePassports(SEED_PASSPORTS);
  return SEED_PASSPORTS;
}

export function savePassports(passports: ProductPassport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PASSPORTS, JSON.stringify(passports));
  } catch {}
}

export function getStoredExchangeListings(): ExchangeListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXCHANGE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  saveExchangeListings(SEED_EXCHANGE);
  return SEED_EXCHANGE;
}

export function saveExchangeListings(listings: ExchangeListing[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_EXCHANGE, JSON.stringify(listings));
  } catch {}
}

export function calculateAggregatedImpact(passports: ProductPassport[]): ImpactMetrics {
  let totalWasteAvoidedKg = 0;
  let totalLifecycleExtensions = 0;
  let totalEmbodiedCarbonSavedKgCO2 = 0;
  let totalEconomicValueRetainedUsd = 0;
  let repairedCount = 0;
  let transferredCount = 0;
  let partsHarvestedCount = 0;
  let recycledCount = 0;

  for (const p of passports) {
    totalWasteAvoidedKg += p.analysis.wasteAvoidedKg || 3.5;
    totalEmbodiedCarbonSavedKgCO2 += p.analysis.carbonDebtAvoidedKgCO2 || 35.0;
    totalEconomicValueRetainedUsd += p.analysis.estimatedResidualValueUsd || 80.0;
    
    const eventCount = p.events ? p.events.length : 1;
    totalLifecycleExtensions += Math.max(1, eventCount - 1);

    p.events.forEach(evt => {
      if (evt.eventType === 'REPAIR') repairedCount++;
      if (evt.eventType === 'TRANSFER') transferredCount++;
      if (evt.eventType === 'PARTS HARVESTED') partsHarvestedCount++;
      if (evt.eventType === 'RECYCLED') recycledCount++;
    });
  }

  return {
    totalItemsDiverted: passports.length,
    totalWasteAvoidedKg: Math.round(totalWasteAvoidedKg * 10) / 10,
    totalLifecycleExtensions,
    totalEmbodiedCarbonSavedKgCO2: Math.round(totalEmbodiedCarbonSavedKgCO2),
    totalEconomicValueRetainedUsd: Math.round(totalEconomicValueRetainedUsd),
    repairedCount,
    transferredCount,
    partsHarvestedCount,
    recycledCount
  };
}

export function resetToSeedData(): void {
  savePassports(SEED_PASSPORTS);
  saveExchangeListings(SEED_EXCHANGE);
}
