import React, { useState, useMemo } from 'react';
import { calculateConcreteSlab, type ConcreteSlabResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';

interface ConcreteSlabProps {
  initialLength?: number;
  initialWidth?: number;
  initialThickness?: number;
  initialIsMetric?: boolean;
}

export default function ConcreteSlabCalculator({
  initialLength = 12,
  initialWidth = 10,
  initialThickness = 4,
  initialIsMetric = false
}: ConcreteSlabProps) {
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
    setIsMetric(metric);
    if (inputs.length !== undefined) setLength(inputs.length);
    if (inputs.width !== undefined) setWidth(inputs.width);
    if (inputs.thickness !== undefined) setThickness(inputs.thickness);
  };

  const handleAdd = (): ShoppingItem => {
    const lUnit = isMetric ? "m" : "ft";
    const tUnit = isMetric ? "cm" : "in";
    const itemTitle = `Concrete Slab (${length}${lUnit} x ${width}${lUnit} x ${thickness}${tUnit})`;
    const itemDetails = `${results.cubicYards} cu yd (${results.bags80lb} bags of 80lb)`;

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
            <span className="text-sm text-body font-medium">Concrete Volume (Yards)</span>
            <span className="text-2xl font-mono font-extrabold text-ink">
              {results.cubicYards} <span className="text-sm font-medium">cu yd</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Concrete Volume (Metric)</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.cubicMeters} <span className="text-xs font-normal text-muted">m³</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Concrete Volume (Feet)</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.cubicFeet} <span className="text-xs font-normal text-muted">cu ft</span>
            </span>
          </div>

          <div className="mt-4 pt-2">
            <h4 className="text-xs font-bold text-muted uppercase mb-3">Pre-mix Bag Counts</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                <span className="block text-xs text-muted font-medium mb-1">80lb Bags</span>
                <span className="text-md font-mono font-extrabold text-brand-accent">{results.bags80lb}</span>
              </div>
              <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                <span className="block text-xs text-muted font-medium mb-1">60lb Bags</span>
                <span className="text-md font-mono font-extrabold text-brand-accent">{results.bags60lb}</span>
              </div>
              <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                <span className="block text-xs text-muted font-medium mb-1">40lb Bags</span>
                <span className="text-md font-mono font-extrabold text-brand-accent">{results.bags40lb}</span>
              </div>
            </div>
          </div>
        </>
      )}
    >
      {/* Length */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Length ({isMetric ? 'meters' : 'feet'})</label>
          <span className="font-mono font-semibold text-brand-accent">{length} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 30 : 100} 
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

      {/* Width */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Width ({isMetric ? 'meters' : 'feet'})</label>
          <span className="font-mono font-semibold text-brand-accent">{width} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 30 : 100} 
            step="0.5"
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

      {/* Thickness */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Thickness ({isMetric ? 'cm' : 'inches'})</label>
          <span className="font-mono font-semibold text-brand-accent">{thickness} {isMetric ? 'cm' : 'in'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 100 : 36} 
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
    </CalculatorShell>
  );
}
