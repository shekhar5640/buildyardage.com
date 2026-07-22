import React, { useState, useMemo } from 'react';
import { calculateGravel, type GravelResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';

interface GravelProps {
  initialLength?: number;
  initialWidth?: number;
  initialDepth?: number;
}

export default function GravelCalculator({
  initialLength = 20,
  initialWidth = 10,
  initialDepth = 4
}: GravelProps) {
  const [length, setLength] = useState<number>(initialLength);
  const [width, setWidth] = useState<number>(initialWidth);
  const [thickness, setThickness] = useState<number>(initialDepth);
  const [waste, setWaste] = useState<number>(10);
  const [gravelDensity, setGravelDensity] = useState<number>(1.4);
  const [isMetric, setIsMetric] = useState<boolean>(false);
  const [priceInput, setPriceInput] = useState<string>("");

  const pricePerUnit = useMemo(() => parseFloat(priceInput) || 0, [priceInput]);

  const results = useMemo(() => {
    const res = calculateGravel(length, width, thickness, waste, gravelDensity, isMetric);
    if (pricePerUnit > 0) {
      res.estimatedCost = parseFloat((res.tons * pricePerUnit).toFixed(2));
    } else {
      res.estimatedCost = undefined;
    }
    return res;
  }, [length, width, thickness, waste, gravelDensity, isMetric, pricePerUnit]);

  const handleRestore = (inputs: Record<string, any>, metric: boolean) => {
    setIsMetric(metric);
    if (inputs.length !== undefined) setLength(inputs.length);
    if (inputs.width !== undefined) setWidth(inputs.width);
    if (inputs.thickness !== undefined) setThickness(inputs.thickness);
    if (inputs.gravelDensity !== undefined) setGravelDensity(inputs.gravelDensity);
  };

  const handleAdd = (): ShoppingItem => {
    const lUnit = isMetric ? "m" : "ft";
    const tUnit = isMetric ? "cm" : "in";
    const itemTitle = `Gravel Base (${length}${lUnit} x ${width}${lUnit} x ${thickness}${tUnit})`;
    const itemDetails = `${results.tons} tons (${results.cubicYards} cu yd)`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'gravel-driveway-calculator',
      title: itemTitle,
      material: 'Gravel',
      shape: 'Base',
      type: 'gravel-rect',
      details: itemDetails,
      checked: true,
      inputs: { length, width, thickness, waste, gravelDensity, pricePerUnit },
      outputs: results,
      isMetric,
      unitPrice: pricePerUnit > 0 ? pricePerUnit : undefined,
      estimatedCost: results.estimatedCost
    };

    return newItem;
  };

  return (
    <CalculatorShell
      type="gravel-rect"
      material="Gravel"
      shape="Base"
      slug="gravel-driveway-calculator"
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
          <defs>
            <pattern id="gravel-pat-interactive" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="var(--color-muted)" />
              <circle cx="7" cy="5" r="1" fill="var(--color-brand-accent)" />
              <circle cx="4" cy="8" r="1.2" fill="var(--color-muted-soft)" />
            </pattern>
          </defs>
          <polygon points="150,30 240,65 150,100 60,65" fill="url(#gravel-pat-interactive)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <polygon points={`60,65 150,100 150,${100 + (thickness * 0.8)} 60,${65 + (thickness * 0.8)}`} fill="var(--color-surface-strong)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <polygon points={`150,100 240,65 240,${65 + (thickness * 0.8)} 150,${100 + (thickness * 0.8)}`} fill="var(--color-hairline-soft)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <text x="75" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">L: {length} {isMetric ? 'm' : 'ft'}</text>
          <text x="210" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">W: {width} {isMetric ? 'm' : 'ft'}</text>
          <text x="155" y={115 + (thickness * 0.5)} fontSize="9" fill="var(--color-brand-accent)" className="font-mono font-bold">Depth: {thickness} {isMetric ? 'cm' : 'in'}</text>
        </svg>
      )}
      renderOutputs={() => (
        <>
          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-body font-medium">Aggregate Needed (Weight)</span>
            <span className="text-2xl font-mono font-extrabold text-ink">
              {results.tons} <span className="text-sm font-medium">tons</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Concrete/Gravel Volume (Yards)</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.cubicYards} <span className="text-xs font-normal text-muted">cu yd</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Concrete/Gravel Volume (Metric)</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.cubicMeters} <span className="text-xs font-normal text-muted">m³</span>
            </span>
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

      {/* Depth (Thickness) */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Depth ({isMetric ? 'cm' : 'inches'})</label>
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

      {/* Gravel Density */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Material Density (Tons/yd³)</label>
          <span className="font-mono font-semibold text-brand-accent">{gravelDensity} t/yd³</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1.0" 
            max="2.0" 
            step="0.05"
            value={gravelDensity}
            onChange={(e) => setGravelDensity(parseFloat(e.target.value))}
            className="flex-grow accent-indigo-600 dark:accent-indigo-400"
          />
          <input 
            type="number"
            value={gravelDensity}
            onChange={(e) => setGravelDensity(parseFloat(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded px-2.5 py-1 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
