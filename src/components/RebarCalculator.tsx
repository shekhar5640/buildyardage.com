import React, { useState, useMemo } from 'react';
import { calculateRebar, REBAR_SIZES, type RebarResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';

interface RebarProps {
  initialLength?: number;
  initialWidth?: number;
  initialSpacing?: number;
  initialRebarSize?: string;
}

export default function RebarCalculator({
  initialLength = 30,
  initialWidth = 20,
  initialSpacing = 12,
  initialRebarSize = '#4'
}: RebarProps) {
  const [length, setLength] = useState<number>(initialLength); // slab length
  const [width, setWidth] = useState<number>(initialWidth); // slab width
  const [thickness, setThickness] = useState<number>(3); // edge clearance
  const [rebarSpacing, setRebarSpacing] = useState<number>(initialSpacing); // grid spacing
  const [rebarStickLength, setRebarStickLength] = useState<number>(20); // stock length
  const [rebarOverlap, setRebarOverlap] = useState<number>(18); // lap splice
  const [rebarSize, setRebarSize] = useState<string>(initialRebarSize);
  const [waste, setWaste] = useState<number>(10);
  const [isMetric, setIsMetric] = useState<boolean>(false);
  const [priceInput, setPriceInput] = useState<string>("");

  const pricePerUnit = useMemo(() => parseFloat(priceInput) || 0, [priceInput]);

  const results = useMemo(() => {
    const res = calculateRebar(length, width, thickness, rebarSpacing, rebarStickLength, rebarOverlap, waste, rebarSize, isMetric);
    if (pricePerUnit > 0) {
      res.estimatedCost = parseFloat((res.totalPieces * pricePerUnit).toFixed(2));
    } else {
      res.estimatedCost = undefined;
    }
    return res;
  }, [length, width, thickness, rebarSpacing, rebarStickLength, rebarOverlap, rebarSize, waste, isMetric, pricePerUnit]);

  const handleRestore = (inputs: Record<string, any>, metric: boolean) => {
    setIsMetric(metric);
    if (inputs.length !== undefined) setLength(inputs.length);
    if (inputs.width !== undefined) setWidth(inputs.width);
    if (inputs.thickness !== undefined) setThickness(inputs.thickness);
    if (inputs.rebarSpacing !== undefined) setRebarSpacing(inputs.rebarSpacing);
    if (inputs.rebarStickLength !== undefined) setRebarStickLength(inputs.rebarStickLength);
    if (inputs.rebarOverlap !== undefined) setRebarOverlap(inputs.rebarOverlap);
    if (inputs.rebarSize !== undefined) setRebarSize(inputs.rebarSize);
  };

  const handleAdd = (): ShoppingItem => {
    const lUnit = isMetric ? "m" : "ft";
    const tUnit = isMetric ? "cm" : "in";
    const weightUnit = isMetric ? "kg" : "lbs";
    const estWeight = isMetric ? results.estimatedWeightKgs : results.estimatedWeightLbs;
    const itemTitle = `Rebar Grid (${length}${lUnit} x ${width}${lUnit}, Clearance: ${thickness}${tUnit})`;
    const itemDetails = `${results.totalPieces} Sticks (${rebarSize}), Length: ${results.totalLength}${lUnit}, Weight: ${estWeight} ${weightUnit}`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'rebar-calculator',
      title: itemTitle,
      material: 'Steel',
      shape: 'Rebar',
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
      material="Steel"
      shape="Rebar"
      slug="rebar-calculator"
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
          <polygon points="150,30 240,65 150,100 60,65" fill="var(--color-hairline-soft)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <polygon points="60,65 150,100 150,110 60,75" fill="var(--color-surface-strong)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <polygon points="150,100 240,65 240,75 150,110" fill="var(--color-hairline-soft)" stroke="var(--color-muted)" strokeWidth="1.5" />

          {/* Rebar grids rendering correctly */}
          {[0.2, 0.4, 0.6, 0.8].map((u, i) => {
            const x1 = 150 + u * -90 + 0.08 * 90;
            const y1 = 30 + u * 35 + 0.08 * 35;
            const x2 = 150 + u * -90 + 0.92 * 90;
            const y2 = 30 + u * 35 + 0.92 * 35;
            return <line key={`len-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-brand-accent)" strokeWidth="2.2" strokeLinecap="round" />;
          })}
          {[0.2, 0.4, 0.6, 0.8].map((v, i) => {
            const x1 = 150 + 0.08 * -90 + v * 90;
            const y1 = 30 + 0.08 * 35 + v * 35;
            const x2 = 150 + 0.92 * -90 + v * 90;
            const y2 = 30 + 0.92 * 35 + v * 35;
            return <line key={`wid-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-brand-accent)" strokeWidth="2.2" strokeLinecap="round" />;
          })}

          <text x="75" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">L: {length} {isMetric ? 'm' : 'ft'}</text>
          <text x="210" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">W: {width} {isMetric ? 'm' : 'ft'}</text>
          <text x="150" y="125" textAnchor="middle" fontSize="9" fill="var(--color-brand-accent)" className="font-mono font-bold">Grid Spacing: {rebarSpacing} {isMetric ? 'cm' : 'in'}</text>
        </svg>
      )}
      renderOutputs={() => (
        <>
          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-body font-medium">Rebar Sticks Needed</span>
            <span className="text-2xl font-mono font-extrabold text-ink">
              {results.totalPieces} <span className="text-sm font-medium">sticks</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Total Rebar Length</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.totalLength} <span className="text-xs font-normal text-muted">{isMetric ? 'm' : 'ft'}</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Estimated Grid Weight</span>
            <span className="text-md font-mono font-bold text-ink">
              {isMetric ? results.estimatedWeightKgs : results.estimatedWeightLbs} <span className="text-xs font-normal text-muted">{isMetric ? 'kg' : 'lbs'}</span>
            </span>
          </div>
        </>
      )}
    >
      {/* Slab Length */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Slab Length ({isMetric ? 'meters' : 'feet'})</label>
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

      {/* Slab Width */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Slab Width ({isMetric ? 'meters' : 'feet'})</label>
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

      {/* Grid Spacing Range Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Grid Spacing ({isMetric ? 'cm' : 'inches'})</label>
          <span className="font-mono font-semibold text-brand-accent">{rebarSpacing} {isMetric ? 'cm' : 'in'} O.C.</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min={isMetric ? 10 : 3} 
            max={isMetric ? 100 : 36} 
            step="1"
            value={rebarSpacing}
            onChange={(e) => setRebarSpacing(parseInt(e.target.value) || 0)}
            className="flex-grow accent-indigo-600 dark:accent-indigo-400 cursor-pointer"
          />
          <input 
            type="number"
            min={isMetric ? 5 : 1}
            max={isMetric ? 150 : 60}
            value={rebarSpacing}
            onChange={(e) => setRebarSpacing(parseInt(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded px-2.5 py-1 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Grid parameter dropdowns (Rebar size, stick length) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Rebar Size Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Rebar Size</label>
          <select 
            value={rebarSize}
            onChange={(e) => setRebarSize(e.target.value)}
            className="w-full text-xs border border-hairline rounded p-2.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          >
            {Object.keys(REBAR_SIZES).map((sz) => (
              <option key={sz} value={sz}>{REBAR_SIZES[sz as keyof typeof REBAR_SIZES].name}</option>
            ))}
          </select>
        </div>

        {/* Stick Length Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Stick Stock Length</label>
          <select 
            value={rebarStickLength}
            onChange={(e) => setRebarStickLength(parseInt(e.target.value) || 0)}
            className="w-full text-xs border border-hairline rounded p-2.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          >
            {isMetric ? (
              <>
                <option value="6">6.0 meters</option>
                <option value="9">9.0 meters</option>
                <option value="12">12.0 meters</option>
              </>
            ) : (
              <>
                <option value="10">10.0 feet</option>
                <option value="20">20.0 feet (Standard)</option>
                <option value="30">30.0 feet</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Lap Splice Overlap Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Lap Splice</label>
          <select 
            value={rebarOverlap}
            onChange={(e) => setRebarOverlap(parseInt(e.target.value) || 0)}
            className="w-full text-xs border border-hairline rounded p-2.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          >
            {isMetric ? (
              <>
                <option value="30">30 cm</option>
                <option value="45">45 cm (Standard)</option>
                <option value="60">60 cm</option>
              </>
            ) : (
              <>
                <option value="12">12 inches</option>
                <option value="18">18 inches (Standard)</option>
                <option value="24">24 inches</option>
              </>
            )}
          </select>
        </div>

        {/* Edge Clearance Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Edge Clearance</label>
          <select 
            value={thickness}
            onChange={(e) => setThickness(parseInt(e.target.value) || 0)}
            className="w-full text-xs border border-hairline rounded p-2.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          >
            {isMetric ? (
              <>
                <option value="5">5 cm</option>
                <option value="7.5">7.5 cm (Standard)</option>
                <option value="10">10 cm</option>
              </>
            ) : (
              <>
                <option value="2">2 inches</option>
                <option value="3">3 inches (Standard)</option>
                <option value="4">4 inches</option>
              </>
            )}
          </select>
        </div>
      </div>
    </CalculatorShell>
  );
}
