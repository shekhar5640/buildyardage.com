import React, { useState, useMemo } from 'react';
import { calculateRebar, REBAR_SIZES, type RebarResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';
import { getTranslations, getLocaleFromUrl, type SupportedLocale } from '../i18n/utils';

interface RebarProps {
  initialLength?: number;
  initialWidth?: number;
  initialSpacing?: number;
  initialRebarSize?: string;
  initialIsMetric?: boolean;
  locale?: string;
}

export default function RebarCalculator({
  initialLength = 30,
  initialWidth = 20,
  initialSpacing = 12,
  initialRebarSize = '#4',
  initialIsMetric = false,
  locale
}: RebarProps) {
  const activeLocale = (locale || (typeof window !== 'undefined' ? getLocaleFromUrl(window.location.pathname) : 'en')) as SupportedLocale;
  const t = getTranslations(activeLocale);

  const [length, setLength] = useState<number>(initialLength); // slab length
  const [width, setWidth] = useState<number>(initialWidth); // slab width
  const [thickness, setThickness] = useState<number>(3); // edge clearance
  const [rebarSpacing, setRebarSpacing] = useState<number>(initialSpacing); // grid spacing
  const [rebarStickLength, setRebarStickLength] = useState<number>(20); // stock length
  const [rebarOverlap, setRebarOverlap] = useState<number>(18); // lap splice
  const [rebarSize, setRebarSize] = useState<string>(initialRebarSize);
  const [waste, setWaste] = useState<number>(10);
  const [isMetric, setIsMetric] = useState<boolean>(initialIsMetric);
  const [priceInput, setPriceInput] = useState<string>("");

  const pricePerUnit = useMemo(() => parseFloat(priceInput) || 0, [priceInput]);

  const results = useMemo(() => {
    const res = calculateRebar(length, width, rebarSpacing, rebarStickLength, rebarOverlap, thickness, rebarSize, waste, isMetric);
    if (pricePerUnit > 0) {
      res.estimatedCost = parseFloat((res.totalPieces * pricePerUnit).toFixed(2));
    } else {
      res.estimatedCost = undefined;
    }
    return res;
  }, [length, width, rebarSpacing, rebarStickLength, rebarOverlap, thickness, rebarSize, waste, isMetric, pricePerUnit]);

  const handleRestore = (inputs: Record<string, any>, metric: boolean) => {
    setIsMetric(metric);
    if (inputs.length !== undefined) setLength(inputs.length);
    if (inputs.width !== undefined) setWidth(inputs.width);
    if (inputs.rebarSpacing !== undefined) setRebarSpacing(inputs.rebarSpacing);
    if (inputs.rebarSize !== undefined) setRebarSize(inputs.rebarSize);
  };

  const handleAdd = (): ShoppingItem => {
    const lUnit = isMetric ? "m" : "ft";
    const itemTitle = `${t.nav.rebar} (${length}${lUnit} x ${width}${lUnit} @ ${rebarSpacing}" grid)`;
    const itemDetails = `${results.totalPieces} sticks (${rebarSize}) + ${results.totalWeightLbs} ${isMetric ? 'kg' : 'lbs'}`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'rebar-calculator',
      title: itemTitle,
      material: 'Rebar',
      shape: 'Grid',
      type: 'rebar',
      details: itemDetails,
      checked: true,
      inputs: { length, width, thickness, rebarSpacing, rebarStickLength, rebarOverlap, rebarSize, waste, pricePerUnit },
      outputs: results,
      isMetric,
      unitPrice: pricePerUnit > 0 ? pricePerUnit : undefined,
      estimatedCost: results.estimatedCost
    };

    return newItem;
  };

  return (
    <CalculatorShell
      type="rebar"
      material="Rebar"
      shape="Grid"
      slug="rebar-calculator"
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
          <rect x="40" y="30" width="220" height="120" fill="var(--color-surface-soft)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <line x1="75" y1="30" x2="75" y2="150" stroke="var(--color-brand-accent)" strokeWidth="1.5" />
          <line x1="110" y1="30" x2="110" y2="150" stroke="var(--color-brand-accent)" strokeWidth="1.5" />
          <line x1="145" y1="30" x2="145" y2="150" stroke="var(--color-brand-accent)" strokeWidth="1.5" />
          <line x1="180" y1="30" x2="180" y2="150" stroke="var(--color-brand-accent)" strokeWidth="1.5" />
          <line x1="215" y1="30" x2="215" y2="150" stroke="var(--color-brand-accent)" strokeWidth="1.5" />

          <line x1="40" y1="60" x2="260" y2="60" stroke="var(--color-brand-accent)" strokeWidth="1.5" />
          <line x1="40" y1="90" x2="260" y2="90" stroke="var(--color-brand-accent)" strokeWidth="1.5" />
          <line x1="40" y1="120" x2="260" y2="120" stroke="var(--color-brand-accent)" strokeWidth="1.5" />

          <text x="150" y="20" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">
            {length} {isMetric ? 'm' : 'ft'} x {width} {isMetric ? 'm' : 'ft'} Rebar Grid ({rebarSize})
          </text>
        </svg>
      )}
      renderOutputs={() => (
        <>
          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-body font-medium">{t.calculator.rebarSticks}</span>
            <span className="text-2xl font-mono font-extrabold text-brand-accent">
              {results.totalPieces} <span className="text-sm font-medium text-ink">pcs</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">{t.calculator.rebarWeight}</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.totalWeightLbs} <span className="text-xs font-normal text-muted">{isMetric ? 'kg' : 'lbs'}</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">{t.calculator.lapSplice}</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.lapSpliceInches} <span className="text-xs font-normal text-muted">{isMetric ? 'cm' : 'in'}</span>
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
          <span className="font-mono font-semibold text-brand-accent">{width} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 30 : 100} 
            step="1"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value))}
            className="flex-grow accent-indigo-600 dark:accent-indigo-400"
          />
          <input 
            type="number"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded px-2.5 py-1 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Grid Spacing */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">{t.calculator.spacing} ({isMetric ? 'cm' : 'in'})</label>
          <span className="font-mono font-semibold text-brand-accent">{rebarSpacing} {isMetric ? 'cm' : 'in'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="4" 
            max={isMetric ? 60 : 36} 
            step="1"
            value={rebarSpacing}
            onChange={(e) => setRebarSpacing(parseFloat(e.target.value))}
            className="flex-grow accent-indigo-600 dark:accent-indigo-400"
          />
          <input 
            type="number"
            value={rebarSpacing}
            onChange={(e) => setRebarSpacing(parseFloat(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded px-2.5 py-1 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
