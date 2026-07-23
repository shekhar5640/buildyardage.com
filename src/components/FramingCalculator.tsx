import React, { useState, useMemo } from 'react';
import { calculateFraming, type FramingResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';
import { getTranslations, getLocaleFromUrl, type SupportedLocale } from '../i18n/utils';

interface FramingProps {
  initialWallLength?: number;
  initialStudSpacing?: number;
  initialIsMetric?: boolean;
  locale?: string;
}

export default function FramingCalculator({
  initialWallLength = 50,
  initialStudSpacing = 16,
  initialIsMetric = false,
  locale
}: FramingProps) {
  const activeLocale = (locale || (typeof window !== 'undefined' ? getLocaleFromUrl(window.location.pathname) : 'en')) as SupportedLocale;
  const t = getTranslations(activeLocale);

  const [length, setLength] = useState<number>(initialWallLength); // wall length
  const [studSpacing, setStudSpacing] = useState<number>(initialStudSpacing);
  const [corners, setCorners] = useState<number>(4);
  const [topPlates, setTopPlates] = useState<number>(2);
  const [bottomPlates, setBottomPlates] = useState<number>(1);
  const [waste, setWaste] = useState<number>(10);
  const [isMetric, setIsMetric] = useState<boolean>(initialIsMetric);
  const [priceInput, setPriceInput] = useState<string>("");

  const pricePerUnit = useMemo(() => parseFloat(priceInput) || 0, [priceInput]);

  const results = useMemo(() => {
    const res = calculateFraming(length, studSpacing, corners, topPlates, bottomPlates, waste, isMetric);
    if (pricePerUnit > 0) {
      const totalPieces = res.studsCount + res.topPlates16ft + res.bottomPlates16ft;
      res.estimatedCost = parseFloat((totalPieces * pricePerUnit).toFixed(2));
    } else {
      res.estimatedCost = undefined;
    }
    return res;
  }, [length, studSpacing, corners, topPlates, bottomPlates, waste, isMetric, pricePerUnit]);

  const handleRestore = (inputs: Record<string, any>, metric: boolean) => {
    setIsMetric(metric);
    if (inputs.length !== undefined) setLength(inputs.length);
    if (inputs.studSpacing !== undefined) setStudSpacing(inputs.studSpacing);
    if (inputs.corners !== undefined) setCorners(inputs.corners);
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
      inputs: { length, studSpacing, corners, topPlates, bottomPlates, waste, pricePerUnit },
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
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">{t.calculator.length} ({isMetric ? 'm' : 'ft'})</label>
          <span className="font-mono font-semibold text-brand-accent">{length} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 60 : 200} 
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

      {/* Stud Spacing */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-ink uppercase tracking-wider">{t.calculator.spacing}</label>
        <select
          value={studSpacing}
          onChange={(e) => setStudSpacing(parseInt(e.target.value))}
          className="w-full px-3 py-2 bg-surface-card border border-hairline rounded text-sm text-ink font-medium focus:outline-none focus:border-brand-accent"
        >
          <option value={16}>16 inches On-Center (Standard Code)</option>
          <option value={24}>24 inches On-Center (Advanced Framing)</option>
          <option value={12}>12 inches On-Center (Heavy Duty Load)</option>
        </select>
      </div>
    </CalculatorShell>
  );
}
