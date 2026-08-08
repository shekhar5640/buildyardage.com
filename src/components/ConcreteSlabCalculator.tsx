import React, { useState, useMemo } from 'react';
import { calculateConcreteSlab, type ConcreteSlabResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';
import DimensionInput from './DimensionInput';
import { getTranslations, getLocaleFromUrl, type SupportedLocale } from '../i18n/utils';

interface ConcreteSlabProps {
  initialLength?: number;
  initialWidth?: number;
  initialThickness?: number;
  initialIsMetric?: boolean;
  locale?: string;
  isEmbed?: boolean;
}

export default function ConcreteSlabCalculator({
  initialLength = 12,
  initialWidth = 10,
  initialThickness = 4,
  initialIsMetric = false,
  locale,
  isEmbed = false
}: ConcreteSlabProps) {
  const activeLocale = (locale || (typeof window !== 'undefined' ? getLocaleFromUrl(window.location.pathname) : 'en')) as SupportedLocale;
  const t = getTranslations(activeLocale);

  const [length, setLength] = useState<number>(initialLength);
  const [width, setWidth] = useState<number>(initialWidth);
  const [thickness, setThickness] = useState<number>(initialThickness);
  const [waste, setWaste] = useState<number>(10);
  const [isMetric, setIsMetric] = useState<boolean>(initialIsMetric);
  const [priceInput, setPriceInput] = useState<string>("");

  const pricePerUnit = useMemo(() => parseFloat(priceInput) || 0, [priceInput]);

  const results = useMemo(() => {
    const res = calculateConcreteSlab(length, width, thickness, waste, isMetric);
    if (pricePerUnit > 0) {
      const qty = isMetric ? res.cubicMeters : res.cubicYards;
      res.estimatedCost = parseFloat((qty * pricePerUnit).toFixed(2));
    } else {
      res.estimatedCost = undefined;
    }
    return res;
  }, [length, width, thickness, waste, isMetric, pricePerUnit]);

  const handleRestore = (inputs: Record<string, any>, metric: boolean) => {
    console.log("cache bust version 2");
    setIsMetric(metric);
    if (inputs.length !== undefined) setLength(inputs.length);
    if (inputs.width !== undefined) setWidth(inputs.width);
    if (inputs.thickness !== undefined) setThickness(inputs.thickness);
  };

  const handleAdd = (): ShoppingItem => {
    const lUnit = isMetric ? "m" : "ft";
    const tUnit = isMetric ? "cm" : "in";
    const itemTitle = `${t.nav.concreteSlab} (${length}${lUnit} x ${width}${lUnit} x ${thickness}${tUnit})`;
    const itemDetails = `${results.cubicYards} cu yd (${results.bags80lb} ${t.calculator.bags80lb})`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'concrete-slab-calculator',
      title: itemTitle,
      material: 'Concrete',
      shape: 'Slab',
      type: 'rectangular',
      details: itemDetails,
      checked: true,
      inputs: { length, width, thickness, waste, pricePerUnit },
      outputs: results,
      isMetric,
      unitPrice: pricePerUnit > 0 ? pricePerUnit : undefined,
      estimatedCost: results.estimatedCost
    };

    return newItem;
  };

  return (
    <CalculatorShell
      type="rectangular"
      material="Concrete"
      shape="Slab"
      slug="concrete-slab-calculator"
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
          <polygon points="150,30 240,65 150,100 60,65" fill="var(--color-hairline)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <polygon points={`60,65 150,100 150,${100 + (thickness * 0.8)} 60,${65 + (thickness * 0.8)}`} fill="var(--color-surface-strong)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <polygon points={`150,100 240,65 240,${65 + (thickness * 0.8)} 150,${100 + (thickness * 0.8)}`} fill="var(--color-hairline-soft)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <text x="75" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">L: {length} {isMetric ? 'm' : 'ft'}</text>
          <text x="210" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">W: {width} {isMetric ? 'm' : 'ft'}</text>
          <text x="155" y={115 + (thickness * 0.5)} fontSize="9" fill="var(--color-brand-accent)" className="font-mono font-bold">T: {thickness} {isMetric ? 'cm' : 'in'}</text>
        </svg>
      )}
      renderOutputs={() => (
        <>
          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-body font-medium">{t.calculator.cubicYards}</span>
            <span className="text-2xl font-mono font-extrabold text-ink">
              {results.cubicYards.toFixed(2)} <span className="text-sm font-medium">cu yd</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">{t.calculator.cubicMeters}</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.cubicMeters.toFixed(2)} <span className="text-xs font-normal text-muted">m³</span>
            </span>
          </div>

          <div className="mt-4 pt-2">
            <h4 className="text-xs font-bold text-muted uppercase mb-3">{t.calculator.bagsNeeded}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
      {/* Length */}
      <DimensionInput 
        label={t.calculator.length}
        value={length}
        onChange={setLength}
        isMetric={isMetric}
        metricUnit="m"
        imperialUnit="ft"
        max={isMetric ? 30 : 100}
      />

      {/* Width */}
      <DimensionInput 
        label={t.calculator.width}
        value={width}
        onChange={setWidth}
        isMetric={isMetric}
        metricUnit="m"
        imperialUnit="ft"
        max={isMetric ? 30 : 100}
      />

      {/* Thickness */}
      <DimensionInput 
        label={t.calculator.depth}
        value={thickness}
        onChange={setThickness}
        isMetric={isMetric}
        metricUnit="cm"
        imperialUnit="in"
        max={isMetric ? 50 : 24}
        step={0.5}
      />
    </CalculatorShell>
  );
}
