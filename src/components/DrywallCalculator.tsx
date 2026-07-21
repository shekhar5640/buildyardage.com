import React, { useState, useMemo } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { calculateDrywall, type DrywallResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';

export default function DrywallCalculator() {
  const [length, setLength] = useState<number>(12); // room length
  const [drywallWidth, setDrywallWidth] = useState<number>(10); // room width
  const [thickness, setThickness] = useState<number>(8); // wall height
  const [waste, setWaste] = useState<number>(10);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [sheetSize, setSheetSize] = useState<string>('4x8');
  const [isMetric, setIsMetric] = useState<boolean>(false);
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

  const handleAdd = () => {
    const lUnit = isMetric ? "m" : "ft";
    const roomSize = drywallWidth > 0 
      ? `${length}x${drywallWidth}x${thickness}${lUnit}` 
      : `${length}x${thickness}${lUnit} Wall`;
    const itemTitle = `Drywall Panels (${roomSize})`;
    const itemDetails = `${results.sheetsNeeded} sheets (${sheetSize}), tape: ${results.tapeFeet}ft, screws: ${results.screwsNeeded}`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'drywall-calculator',
      title: itemTitle,
      material: 'Drywall',
      shape: 'Room',
      type: 'drywall',
      details: itemDetails,
      checked: true,
      inputs: { length, drywallWidth, thickness, waste, includeCeiling, sheetSize, pricePerUnit },
      outputs: results,
      isMetric,
      unitPrice: pricePerUnit > 0 ? pricePerUnit : undefined,
      estimatedCost: results.estimatedCost
    };

    const stored = localStorage.getItem('buildyardage_shopping');
    const list = stored ? JSON.parse(stored) : [];
    localStorage.setItem('buildyardage_shopping', JSON.stringify([...list, newItem]));

    const storedHistory = localStorage.getItem('buildyardage_history');
    const historyList = storedHistory ? JSON.parse(storedHistory) : [];
    const newHistory = {
      id: Date.now().toString(),
      slug: 'drywall-calculator',
      material: 'Drywall',
      shape: 'Room',
      inputs: { length, drywallWidth, thickness, waste, includeCeiling, sheetSize, pricePerUnit },
      outputs: results,
      isMetric,
      timestamp: Date.now()
    };
    localStorage.setItem('buildyardage_history', JSON.stringify([newHistory, ...historyList.slice(0, 9)]));

    window.location.reload();
  };

  return (
    <CalculatorShell
      type="drywall"
      material="Drywall"
      shape="Room"
      slug="drywall-calculator"
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
        <svg viewBox="0 0 240 140" className="w-full max-h-[180px]">
          <rect x="30" y="20" width="180" height="90" fill="var(--color-hairline)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <line x1="75" y1="20" x2="75" y2="110" stroke="var(--color-muted-soft)" strokeDasharray="3" />
          <line x1="120" y1="20" x2="120" y2="110" stroke="var(--color-muted-soft)" strokeDasharray="3" />
          <line x1="165" y1="20" x2="165" y2="110" stroke="var(--color-muted-soft)" strokeDasharray="3" />
          <text x="120" y="125" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">W: {length} {isMetric ? 'm' : 'ft'}</text>
          <text x="15" y="70" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold" transform="rotate(-90,15,70)">H: {thickness} {isMetric ? 'm' : 'ft'}</text>
        </svg>
      )}
      renderOutputs={() => (
        <>
          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-body font-medium">Panels Required ({sheetSize} sheets)</span>
            <span className="text-2xl font-mono font-extrabold text-ink">
              {results.sheetsNeeded} <span className="text-sm font-medium">sheets</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Joint Tape Required</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.tapeFeet} <span className="text-xs font-normal text-muted">ft</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Joint Compound (Weight)</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.compoundLbs} <span className="text-xs font-normal text-muted">lbs</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
            <span className="text-sm text-muted">Drywall Screws Needed</span>
            <span className="text-md font-mono font-bold text-ink">
              {results.screwsNeeded} <span className="text-xs font-normal text-muted">screws</span>
            </span>
          </div>
        </>
      )}
    >
      {/* Length */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Room Length ({isMetric ? 'meters' : 'feet'})</label>
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

      {/* Room Width */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Room Width ({isMetric ? 'meters' : 'feet'})</label>
          <span className="font-mono font-semibold text-brand-accent">{drywallWidth} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="0" 
            max={isMetric ? 30 : 100} 
            step="0.5"
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

      {/* Wall Height */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Wall Height ({isMetric ? 'meters' : 'feet'})</label>
          <span className="font-mono font-semibold text-brand-accent">{thickness} {isMetric ? 'm' : 'ft'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max={isMetric ? 10 : 25} 
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

      {/* Sheet size buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink block">Drywall Panel Size</label>
        <div className="flex gap-4">
          <button 
            onClick={() => setSheetSize('4x8')}
            className={`flex-grow py-2.5 px-4 rounded border text-xs font-bold transition-all cursor-pointer ${sheetSize === '4x8' ? 'bg-brand-accent border-brand-accent text-white' : 'border-hairline hover:bg-surface-soft text-ink bg-canvas'}`}
          >
            4ft x 8ft Panel
          </button>
          <button 
            onClick={() => setSheetSize('4x12')}
            className={`flex-grow py-2.5 px-4 rounded border text-xs font-bold transition-all cursor-pointer ${sheetSize === '4x12' ? 'bg-brand-accent border-brand-accent text-white' : 'border-hairline hover:bg-surface-soft text-ink bg-canvas'}`}
          >
            4ft x 12ft Panel
          </button>
        </div>
      </div>

      {/* Ceiling toggle checkbox */}
      <div className="flex items-center gap-2 mt-4">
        <button 
          onClick={() => setIncludeCeiling(!includeCeiling)}
          className="text-muted hover:text-brand-accent cursor-pointer"
        >
          {includeCeiling ? (
            <CheckSquare size={18} className="text-brand-accent" />
          ) : (
            <Square size={18} />
          )}
        </button>
        <span className="text-sm text-ink font-medium">Include Ceiling Drywall</span>
      </div>
    </CalculatorShell>
  );
}
