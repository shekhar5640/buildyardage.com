import React, { useState, useMemo } from 'react';
import { calculateConcreteColumn, type ConcreteColumnResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';

export default function ConcreteColumnCalculator() {
  const [length, setLength] = useState<number>(8); // height
  const [thickness, setThickness] = useState<number>(12); // diameter
  const [waste, setWaste] = useState<number>(10);
  const [isMetric, setIsMetric] = useState<boolean>(false);
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
  }, [length, thickness, waste, isMetric, pricePerUnit]);

  const handleRestore = (inputs: Record<string, any>, metric: boolean) => {
    setIsMetric(metric);
    if (inputs.length !== undefined) setLength(inputs.length);
    if (inputs.thickness !== undefined) setThickness(inputs.thickness);
  };

  const handleAdd = () => {
    const lUnit = isMetric ? "m" : "ft";
    const tUnit = isMetric ? "cm" : "in";
    const itemTitle = `Concrete Column (Dia: ${thickness}${tUnit}, H: ${length}${lUnit})`;
    const itemDetails = `${results.cubicYards} cu yd (${results.bags80lb} bags of 80lb)`;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug: 'concrete-column-calculator',
      title: itemTitle,
      material: 'Concrete',
      shape: 'Column',
      type: 'cylindrical',
      details: itemDetails,
      checked: true,
      inputs: { length, thickness, waste, pricePerUnit },
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
      slug: 'concrete-column-calculator',
      material: 'Concrete',
      shape: 'Column',
      inputs: { length, thickness, waste, pricePerUnit },
      outputs: results,
      isMetric,
      timestamp: Date.now()
    };
    localStorage.setItem('buildyardage_history', JSON.stringify([newHistory, ...historyList.slice(0, 9)]));

    window.location.reload();
  };

  return (
    <CalculatorShell
      type="cylindrical"
      material="Concrete"
      shape="Column"
      slug="concrete-column-calculator"
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
        <svg viewBox="0 0 200 200" className="w-full max-h-[180px]">
          <ellipse cx="100" cy="40" rx={Math.max(20, thickness * 1.2)} ry={Math.max(8, thickness * 0.4)} fill="var(--color-hairline)" stroke="var(--color-muted)" strokeWidth="1.5" />
          <path d={`M${100 - (thickness * 1.2)},40 L${100 - (thickness * 1.2)},${40 + (length * 10)} A${thickness * 1.2},${thickness * 0.4} 0 0,0 ${100 + (thickness * 1.2)},${40 + (length * 10)} L${100 + (thickness * 1.2)},40 Z`} fill="var(--color-surface-strong)" fillOpacity="0.8" stroke="var(--color-muted)" strokeWidth="1.5" />
          <text x="100" y="25" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">D: {thickness} {isMetric ? 'cm' : 'in'}</text>
          <text x={115 + (thickness * 1.2)} y={40 + (length * 5)} fontSize="10" fill="var(--color-brand-accent)" className="font-mono font-bold">H: {length} {isMetric ? 'm' : 'ft'}</text>
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
      {/* Diameter */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Column/Hole Diameter ({isMetric ? 'cm' : 'inches'})</label>
          <span className="font-mono font-semibold text-brand-accent">{thickness} {isMetric ? 'cm' : 'in'}</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="6" 
            max={isMetric ? 100 : 36} 
            step="1"
            value={thickness}
            onChange={(e) => setThickness(parseInt(e.target.value) || 0)}
            className="flex-grow accent-indigo-600 dark:accent-indigo-400"
          />
          <input 
            type="number"
            value={thickness}
            onChange={(e) => setThickness(parseInt(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded px-2.5 py-1 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Height */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="font-medium text-ink">Column Height/Depth ({isMetric ? 'meters' : 'feet'})</label>
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
