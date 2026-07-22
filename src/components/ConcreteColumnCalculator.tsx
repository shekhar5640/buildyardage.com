import React, { useState, useMemo } from 'react';
import { calculateConcreteColumn, type ConcreteColumnResult } from '../utils/calcEngine';
import CalculatorShell, { type ShoppingItem } from './CalculatorShell';

interface ConcreteColumnProps {
  initialDiameter?: number;
  initialDepth?: number;
}

export default function ConcreteColumnCalculator({
  initialDiameter = 12,
  initialDepth = 8
}: ConcreteColumnProps) {
  const [length, setLength] = useState<number>(initialDepth); // depth/height
  const [thickness, setThickness] = useState<number>(initialDiameter); // diameter
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

  const handleAdd = (): ShoppingItem => {
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

    return newItem;
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
      renderVisualizer={() => {
        const minD = isMetric ? 10 : 4;
        const maxD = isMetric ? 120 : 48;
        const normalizedD = Math.max(0, Math.min(1, (thickness - minD) / (maxD - minD)));
        const radiusX = 18 + normalizedD * (48 - 18);
        const radiusY = Math.max(6, radiusX * 0.28);

        const minH = isMetric ? 0.5 : 1;
        const maxH = isMetric ? 10 : 30;
        const normalizedH = Math.max(0, Math.min(1, (length - minH) / (maxH - minH)));
        const columnHeight = 35 + normalizedH * (85 - 35);

        // Vertical centering in 180px viewBox
        const topY = Math.round((180 - columnHeight) / 2);
        const bottomY = topY + columnHeight;

        // Horizontal centering around cx=100 so cylinder + right text is centered in 240px viewBox
        const cx = 100;
        const leftX = cx - radiusX;
        const rightX = cx + radiusX;

        return (
          <svg viewBox="0 0 240 180" className="w-full max-h-[180px]">
            {/* Top Cap Ellipse */}
            <ellipse 
              cx={cx} 
              cy={topY} 
              rx={radiusX} 
              ry={radiusY} 
              fill="var(--color-hairline)" 
              stroke="var(--color-muted)" 
              strokeWidth="1.5" 
            />
            
            {/* Column Main Cylinder Body */}
            <path 
              d={`M ${leftX} ${topY} L ${leftX} ${bottomY} A ${radiusX} ${radiusY} 0 0 0 ${rightX} ${bottomY} L ${rightX} ${topY} Z`} 
              fill="var(--color-surface-strong)" 
              fillOpacity="0.85" 
              stroke="var(--color-muted)" 
              strokeWidth="1.5" 
            />

            {/* Top Dimension Label: Diameter */}
            <text x={cx} y={Math.max(16, topY - radiusY - 6)} textAnchor="middle" fontSize="11" fill="var(--color-ink)" className="font-mono font-bold">
              Dia: {thickness} {isMetric ? 'cm' : 'in'}
            </text>

            {/* Height Label on right side */}
            <text x={rightX + 10} y={topY + columnHeight / 2 + 4} textAnchor="start" fontSize="10" fill="var(--color-brand-accent)" className="font-mono font-bold">
              H: {length} {isMetric ? 'm' : 'ft'}
            </text>
          </svg>
        );
      }}
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
