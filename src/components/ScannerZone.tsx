import React, { useState, useRef, useEffect } from 'react';
import { analyzeItemWithServer, ServerDetectedItem } from '../services/gemini';
import { evaluateCircularity } from '../services/circularityEngine';
import { EngineDecisionTrace } from './EngineDecisionTrace';
import { ProductPassport, CategoryType, CircularityEngineResult } from '../types';
import { 
  Camera, 
  UploadCloud, 
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Edit3,
  ShieldCheck
} from 'lucide-react';
import { 
  playClickSound, 
  playScanLaserSound, 
  playPassportMintSound 
} from '../services/audio';

interface ScannerZoneProps {
  onPassportCreated: (newPassport: ProductPassport) => void;
  onNavigateToPassport?: (passportId: string) => void;
  autoLoadPreset?: string;
}

interface SampleItem {
  id: string;
  name: string;
  category: CategoryType;
  condition: 'PRISTINE' | 'LIGHT WEAR' | 'MINOR FAULT' | 'HEAVILY DAMAGED' | 'PARTS ONLY';
  brand: string;
  imageUrl: string;
  notes: string;
}

const PRIMARY_DEMO_ITEMS: SampleItem[] = [
  {
    id: 'tablet',
    name: 'School Tablet 10.1"',
    category: 'ELECTRONICS',
    condition: 'MINOR FAULT',
    brand: 'Lenovo / EduTab',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    notes: 'Loose charging port, screen powers on normally'
  },
  {
    id: 'chair',
    name: 'Ergonomic Task Chair',
    category: 'FURNITURE',
    condition: 'LIGHT WEAR',
    brand: 'Steelcase',
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-73ab013f33d7?w=600&auto=format&fit=crop&q=80',
    notes: 'Mesh clean and tight, pneumatic strut works'
  },
  {
    id: 'drill',
    name: '18V Cordless Drill',
    category: 'TOOLS',
    condition: 'MINOR FAULT',
    brand: 'DeWalt',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    notes: 'Keyless chuck slightly loose, motor runs strong'
  },
  {
    id: 'jacket',
    name: 'Selvedge Denim Jacket',
    category: 'TEXTILES',
    condition: 'LIGHT WEAR',
    brand: "Levi's",
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    notes: 'Heavy organic cotton denim, light seam wear'
  }
];

const MORE_DEMO_ITEMS: SampleItem[] = [
  {
    id: 'espresso',
    name: 'Compact Espresso Machine',
    category: 'APPLIANCES',
    condition: 'MINOR FAULT',
    brand: 'DeLonghi',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    notes: 'Steam wand mineral scale, pump runs well'
  },
  {
    id: 'textbook',
    name: 'Engineering Textbook',
    category: 'BOOKS',
    condition: 'PRISTINE',
    brand: 'MIT Press',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    notes: 'Clean pages, binding solid'
  }
];

export const ScannerZone: React.FC<ScannerZoneProps> = ({
  onPassportCreated,
  onNavigateToPassport,
  autoLoadPreset
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showMoreExamples, setShowMoreExamples] = useState(false);

  // Editable confirmation form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('ELECTRONICS');
  const [formCondition, setFormCondition] = useState<'PRISTINE' | 'LIGHT WEAR' | 'MINOR FAULT' | 'HEAVILY DAMAGED' | 'PARTS ONLY'>('MINOR FAULT');
  const [formBrand, setFormBrand] = useState('Standard Model');
  const [formFault, setFormFault] = useState('');
  const [formConfidence, setFormConfidence] = useState<number | null>(null);
  const [formAgeYears, setFormAgeYears] = useState(2);

  const [hasDetected, setHasDetected] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Calculated Engine Output
  const [engineResult, setEngineResult] = useState<CircularityEngineResult | null>(null);
  const [createdPassport, setCreatedPassport] = useState<ProductPassport | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoLoadPreset) {
      const target = [...PRIMARY_DEMO_ITEMS, ...MORE_DEMO_ITEMS].find(i => i.id === autoLoadPreset) || PRIMARY_DEMO_ITEMS[0];
      handleSelectPreset(target);
    }
  }, [autoLoadPreset]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playClickSound();
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
        runScanPipeline(base64, userNotes);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (sample: typeof PRIMARY_DEMO_ITEMS[0]) => {
    playClickSound();
    setSelectedImage(sample.imageUrl);
    setUserNotes(sample.notes);

    // Pre-populate confirmation form for demo items
    setFormName(sample.name);
    setFormCategory(sample.category);
    setFormCondition(sample.condition);
    setFormBrand(sample.brand);
    setFormFault(sample.notes);
    setFormConfidence(94);
    setFormAgeYears(2);
    setHasDetected(true);
    setScanError(null);
    setIsConfirmed(false);
    setEngineResult(null);
    setCreatedPassport(null);
  };

  const runScanPipeline = async (imgBase64: string, notes?: string) => {
    setIsScanning(true);
    setScanError(null);
    setHasDetected(false);
    setIsConfirmed(false);
    setEngineResult(null);
    setCreatedPassport(null);
    playScanLaserSound();

    try {
      // Call server endpoint securely
      const detected = await analyzeItemWithServer(imgBase64, notes);
      setFormName(detected.detectedName);
      setFormCategory(detected.category);
      setFormCondition(detected.condition);
      setFormBrand(detected.detectedBrand);
      setFormFault(detected.detectedFault);
      setFormConfidence(detected.confidence);
      setFormAgeYears(detected.estimatedAgeYears || 2);
      setHasDetected(true);
    } catch (err: any) {
      // Friendly error handling without faking AI
      setScanError(err.message || 'AI analysis is currently unavailable. You can enter or edit the product details manually.');
      // Pre-fill default manual entries while preserving image
      setFormName('Inspected Product');
      setFormCategory('ELECTRONICS');
      setFormCondition('MINOR FAULT');
      setFormBrand('Standard Model');
      setFormFault(notes || 'Manual condition review');
      setFormConfidence(null);
      setFormAgeYears(2);
      setHasDetected(true);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmAndCalculate = () => {
    playClickSound();
    if (!formName.trim()) return;

    // Execute deterministic Circularity Engine ONLY with confirmed attributes
    const result = evaluateCircularity({
      name: formName.trim(),
      category: formCategory,
      condition: formCondition,
      faultDescription: formFault,
      ageYears: formAgeYears
    });

    setEngineResult(result);
    setIsConfirmed(true);
  };

  const handleMintPassport = () => {
    if (!engineResult) return;
    setIsMinting(true);
    playPassportMintSound();

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const passportId = `LOOP-${randomSuffix}92`;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newPassport: ProductPassport = {
      id: passportId,
      name: formName.trim(),
      category: formCategory,
      brand: formBrand || 'Standard Model',
      currentCondition: formCondition,
      status: engineResult.primaryAction === 'REPAIR' ? 'IN REPAIR' : 'ACTIVE / IN USE',
      imageUrl: selectedImage || PRIMARY_DEMO_ITEMS[0].imageUrl,
      createdAt: today,
      updatedAt: today,
      ownerName: 'Community Intake Hub',
      ownerLocation: 'Regional District',
      analysis: engineResult,
      events: [
        {
          id: `evt-init-${Date.now()}`,
          eventType: 'REGISTERED',
          title: 'Initial Digital Passport Created',
          description: `Product registered with confirmed condition rating. Circularity score: ${engineResult.circularityScore}/100. Primary life path: ${engineResult.primaryAction}.`,
          timestamp: today,
          operatorOrOwner: 'Intake Inspector',
          location: 'Station 1',
          verified: true
        }
      ]
    };

    setTimeout(() => {
      onPassportCreated(newPassport);
      setCreatedPassport(newPassport);
      setIsMinting(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* Editorial Page Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-4 border-b-2 border-[#121212]">
        <div className="lg:col-span-8">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#121212] leading-[0.95] uppercase">
            SCAN<br />
            WHAT'S<br />
            LEFT.
          </h1>
        </div>

        <div className="lg:col-span-4 bg-white border-2 border-[#121212] p-5 brutal-shadow-sm space-y-2">
          <div className="font-grotesk font-bold text-sm text-[#121212]">
            Identify the product.
          </div>
          <div className="font-grotesk font-bold text-sm text-[#121212]">
            Assess its condition.
          </div>
          <div className="font-grotesk font-bold text-sm text-[#0F3822]">
            Find its best next life.
          </div>
        </div>
      </div>

      {/* Demo Preset Item Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-grotesk font-bold text-sm text-[#121212] uppercase tracking-tight">
            Try a demo item:
          </span>
          <button
            onClick={() => setShowMoreExamples(!showMoreExamples)}
            className="text-xs font-semibold text-[#121212] hover:underline flex items-center gap-1"
          >
            <span>{showMoreExamples ? 'Fewer examples' : 'More examples'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreExamples ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRIMARY_DEMO_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectPreset(item)}
              className="p-3 bg-white hover:bg-[#CCFF00] border-2 border-[#121212] text-left brutal-shadow-sm brutal-btn flex flex-col justify-between h-20 transition-all"
            >
              <span className="font-grotesk font-bold text-sm text-[#121212] leading-tight">
                {item.name}
              </span>
              <span className="text-[11px] text-[#555555] font-medium">
                {item.category.toLowerCase()} →
              </span>
            </button>
          ))}
        </div>

        {showMoreExamples && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {MORE_DEMO_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectPreset(item)}
                className="p-3 bg-[#FAF8F5] hover:bg-[#CCFF00] border-2 border-[#121212] text-left brutal-shadow-sm brutal-btn flex flex-col justify-between h-20"
              >
                <span className="font-grotesk font-bold text-sm text-[#121212] leading-tight">
                  {item.name}
                </span>
                <span className="text-[11px] text-[#555555]">
                  {item.category.toLowerCase()} →
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Column Scanner & Confirmation Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Image Area */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#FAF8F5] border-2 border-[#121212] p-6 sm:p-7 brutal-shadow space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-black text-[#121212] uppercase">
                  Scan an Item
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#CCFF00] border border-[#121212]">
                  {isScanning ? 'Analyzing item...' : 'Ready to Scan'}
                </span>
              </div>
              <p className="text-xs text-[#555555] mt-1">
                Upload a photo or choose a demo item above.
              </p>
            </div>

            {/* Drop Zone */}
            <div className="relative border-2 border-[#121212] bg-white aspect-4/3 flex flex-col items-center justify-center p-6 text-center overflow-hidden group">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Scanned product"
                    className="w-full h-full object-cover"
                  />
                  {isScanning && (
                    <div className="absolute left-0 right-0 h-0.5 bg-[#CCFF00] shadow-[0_0_8px_#CCFF00] animate-scan-subtle z-20" />
                  )}
                </>
              ) : (
                <div className="space-y-4 max-w-xs">
                  <div className="w-14 h-14 mx-auto bg-[#EFECE4] border-2 border-[#121212] flex items-center justify-center brutal-shadow-sm">
                    <Camera className="w-6 h-6 text-[#121212]" />
                  </div>

                  <div>
                    <div className="font-grotesk text-base font-black text-[#121212]">
                      Drop an image here
                    </div>
                    <div className="text-xs text-[#71717A] mt-0.5">
                      JPEG or PNG image
                    </div>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#CCFF00] text-[#121212] border-2 border-[#121212] font-grotesk text-xs font-bold uppercase brutal-shadow-sm brutal-btn inline-flex items-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Choose Image</span>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Notes Input */}
            <div className="space-y-2 pt-2 border-t border-[#121212]">
              <label className="block text-xs font-bold text-[#121212]">
                Additional notes or observed faults:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Broken screen, won't turn on..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="flex-1 p-2 bg-white border-2 border-[#121212] text-xs placeholder:text-[#71717A]"
                />
                <button
                  onClick={() => {
                    if (selectedImage) runScanPipeline(selectedImage, userNotes);
                    else handleSelectPreset(PRIMARY_DEMO_ITEMS[0]);
                  }}
                  disabled={isScanning}
                  className="px-4 py-2 bg-[#121212] text-[#CCFF00] font-grotesk text-xs font-bold uppercase border-2 border-[#121212] hover:bg-[#CCFF00] hover:text-[#121212] transition-colors"
                >
                  {isScanning ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </div>

            {/* Loading Indicator */}
            {isScanning && (
              <div className="p-3.5 bg-[#121212] text-[#CCFF00] border-2 border-[#121212] text-xs font-semibold flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#CCFF00]" />
                <span>Analyzing item...</span>
              </div>
            )}

            {/* Scan Error Message */}
            {scanError && (
              <div className="p-3.5 bg-amber-50 text-amber-900 border-2 border-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">AI Analysis Note</div>
                  <div>{scanError}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detected Details Confirmation & Engine Results */}
        <div className="lg:col-span-6 space-y-6">
          {hasDetected ? (
            <div className="space-y-6">
              {/* Step 1: Editable Confirmation Form */}
              <div className="bg-white border-2 border-[#121212] p-5 brutal-shadow space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#121212] pb-3">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#121212]" />
                    <h3 className="font-display font-black text-lg text-[#121212] uppercase">
                      Confirm Detected Details
                    </h3>
                  </div>

                  {formConfidence !== null && (
                    <span className="text-[11px] font-mono font-bold bg-[#CCFF00] px-2 py-0.5 border border-[#121212]">
                      AI Confidence: {formConfidence}%
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#121212] uppercase mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full p-2 bg-[#FAF8F5] border-2 border-[#121212] font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#121212] uppercase mb-1">
                        Category
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                        className="w-full p-2 bg-[#FAF8F5] border-2 border-[#121212] font-bold"
                      >
                        <option value="ELECTRONICS">Tech / Electronics</option>
                        <option value="FURNITURE">Furniture</option>
                        <option value="TEXTILES">Clothing / Textiles</option>
                        <option value="TOOLS">Tools</option>
                        <option value="BOOKS">Books</option>
                        <option value="APPLIANCES">Appliances</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#121212] uppercase mb-1">
                        Condition Rating
                      </label>
                      <select
                        value={formCondition}
                        onChange={(e) => setFormCondition(e.target.value as any)}
                        className="w-full p-2 bg-[#FAF8F5] border-2 border-[#121212] font-bold"
                      >
                        <option value="PRISTINE">Pristine / Like New</option>
                        <option value="LIGHT WEAR">Light Wear</option>
                        <option value="MINOR FAULT">Minor Fault</option>
                        <option value="HEAVILY DAMAGED">Heavily Damaged</option>
                        <option value="PARTS ONLY">Parts Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#121212] uppercase mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        className="w-full p-2 bg-[#FAF8F5] border-2 border-[#121212]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#121212] uppercase mb-1">
                        Estimated Age (Years)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={formAgeYears}
                        onChange={(e) => setFormAgeYears(Number(e.target.value) || 1)}
                        className="w-full p-2 bg-[#FAF8F5] border-2 border-[#121212] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#121212] uppercase mb-1">
                      Observed Damage or Faults
                    </label>
                    <input
                      type="text"
                      value={formFault}
                      onChange={(e) => setFormFault(e.target.value)}
                      className="w-full p-2 bg-[#FAF8F5] border-2 border-[#121212]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleConfirmAndCalculate}
                  className="w-full py-3 bg-[#121212] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-[#121212] border-2 border-[#121212] font-grotesk text-xs font-black uppercase tracking-wider transition-colors brutal-shadow-sm"
                >
                  Confirm Details & Calculate Circularity →
                </button>
              </div>

              {/* Step 2: Deterministic Engine Output (Rendered after confirmation) */}
              {isConfirmed && engineResult && (
                <div className="space-y-6">
                  {/* Score & Next Best Action Panel */}
                  <div className="bg-[#CCFF00] border-2 border-[#121212] p-6 brutal-shadow-lg grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 text-center border-r-2 border-[#121212] pr-4">
                      <div className="font-display text-6xl font-black text-[#121212] leading-none">
                        {engineResult.circularityScore}
                      </div>
                      <div className="font-grotesk font-bold text-sm text-[#121212]">
                        out of 100
                      </div>
                      <div className="text-[11px] font-bold uppercase tracking-tight text-[#121212] mt-1">
                        Circularity Score
                      </div>
                    </div>

                    <div className="col-span-7 space-y-1 pl-2">
                      <div className="text-xs font-bold text-[#121212] uppercase tracking-wider">
                        Next Best Action
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-black text-[#121212] leading-tight uppercase">
                        {engineResult.primaryAction} FIRST →
                      </div>
                      <p className="text-xs text-[#121212] font-medium leading-tight">
                        Calculated by deterministic LCA model. Preserves maximum embodied energy.
                      </p>
                    </div>
                  </div>

                  {/* Action Hierarchy */}
                  <div className="bg-white border-2 border-[#121212] p-5 brutal-shadow space-y-3">
                    <div className="text-xs font-bold text-[#121212] uppercase pb-2 border-b border-[#121212] flex items-center justify-between">
                      <span>Action Hierarchy Ranking</span>
                      <span className="text-xs text-[#71717A]">Score</span>
                    </div>

                    <div className="space-y-2.5">
                      {engineResult.rankedActions.slice(0, 4).map((action) => (
                        <div key={action.rank} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[#71717A]">{action.rank}</span>
                              <span className="font-bold text-[#121212]">{action.action}</span>
                              {action.isPrimary && (
                                <span className="px-1.5 py-0.2 bg-[#CCFF00] border border-[#121212] text-[10px] font-black">
                                  Best Path
                                </span>
                              )}
                            </div>
                            <span className="font-mono font-bold">{action.score}</span>
                          </div>

                          <div className="w-full bg-[#EFECE4] h-2.5 border border-[#121212]">
                            <div
                              className={`h-full ${action.isPrimary ? 'bg-[#121212]' : 'bg-[#71717A]'}`}
                              style={{ width: `${action.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decision Trace Component */}
                  <EngineDecisionTrace analysis={engineResult} />

                  {/* Passport Action */}
                  <div className="p-5 bg-white border-2 border-[#121212] brutal-shadow space-y-3">
                    <p className="text-xs text-[#333333]">
                      Transform this confirmed evaluation into an official <strong>Digital Product Passport</strong>:
                    </p>

                    <button
                      onClick={handleMintPassport}
                      disabled={isMinting || !!createdPassport}
                      className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#b8e600] text-[#121212] border-2 border-[#121212] font-grotesk text-sm font-black uppercase tracking-wider brutal-shadow brutal-btn flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>
                        {createdPassport
                          ? `Passport Created (${createdPassport.id})`
                          : isMinting
                          ? 'Creating Passport...'
                          : 'Create Digital Product Passport →'}
                      </span>
                    </button>

                    {createdPassport && onNavigateToPassport && (
                      <button
                        onClick={() => onNavigateToPassport(createdPassport.id)}
                        className="w-full py-2 bg-[#FFE600] text-[#121212] border-2 border-[#121212] font-grotesk text-xs font-bold uppercase brutal-shadow-sm brutal-btn text-center"
                      >
                        View Passport & QR Code →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Warm empty state */
            <div className="bg-white border-2 border-[#121212] p-8 brutal-shadow text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-[#CCFF00] border-2 border-[#121212] flex items-center justify-center font-display font-black text-xl">
                ✦
              </div>
              <h3 className="font-display text-2xl font-black text-[#121212]">
                Ready when you are.
              </h3>
              <p className="text-xs text-[#555555] max-w-sm mx-auto leading-relaxed">
                Add a product and LoopLedger will help find its best next life.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
