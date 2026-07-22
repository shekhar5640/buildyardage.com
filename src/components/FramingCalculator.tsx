import React, { useState, useMemo } from 'react';
import { calculateFraming, type FramingResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';

interface FramingProps {
  initialWallLength?: number;
  initialStudSpacing?: number;
}

export default function FramingCalculator({
  initialWallLength = 50,
  initialStudSpacing = 16
}: FramingProps) {
  const [length, setLength] = useState<number>(initialWallLength); // wall length
  const [studSpacing, setStudSpacing] = useState<number>(initialStudSpacing);
  const [corners, setCorners] = useState<number>(4);
  const [topPlates, setTopPlates] = useState<number>(2);
  const [bottomPlates, setBottomPlates] = useState<number>(1);
  const [waste, setWaste] = useState<number>(10);
  const [isMetric, setIsMetric] = useState<boolean>(false);
  const [priceInput, setPriceInput] = useState<string>("");

  const pricePerUnit = useMemo(() => parseFloat(priceInput) || 0, [priceInput]);

  const results = useMemo(() => {
    const res = calculateFraming(length, studSpacing, corners, topPlates, bottomPlates, waste, isMetric);
    if (pricePerUnit > 0) {
      const qty = res.studsCount + res.topPlates16ft + res.bottomPlates16ft;
      res.estimatedCost = parseFloat((qty * pricePerUnit).toFixed(2));
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
    if (inputs.topPlates !== undefined) setTopPlates(inputs.topPlates);
    if (inputs.bottomPlates !== undefined) setBottomPlates(inputs.bottomPlates);
  };

  const handleAdd = (): ShoppingItem => {
    const lUnit = isMetric ? "m" : "ft";
    const itemTitle = `Framed Wall (${length}${lUnit} Long, ${studSpacing}" o.c.)`;
    const itemDetails = `${results.studsCount} Studs, ${results.bottomPlates16ft + results.topPlates16ft} Plates (16ft)`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'framing-calculator',
      title: itemTitle,
      material: 'Framing',
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
      material="Framing"
      shape="Wall"
      slug="framing-calculator"
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
      renderVisualizer={() => {
        const calculatedBars = Math.ceil(length * (studSpacing === 16 ? 0.75 : 0.5));
        const numStuds = Math.max(5, Math.min(18, calculatedBars));
        const plateLeft = 20;
        const plateWidth = 260;
        const studWidth = 4;
        const usableWidth = plateWidth - studWidth; // 256

        return (
          <svg viewBox="0 0 300 120" className="w-full max-h-[180px]">
            {/* Double Top Plate */}
            <rect x={plateLeft} y="15" width={plateWidth} height="4" fill="var(--color-muted-soft)" stroke="var(--color-muted)" strokeWidth="0.5" />
            <rect x={plateLeft} y="20" width={plateWidth} height="4" fill="var(--color-muted-soft)" stroke="var(--color-muted)" strokeWidth="0.5" />
            {/* Bottom Plate */}
            <rect x={plateLeft} y="95" width={plateWidth} height="4" fill="var(--color-muted-soft)" stroke="var(--color-muted)" strokeWidth="0.5" />
            
            {/* Vertical Studs (Minimum 5 bars, last stud perfectly aligned flush at right edge) */}
            {Array.from({ length: numStuds }).map((_, idx) => {
              const xPos = plateLeft + (idx * (usableWidth / (numStuds - 1)));
              return (
                <rect 
                  key={idx} 
                  x={xPos} 
                  y="24" 
                  width={studWidth} 
                  height="71" 
                  fill="var(--color-surface-strong)" 
                  stroke="var(--color-muted)" 
                  strokeWidth="0.5" 
                />
              );
            })}
            <text x="150" y="112" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">Wall Length: {length} {isMetric ? 'm' : 'ft'}</text>
          </svg>
        );
      }}
      renderOutputs={() => (
        <>
          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-body font-medium">Vertical Studs Count</span>
            <span className="text-2xl font-mono font-extrabold text-ink">
              {results.studsCount} <span className="text-sm font-medium">studs</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Top Plates (16ft length)</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.topPlates16ft} <span className="text-xs font-normal text-muted">pcs</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Bottom Plates (16ft length)</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.bottomPlates16ft} <span className="text-xs font-normal text-muted">pcs</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Total Plates Length</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.platesTotalLength} <span className="text-xs font-normal text-muted">{isMetric ? 'm' : 'ft'}</span>
            </span>
          </div>
        </>
      )}
    >
      {/* Length */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Wall Length ({isMetric ? 'meters' : 'feet'})</label>
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

      {/* Stud Spacing Buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink block">Stud Spacing (On Center)</label>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => setStudSpacing(16)}
            className={`flex-grow py-2.5 px-4 rounded border text-xs font-bold transition-all cursor-pointer ${studSpacing === 16 ? 'bg-brand-accent border-brand-accent text-white' : 'border-hairline hover:bg-surface-soft text-ink bg-canvas'}`}
          >
            16 in (Standard O.C.)
          </button>
          <button 
            type="button"
            onClick={() => setStudSpacing(24)}
            className={`flex-grow py-2.5 px-4 rounded border text-xs font-bold transition-all cursor-pointer ${studSpacing === 24 ? 'bg-brand-accent border-brand-accent text-white' : 'border-hairline hover:bg-surface-soft text-ink bg-canvas'}`}
          >
            24 in (Wide O.C.)
          </button>
        </div>
      </div>

      {/* Corners & Intersections Range Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Corners & Intersections</label>
          <span className="font-mono font-semibold text-brand-accent">{corners} corners</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="0" 
            max="20" 
            step="1"
            value={corners}
            onChange={(e) => setCorners(parseInt(e.target.value) || 0)}
            className="flex-grow accent-indigo-600 dark:accent-indigo-400 cursor-pointer"
          />
          <input 
            type="number"
            min="0"
            max="50"
            value={corners}
            onChange={(e) => setCorners(parseInt(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded px-2.5 py-1 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Grid parameter dropdowns (Top Plates, Bottom Plates) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Top Plates</label>
          <select 
            value={topPlates}
            onChange={(e) => setTopPlates(parseInt(e.target.value) || 0)}
            className="w-full text-xs border border-hairline rounded p-2 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          >
            <option value="1">1 plate</option>
            <option value="2">2 plates (Standard)</option>
            <option value="3">3 plates</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Bottom Plates</label>
          <select 
            value={bottomPlates}
            onChange={(e) => setBottomPlates(parseInt(e.target.value) || 0)}
            className="w-full text-xs border border-hairline rounded p-2 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          >
            <option value="1">1 plate (Standard)</option>
            <option value="2">2 plates</option>
          </select>
        </div>
      </div>
    </CalculatorShell>
  );
}
