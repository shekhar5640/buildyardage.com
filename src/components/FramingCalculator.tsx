import React, { useState, useMemo } from 'react';
import { calculateFraming, type FramingResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';
import DimensionInput from './DimensionInput';
import { getTranslations, getLocaleFromUrl, type SupportedLocale } from '../i18n/utils';

interface FramingProps {
  initialWallLength?: number;
  initialStudSpacing?: number;
  initialIsMetric?: boolean;
  locale?: string;
  isEmbed?: boolean;
}

export default function FramingCalculator({
  initialWallLength = 50,
  initialStudSpacing = 16,
  initialIsMetric = false,
  locale,
  isEmbed = false
}: FramingProps) {
  const activeLocale = (locale || (typeof window !== 'undefined' ? getLocaleFromUrl(window.location.pathname) : 'en')) as SupportedLocale;
  const t = getTranslations(activeLocale);

  const [length, setLength] = useState<number>(initialWallLength); // wall length
  const [studSpacing, setStudSpacing] = useState<number>(initialStudSpacing);
  const [corners, setCorners] = useState<number>(0);
  const [cornerType, setCornerType] = useState<'3-stud' | '2-stud'>('3-stud');
  const [doorCount, setDoorCount] = useState<number>(0);
  const [doorWidth, setDoorWidth] = useState<number>(36);
  const [windowCount, setWindowCount] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(48);
  const [topPlates, setTopPlates] = useState<number>(2);
  const [bottomPlates, setBottomPlates] = useState<number>(1);
  const [waste, setWaste] = useState<number>(10);
  const [isMetric, setIsMetric] = useState<boolean>(initialIsMetric);
  const [priceInput, setPriceInput] = useState<string>("");

  const pricePerUnit = useMemo(() => parseFloat(priceInput) || 0, [priceInput]);

  const results = useMemo(() => {
    const res = calculateFraming(length, studSpacing, corners, topPlates, bottomPlates, waste, isMetric, cornerType, doorCount, doorWidth, windowCount, windowWidth);
    if (pricePerUnit > 0) {
      const totalPieces = res.studsCount + res.topPlates16ft + res.bottomPlates16ft;
      res.estimatedCost = parseFloat((totalPieces * pricePerUnit).toFixed(2));
    } else {
      res.estimatedCost = undefined;
    }
    return res;
  }, [length, studSpacing, corners, topPlates, bottomPlates, waste, isMetric, cornerType, doorCount, doorWidth, windowCount, windowWidth, pricePerUnit]);

  const handleRestore = (inputs: Record<string, any>, metric: boolean) => {
    setIsMetric(metric);
    if (inputs.length !== undefined) setLength(inputs.length);
    if (inputs.studSpacing !== undefined) setStudSpacing(inputs.studSpacing);
    if (inputs.corners !== undefined) setCorners(inputs.corners);
    if (inputs.cornerType !== undefined) setCornerType(inputs.cornerType);
    if (inputs.doorCount !== undefined) setDoorCount(inputs.doorCount);
    if (inputs.doorWidth !== undefined) setDoorWidth(inputs.doorWidth);
    if (inputs.windowCount !== undefined) setWindowCount(inputs.windowCount);
    if (inputs.windowWidth !== undefined) setWindowWidth(inputs.windowWidth);
  };

  const handleAdd = (): ShoppingItem => {
    const lUnit = isMetric ? "m" : "ft";
    const itemTitle = `${t.nav.framing} (${length}${lUnit} Wall @ ${studSpacing}" OC)`;
    const itemDetails = `${results.studsCount} studs + ${results.topPlates16ft + results.bottomPlates16ft} plates (16ft)`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'framing-calculator',
      title: itemTitle,
      material: 'Lumber',
      shape: 'Wall',
      type: 'framing',
      details: itemDetails,
      checked: true,
      inputs: { length, studSpacing, corners, cornerType, doorCount, doorWidth, windowCount, windowWidth, topPlates, bottomPlates, waste, pricePerUnit },
      outputs: results,
      isMetric,
      unitPrice: pricePerUnit > 0 ? pricePerUnit : undefined,
      estimatedCost: results.estimatedCost
    };

    return newItem;
  };

  return (
    <CalculatorShell
      type="framing"
      material="Lumber"
      shape="Wall"
      slug="framing-calculator"
      locale={activeLocale}
      isMetric={isMetric}
      setIsMetric={setIsMetric}
      waste={waste}
      setWaste={setWaste}
      priceInput={priceInput}
      setPriceInput={setPriceInput}
      pricePerUnit={pricePerUnit}
      results={results}
      onAdd={handleAdd}
      onRestore={handleRestore}
      isEmbed={isEmbed}
      renderVisualizer={() => (
        <svg viewBox="0 0 300 180" className="w-full max-h-[180px]">
          <rect x="30" y="30" width="240" height="120" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
          <line x1="30" y1="42" x2="270" y2="42" stroke="var(--color-ink)" strokeWidth="2" />
          <line x1="30" y1="138" x2="270" y2="138" stroke="var(--color-ink)" strokeWidth="2" />
          <line x1="80" y1="42" x2="80" y2="138" stroke="var(--color-brand-accent)" strokeWidth="2" />
          <line x1="130" y1="42" x2="130" y2="138" stroke="var(--color-brand-accent)" strokeWidth="2" />
          <line x1="180" y1="42" x2="180" y2="138" stroke="var(--color-brand-accent)" strokeWidth="2" />
          <line x1="230" y1="42" x2="230" y2="138" stroke="var(--color-brand-accent)" strokeWidth="2" />
          <text x="150" y="20" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">
            {length} {isMetric ? 'm' : 'ft'} Wall Length
          </text>
        </svg>
      )}
      renderOutputs={() => (
        <>
          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-body font-medium">{t.calculator.studsNeeded}</span>
            <span className="text-2xl font-mono font-extrabold text-brand-accent">
              {results.studsCount} <span className="text-sm font-medium text-ink">pcs</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">{t.calculator.topPlates} (16ft)</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.topPlates16ft} <span className="text-xs font-normal text-muted">pcs</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">{t.calculator.solePlates} (16ft)</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.bottomPlates16ft} <span className="text-xs font-normal text-muted">pcs</span>
            </span>
          </div>
        </>
      )}
    >
      {/* Wall Length */}
      <DimensionInput 
        label={t.calculator.length}
        value={length}
        onChange={setLength}
        isMetric={isMetric}
        metricUnit="m"
        imperialUnit="ft"
        max={isMetric ? 60 : 200}
        step={1}
      />

      {/* Stud Spacing */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-ink uppercase tracking-wider">{t.calculator.spacing}</label>
        <select
          value={studSpacing}
          onChange={(e) => setStudSpacing(parseInt(e.target.value))}
          className="w-full px-3 py-2 text-sm font-medium border border-hairline rounded bg-canvas text-ink focus:outline-none focus:border-brand-accent cursor-pointer"
        >
          <option value={16}>16 inches On-Center (Standard)</option>
          <option value={24}>24 inches On-Center (Advanced)</option>
          <option value={12}>12 inches On-Center (Heavy)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-hairline pt-4">
        {/* Corners */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider">{t.calculator.corners || 'Corners / T-Intersects'}</label>
            <input 
              type="number"
              min="0"
              value={corners}
              onChange={(e) => setCorners(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono border border-hairline rounded bg-canvas text-ink focus:outline-none focus:border-brand-accent"
            />
        </div>
        
        {/* Corner Type */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider">{t.calculator.cornerType || 'Corner Type'}</label>
          <select
            value={cornerType}
            onChange={(e) => setCornerType(e.target.value as '3-stud' | '2-stud')}
            className="w-full px-3 py-2 text-sm font-medium border border-hairline rounded bg-canvas text-ink focus:outline-none focus:border-brand-accent cursor-pointer"
          >
            <option value="3-stud">{t.calculator.cornerType3 || '3-Stud (Conventional)'}</option>
            <option value="2-stud">{t.calculator.cornerType2 || '2-Stud (California)'}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-hairline pt-4">
        {/* Doors */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider">{t.calculator.doors || 'Doors'}</label>
            <input 
              type="number"
              min="0"
              value={doorCount}
              onChange={(e) => setDoorCount(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono border border-hairline rounded bg-canvas text-ink focus:outline-none focus:border-brand-accent"
            />
        </div>
        
        {/* Door Width */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider">{t.calculator.doorWidth || 'Avg Door Width (in)'}</label>
            <input 
              type="number"
              min="0"
              value={doorWidth}
              onChange={(e) => setDoorWidth(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono border border-hairline rounded bg-canvas text-ink focus:outline-none focus:border-brand-accent"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-hairline pt-4">
        {/* Windows */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider">{t.calculator.windows || 'Windows'}</label>
            <input 
              type="number"
              min="0"
              value={windowCount}
              onChange={(e) => setWindowCount(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono border border-hairline rounded bg-canvas text-ink focus:outline-none focus:border-brand-accent"
            />
        </div>
        
        {/* Window Width */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider">{t.calculator.windowWidth || 'Avg Window Width (in)'}</label>
            <input 
              type="number"
              min="0"
              value={windowWidth}
              onChange={(e) => setWindowWidth(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono border border-hairline rounded bg-canvas text-ink focus:outline-none focus:border-brand-accent"
            />
        </div>
      </div>
    </CalculatorShell>
  );
}
