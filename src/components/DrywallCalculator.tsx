import React, { useState, useMemo } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { calculateDrywall, type DrywallResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';
import { getTranslations, getLocaleFromUrl, type SupportedLocale } from '../i18n/utils';

interface DrywallProps {
  initialLength?: number;
  initialWidth?: number;
  initialHeight?: number;
  initialIsMetric?: boolean;
  locale?: string;
}

export default function DrywallCalculator({
  initialLength = 12,
  initialWidth = 10,
  initialHeight = 8,
  initialIsMetric = false,
  locale
}: DrywallProps) {
  const activeLocale = (locale || (typeof window !== 'undefined' ? getLocaleFromUrl(window.location.pathname) : 'en')) as SupportedLocale;
  const t = getTranslations(activeLocale);

  const [length, setLength] = useState<number>(initialLength); // room length
  const [drywallWidth, setDrywallWidth] = useState<number>(initialWidth); // room width
  const [thickness, setThickness] = useState<number>(initialHeight); // wall height
  const [waste, setWaste] = useState<number>(10);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [sheetSize, setSheetSize] = useState<string>('4x8');
  const [isMetric, setIsMetric] = useState<boolean>(initialIsMetric);
  const [priceInput, setPriceInput] = useState<string>("");

  const pricePerUnit = useMemo(() => parseFloat(priceInput) || 0, [priceInput]);

  const results = useMemo(() => {
    const res = calculateDrywall(length, drywallWidth, thickness, includeCeiling, sheetSize, waste, isMetric);
    if (pricePerUnit > 0) {
      res.estimatedCost = parseFloat((res.sheetsNeeded * pricePerUnit).toFixed(2));
    } else {
      res.estimatedCost = undefined;
    }
    return res;
  }, [length, drywallWidth, thickness, includeCeiling, sheetSize, waste, isMetric, pricePerUnit]);

  const handleRestore = (inputs: Record<string, any>, metric: boolean) => {
    setIsMetric(metric);
    if (inputs.length !== undefined) setLength(inputs.length);
    if (inputs.drywallWidth !== undefined) setDrywallWidth(inputs.drywallWidth);
    if (inputs.thickness !== undefined) setThickness(inputs.thickness);
    if (inputs.includeCeiling !== undefined) setIncludeCeiling(inputs.includeCeiling);
    if (inputs.sheetSize !== undefined) setSheetSize(inputs.sheetSize);
  };

  const handleAdd = (): ShoppingItem => {
    const lUnit = isMetric ? "m" : "ft";
    const itemTitle = `${t.nav.drywall} (${length}${lUnit} x ${drywallWidth}${lUnit} x ${thickness}${lUnit})`;
    const itemDetails = `${results.sheetsNeeded} sheets (${sheetSize}) + ${results.tapeFeet}ft tape`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'drywall-calculator',
      title: itemTitle,
      material: 'Drywall',
      shape: 'Room',
      type: 'drywall',
      details: itemDetails,
      checked: true,
      inputs: { length, drywallWidth, thickness, includeCeiling, sheetSize, waste, pricePerUnit },
      outputs: results,
      isMetric,
      unitPrice: pricePerUnit > 0 ? pricePerUnit : undefined,
      estimatedCost: results.estimatedCost
    };

    return newItem;
  };

  return (
    <CalculatorShell
      type="drywall"
      material="Drywall"
      shape="Room"
      slug="drywall-calculator"
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
      renderVisualizer={() => (
        <svg viewBox="0 0 300 180" className="w-full max-h-[180px]">
          <rect x="50" y="40" width="200" height="100" fill="var(--color-surface-soft)" stroke="var(--color-muted)" strokeWidth="1.5" />
          {includeCeiling && (
            <polygon points="50,40 150,15 250,40" fill="var(--color-brand-accent)" fillOpacity="0.1" stroke="var(--color-brand-accent)" strokeWidth="1.5" strokeDasharray="3 3" />
          )}
          <text x="150" y="95" textAnchor="middle" fontSize="11" fill="var(--color-ink)" className="font-mono font-bold">
            {length} {isMetric ? 'm' : 'ft'} x {drywallWidth} {isMetric ? 'm' : 'ft'}
          </text>
          <text x="150" y="115" textAnchor="middle" fontSize="9" fill="var(--color-muted)" className="font-mono">
            {t.calculator.height}: {thickness} {isMetric ? 'm' : 'ft'}
          </text>
        </svg>
      )}
      renderOutputs={() => (
        <>
          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-body font-medium">{t.calculator.drywallSheets}</span>
            <span className="text-2xl font-mono font-extrabold text-brand-accent">
              {results.sheetsNeeded} <span className="text-sm font-medium text-ink">({sheetSize})</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">{t.calculator.jointTape}</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.tapeFeet} <span className="text-xs font-normal text-muted">{isMetric ? 'm' : 'ft'}</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">{t.calculator.screws}</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.screwsCount} <span className="text-xs font-normal text-muted">pcs</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">{t.calculator.jointCompound}</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.compoundLbs} <span className="text-xs font-normal text-muted">{isMetric ? 'kg' : 'lbs'}</span>
            </span>
          </div>
        </>
      )}
    >
      {/* Length */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">{t.calculator.length} ({isMetric ? 'm' : 'ft'})</label>
          <span className="font-mono font-semibold text-brand-accent">{length} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 30 : 100} 
            step="1"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value))}
            className="flex-grow accent-indigo-600 dark:accent-indigo-400"
          />
          <input 
            type="number"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded px-2.5 py-1 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Width */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">{t.calculator.width} ({isMetric ? 'm' : 'ft'})</label>
          <span className="font-mono font-semibold text-brand-accent">{drywallWidth} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 30 : 100} 
            step="1"
            value={drywallWidth}
            onChange={(e) => setDrywallWidth(parseFloat(e.target.value))}
            className="flex-grow accent-indigo-600 dark:accent-indigo-400"
          />
          <input 
            type="number"
            value={drywallWidth}
            onChange={(e) => setDrywallWidth(parseFloat(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded px-2.5 py-1 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Height */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">{t.calculator.height} ({isMetric ? 'm' : 'ft'})</label>
          <span className="font-mono font-semibold text-brand-accent">{thickness} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 10 : 24} 
            step="0.5"
            value={thickness}
            onChange={(e) => setThickness(parseFloat(e.target.value))}
            className="flex-grow accent-indigo-600 dark:accent-indigo-400"
          />
          <input 
            type="number"
            value={thickness}
            onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded px-2.5 py-1 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Include Ceiling Toggle */}
      <div className="pt-2">
        <button 
          type="button"
          onClick={() => setIncludeCeiling(!includeCeiling)}
          className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer"
        >
          {includeCeiling ? (
            <CheckSquare size={16} className="text-brand-accent" />
          ) : (
            <Square size={16} className="text-muted" />
          )}
          <span>Include Ceiling in Sheet Calculation</span>
        </button>
      </div>
    </CalculatorShell>
  );
}
