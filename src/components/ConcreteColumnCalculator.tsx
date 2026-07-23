import React, { useState, useMemo } from 'react';
import { calculateConcreteColumn, type ConcreteColumnResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';
import { getTranslations, getLocaleFromUrl, type SupportedLocale } from '../i18n/utils';

interface ConcreteColumnProps {
  initialDiameter?: number;
  initialDepth?: number;
  initialIsMetric?: boolean;
  locale?: string;
}

export default function ConcreteColumnCalculator({
  initialDiameter = 12,
  initialDepth = 8,
  initialIsMetric = false,
  locale
}: ConcreteColumnProps) {
  const activeLocale = (locale || (typeof window !== 'undefined' ? getLocaleFromUrl(window.location.pathname) : 'en')) as SupportedLocale;
  const t = getTranslations(activeLocale);

  const [length, setLength] = useState<number>(initialDepth); // depth/height
  const [thickness, setThickness] = useState<number>(initialDiameter); // diameter
  const [waste, setWaste] = useState<number>(10);
  const [isMetric, setIsMetric] = useState<boolean>(initialIsMetric);
  const [priceInput, setPriceInput] = useState<string>("");

  const pricePerUnit = useMemo(() => parseFloat(priceInput) || 0, [priceInput]);

  const results = useMemo(() => {
    const res = calculateConcreteColumn(thickness, length, waste, isMetric);
    if (pricePerUnit > 0) {
      const qty = isMetric ? res.cubicMeters : res.cubicYards;
      res.estimatedCost = parseFloat((qty * pricePerUnit).toFixed(2));
    } else {
      res.estimatedCost = undefined;
    }
    return res;
  }, [thickness, length, waste, isMetric, pricePerUnit]);

  const handleRestore = (inputs: Record<string, any>, metric: boolean) => {
    setIsMetric(metric);
    if (inputs.depth !== undefined) setLength(inputs.depth);
    if (inputs.diameter !== undefined) setThickness(inputs.diameter);
  };

  const handleAdd = (): ShoppingItem => {
    const dUnit = isMetric ? "cm" : "in";
    const hUnit = isMetric ? "m" : "ft";
    const itemTitle = `${t.nav.concreteColumn} (${thickness}${dUnit} Dia x ${length}${hUnit} H)`;
    const itemDetails = `${results.cubicYards} cu yd (${results.bags80lb} ${t.calculator.bags80lb})`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'concrete-column-calculator',
      title: itemTitle,
      material: 'Concrete',
      shape: 'Column',
      type: 'cylindrical',
      details: itemDetails,
      checked: true,
      inputs: { diameter: thickness, depth: length, waste, pricePerUnit },
      outputs: results,
      isMetric,
      unitPrice: pricePerUnit > 0 ? pricePerUnit : undefined,
      estimatedCost: results.estimatedCost
    };

    return newItem;
  };

  return (
    <CalculatorShell
      type="cylindrical"
      material="Concrete"
      shape="Column"
      slug="concrete-column-calculator"
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
        <svg viewBox="0 0 240 180" className="w-full max-h-[180px]">
          <ellipse cx="120" cy="40" rx="45" ry="15" fill="var(--color-surface-strong)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <path d="M 75 40 L 75 140 A 45 15 0 0 0 165 140 L 165 40 Z" fill="var(--color-hairline)" fillOpacity="0.8" stroke="var(--color-muted)" strokeWidth="1.5" />
          <text x="120" y="32" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">{t.calculator.diameter}: {thickness} {isMetric ? 'cm' : 'in'}</text>
          <text x="175" y="95" textAnchor="start" fontSize="10" fill="var(--color-brand-accent)" className="font-mono font-bold">{t.calculator.height}: {length} {isMetric ? 'm' : 'ft'}</text>
        </svg>
      )}
      renderOutputs={() => (
        <>
          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-body font-medium">{t.calculator.cubicYards}</span>
            <span className="text-2xl font-mono font-extrabold text-ink">
              {results.cubicYards} <span className="text-sm font-medium">cu yd</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">{t.calculator.cubicMeters}</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.cubicMeters} <span className="text-xs font-normal text-muted">m³</span>
            </span>
          </div>

          <div className="mt-4 pt-2">
            <h4 className="text-xs font-bold text-muted uppercase mb-3">{t.calculator.bagsNeeded}</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                <span className="block text-xs text-muted font-medium mb-1">{t.calculator.bags80lb}</span>
                <span className="text-md font-mono font-extrabold text-brand-accent">{results.bags80lb}</span>
              </div>
              <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                <span className="block text-xs text-muted font-medium mb-1">{t.calculator.bags60lb}</span>
                <span className="text-md font-mono font-extrabold text-brand-accent">{results.bags60lb}</span>
              </div>
              <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                <span className="block text-xs text-muted font-medium mb-1">{t.calculator.bags40lb}</span>
                <span className="text-md font-mono font-extrabold text-brand-accent">{results.bags40lb}</span>
              </div>
            </div>
          </div>
        </>
      )}
    >
      {/* Diameter */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">{t.calculator.diameter} ({isMetric ? 'cm' : 'in'})</label>
          <span className="font-mono font-semibold text-brand-accent">{thickness} {isMetric ? 'cm' : 'in'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="4" 
            max={isMetric ? 120 : 48} 
            step="1"
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

      {/* Depth / Height */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">{t.calculator.height} ({isMetric ? 'm' : 'ft'})</label>
          <span className="font-mono font-semibold text-brand-accent">{length} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 10 : 30} 
            step="0.5"
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
    </CalculatorShell>
  );
}
