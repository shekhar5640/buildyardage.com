import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trash2, Printer, Plus, History, CheckSquare, Square, 
  ShoppingBag, Eye, Ruler, AlertCircle
} from 'lucide-react';
import { 
  type ConcreteSlabResult,
  type ConcreteColumnResult,
  type GravelResult,
  type DrywallResult,
  type FramingResult,
  type RebarResult
} from '../utils/calcEngine';

export interface HistoryItem {
  id: string;
  slug: string;
  material: string;
  shape: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  isMetric: boolean;
  timestamp: number;
}

export interface ShoppingItem {
  id: string;
  slug: string;
  material: string;
  shape: string;
  type: string;
  title: string;
  details: string;
  checked: boolean;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  isMetric?: boolean;
  unitPrice?: number;
  estimatedCost?: number;
}

export function fillLegacyItemData(item: ShoppingItem): ShoppingItem {
  const type = item.type || '';
  const inputs = item.inputs || {};
  const outputs = item.outputs || {};
  const isMetric = item.isMetric || false;

  const unitPrice = item.unitPrice !== undefined ? item.unitPrice : (inputs.pricePerUnit !== undefined ? inputs.pricePerUnit : undefined);
  let estimatedCost = item.estimatedCost;
  if (estimatedCost === undefined && outputs && unitPrice !== undefined) {
    if (type === 'rectangular' || type === 'cylindrical') {
      const qty = isMetric ? (outputs.cubicMeters || 0) : (outputs.cubicYards || 0);
      estimatedCost = parseFloat((qty * unitPrice).toFixed(2));
    } else if (type === 'gravel-rect') {
      estimatedCost = parseFloat(((outputs.tons || 0) * unitPrice).toFixed(2));
    } else if (type === 'drywall') {
      estimatedCost = parseFloat(((outputs.sheetsNeeded || 0) * unitPrice).toFixed(2));
    } else if (type === 'framing') {
      const qty = (outputs.studsCount || 0) + (outputs.topPlates16ft || 0) + (outputs.bottomPlates16ft || 0);
      estimatedCost = parseFloat((qty * unitPrice).toFixed(2));
    } else if (type === 'rebar') {
      estimatedCost = parseFloat(((outputs.totalPieces || 0) * unitPrice).toFixed(2));
    }
  }

  return {
    ...item,
    type,
    inputs: {
      ...inputs,
      pricePerUnit: unitPrice
    },
    outputs,
    isMetric,
    unitPrice,
    estimatedCost
  };
}

function renderPrintSVG(item: ShoppingItem) {
  const { type, inputs = {}, isMetric = false } = item;
  const length = inputs.length || 0;
  const width = inputs.width || 0;
  const thickness = inputs.thickness || 0;
  const drywallWidth = inputs.drywallWidth || 0;
  const sheetSize = inputs.sheetSize || '4x8';
  const studSpacing = inputs.studSpacing || 16;
  
  if (type === 'rectangular') {
    return (
      <svg viewBox="0 0 300 180" className="w-full max-h-[140px]">
        <polygon points="150,30 240,65 150,100 60,65" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
        <polygon points={`60,65 150,100 150,${100 + (thickness * 0.8)} 60,${65 + (thickness * 0.8)}`} fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        <polygon points={`150,100 240,65 240,${65 + (thickness * 0.8)} 150,${100 + (thickness * 0.8)}`} fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
        <text x="75" y="105" fontSize="10" fill="#000000" className="font-mono font-bold">L: {length} {isMetric ? 'm' : 'ft'}</text>
        <text x="210" y="105" fontSize="10" fill="#000000" className="font-mono font-bold">W: {width} {isMetric ? 'm' : 'ft'}</text>
        <text x="155" y={115 + (thickness * 0.5)} fontSize="9" fill="#4f46e5" className="font-mono font-bold">T: {thickness} {isMetric ? 'cm' : 'in'}</text>
      </svg>
    );
  }

  if (type === 'cylindrical') {
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
      <svg viewBox="0 0 240 180" className="w-full max-h-[140px]">
        <ellipse cx={cx} cy={topY} rx={radiusX} ry={radiusY} fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
        <path d={`M ${leftX} ${topY} L ${leftX} ${bottomY} A ${radiusX} ${radiusY} 0 0 0 ${rightX} ${bottomY} L ${rightX} ${topY} Z`} fill="#cbd5e1" fillOpacity="0.8" stroke="#475569" strokeWidth="1.5" />
        <text x={cx} y={Math.max(16, topY - radiusY - 6)} textAnchor="middle" fontSize="11" fill="#000000" className="font-mono font-bold">Dia: {thickness} {isMetric ? 'cm' : 'in'}</text>
        <text x={rightX + 10} y={topY + columnHeight / 2 + 4} textAnchor="start" fontSize="10" fill="#4f46e5" className="font-mono font-bold">H: {length} {isMetric ? 'm' : 'ft'}</text>
      </svg>
    );
  }

  if (type === 'gravel-rect') {
    return (
      <svg viewBox="0 0 300 180" className="w-full max-h-[140px]">
        <defs>
          <pattern id={`print-gravel-pat-${item.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#64748b" />
            <circle cx="7" cy="5" r="1" fill="#334155" />
            <circle cx="4" cy="8" r="1.2" fill="#94a3b8" />
          </pattern>
        </defs>
        <polygon points="150,30 240,65 150,100 60,65" fill={`url(#print-gravel-pat-${item.id})`} stroke="#475569" strokeWidth="1.5" />
        <polygon points={`60,65 150,100 150,${100 + (thickness * 0.8)} 60,${65 + (thickness * 0.8)}`} fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        <polygon points={`150,100 240,65 240,${65 + (thickness * 0.8)} 150,${100 + (thickness * 0.8)}`} fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
        <text x="75" y="105" fontSize="10" fill="#000000" className="font-mono font-bold">L: {length} {isMetric ? 'm' : 'ft'}</text>
        <text x="210" y="105" fontSize="10" fill="#000000" className="font-mono font-bold">W: {width} {isMetric ? 'm' : 'ft'}</text>
        <text x="155" y={115 + (thickness * 0.5)} fontSize="9" fill="#4f46e5" className="font-mono font-bold">Depth: {thickness} {isMetric ? 'cm' : 'in'}</text>
      </svg>
    );
  }

  if (type === 'drywall') {
    return (
      <svg viewBox="0 0 240 140" className="w-full max-h-[140px]">
        <rect x="30" y="20" width="180" height="90" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
        <line x1="75" y1="20" x2="75" y2="110" stroke="#94a3b8" strokeDasharray="3" />
        <line x1="120" y1="20" x2="120" y2="110" stroke="#94a3b8" strokeDasharray="3" />
        <line x1="165" y1="20" x2="165" y2="110" stroke="#94a3b8" strokeDasharray="3" />
        <text x="120" y="125" textAnchor="middle" fontSize="10" fill="#000000" className="font-mono font-bold">W: {length} {isMetric ? 'm' : 'ft'}</text>
        <text x="15" y="70" textAnchor="middle" fontSize="10" fill="#000000" className="font-mono font-bold" transform="rotate(-90,15,70)">H: {thickness} {isMetric ? 'm' : 'ft'}</text>
      </svg>
    );
  }

  if (type === 'framing') {
    const calculatedBars = Math.ceil(length * (studSpacing === 16 ? 0.75 : 0.5));
    const numStuds = Math.max(5, Math.min(18, calculatedBars));
    const plateLeft = 20;
    const plateWidth = 260;
    const studWidth = 4;
    const usableWidth = plateWidth - studWidth; // 256

    return (
      <svg viewBox="0 0 300 120" className="w-full max-h-[140px]">
        <rect x={plateLeft} y="15" width={plateWidth} height="4" fill="#ddd" stroke="#475569" strokeWidth="0.5" />
        <rect x={plateLeft} y="20" width={plateWidth} height="4" fill="#ddd" stroke="#475569" strokeWidth="0.5" />
        <rect x={plateLeft} y="95" width={plateWidth} height="4" fill="#ddd" stroke="#475569" strokeWidth="0.5" />
        {Array.from({ length: numStuds }).map((_, idx) => {
          const xPos = plateLeft + (idx * (usableWidth / (numStuds - 1)));
          return <rect key={idx} x={xPos} y="24" width={studWidth} height="71" fill="#bbb" stroke="#475569" strokeWidth="0.5" />;
        })}
        <text x="150" y="112" textAnchor="middle" fontSize="10" fill="#000000" className="font-mono font-bold">Wall Length: {length} {isMetric ? 'm' : 'ft'}</text>
      </svg>
    );
  }

  if (type === 'rebar') {
    const spacing = inputs.rebarSpacing || 12;
    return (
      <svg viewBox="0 0 300 180" className="w-full max-h-[140px]">
        <polygon points="150,30 240,65 150,100 60,65" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
        <polygon points="60,65 150,100 150,110 60,75" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        <polygon points="150,100 240,65 240,75 150,110" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />

        {[0.2, 0.4, 0.6, 0.8].map((u, i) => {
          const x1 = 150 + u * -90 + 0.08 * 90;
          const y1 = 30 + u * 35 + 0.08 * 35;
          const x2 = 150 + u * -90 + 0.92 * 90;
          const y2 = 30 + u * 35 + 0.92 * 35;
          return <line key={`len-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />;
        })}
        {[0.2, 0.4, 0.6, 0.8].map((v, i) => {
          const x1 = 150 + 0.08 * -90 + v * 90;
          const y1 = 30 + 0.08 * 35 + v * 35;
          const x2 = 150 + 0.92 * -90 + v * 90;
          const y2 = 30 + 0.92 * 35 + v * 35;
          return <line key={`wid-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />;
        })}

        <text x="75" y="105" fontSize="10" fill="#000000" className="font-mono font-bold">L: {length} {isMetric ? 'm' : 'ft'}</text>
        <text x="210" y="105" fontSize="10" fill="#000000" className="font-mono font-bold">W: {width} {isMetric ? 'm' : 'ft'}</text>
        <text x="150" y="125" textAnchor="middle" fontSize="9" fill="#4f46e5" className="font-mono font-bold">Grid Spacing: {spacing} {isMetric ? 'cm' : 'in'}</text>
      </svg>
    );
  }

  return null;
}

function renderPrintSpecs(item: ShoppingItem) {
  const { type, inputs = {}, outputs = {} } = item;
  const sheetSize = inputs.sheetSize || '4x8';
  const studSpacing = inputs.studSpacing || 16;
  const corners = inputs.corners || 2;
  const length = inputs.length || 0;
  const isMetric = item.isMetric || false;
  const gravelDensity = inputs.gravelDensity || 1.4;

  if (type === 'rectangular') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Concrete Volume</span>
          <span className="text-sm font-mono font-bold">{outputs.cubicYards} cu yd</span>
        </div>
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Volume (Metric)</span>
          <span className="text-sm font-mono font-bold">{outputs.cubicMeters} m³</span>
        </div>
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">80lb Bags Mix</span>
          <span className="text-sm font-mono font-bold">{outputs.bags80lb} bags</span>
        </div>
        {item.unitPrice !== undefined && item.unitPrice !== null && item.estimatedCost !== undefined && item.estimatedCost !== null && (
          <div className="border-b border-zinc-100 pb-2">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Price & Est. Cost</span>
            <span className="text-sm font-mono font-bold">${Number(item.unitPrice).toFixed(2)}/yd³ (${Number(item.estimatedCost).toFixed(2)})</span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'cylindrical') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Concrete Volume</span>
          <span className="text-sm font-mono font-bold">{outputs.cubicYards} cu yd</span>
        </div>
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">80lb Bags Mix</span>
          <span className="text-sm font-mono font-bold">{outputs.bags80lb} bags</span>
        </div>
        {item.unitPrice !== undefined && item.unitPrice !== null && item.estimatedCost !== undefined && item.estimatedCost !== null && (
          <div className="border-b border-zinc-100 pb-2">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Price & Est. Cost</span>
            <span className="text-sm font-mono font-bold">${Number(item.unitPrice).toFixed(2)}/yd³ (${Number(item.estimatedCost).toFixed(2)})</span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'gravel-rect') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Gravel Tons</span>
          <span className="text-sm font-mono font-bold">{outputs.tons} tons</span>
        </div>
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Gravel Density</span>
          <span className="text-sm font-mono font-bold">{gravelDensity} t/yd³</span>
        </div>
        {item.unitPrice !== undefined && item.unitPrice !== null && item.estimatedCost !== undefined && item.estimatedCost !== null && (
          <div className="border-b border-zinc-100 pb-2">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Price & Est. Cost</span>
            <span className="text-sm font-mono font-bold">${Number(item.unitPrice).toFixed(2)}/ton (${Number(item.estimatedCost).toFixed(2)})</span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'drywall') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Sheets Needed</span>
          <span className="text-sm font-mono font-bold">{outputs.sheetsNeeded} ({sheetSize})</span>
        </div>
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Joint Tape</span>
          <span className="text-sm font-mono font-bold">{outputs.tapeFeet} ft</span>
        </div>
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Joint Compound</span>
          <span className="text-sm font-mono font-bold">{outputs.compoundLbs} lbs</span>
        </div>
        {item.unitPrice !== undefined && item.unitPrice !== null && item.estimatedCost !== undefined && item.estimatedCost !== null && (
          <div className="border-b border-zinc-100 pb-2">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Price & Est. Cost</span>
            <span className="text-sm font-mono font-bold">${Number(item.unitPrice).toFixed(2)}/sheet (${Number(item.estimatedCost).toFixed(2)})</span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'framing') {
    const totalP = (outputs.topPlates16ft || 0) + (outputs.bottomPlates16ft || 0);
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Studs Count</span>
          <span className="text-sm font-mono font-bold">{outputs.studsCount} pcs</span>
        </div>
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Plates (16ft)</span>
          <span className="text-sm font-mono font-bold">{totalP} pcs</span>
        </div>
        {item.unitPrice !== undefined && item.unitPrice !== null && item.estimatedCost !== undefined && item.estimatedCost !== null && (
          <div className="border-b border-zinc-100 pb-2">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Price & Est. Cost</span>
            <span className="text-sm font-mono font-bold">${Number(item.unitPrice).toFixed(2)}/pcs (${Number(item.estimatedCost).toFixed(2)})</span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'rebar') {
    const clearanceText = isMetric ? `${inputs.thickness} cm` : `${inputs.thickness} in`;
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Total sticks</span>
          <span className="text-sm font-mono font-bold">{outputs.totalPieces} pcs</span>
        </div>
        <div className="border-b border-zinc-100 pb-2">
          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Edge Clearance</span>
          <span className="text-sm font-mono font-bold">{clearanceText}</span>
        </div>
        {item.unitPrice !== undefined && item.unitPrice !== null && item.estimatedCost !== undefined && item.estimatedCost !== null && (
          <div className="border-b border-zinc-100 pb-2">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Price & Est. Cost</span>
            <span className="text-sm font-mono font-bold">${Number(item.unitPrice).toFixed(2)}/stick (${Number(item.estimatedCost).toFixed(2)})</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}

import { getTranslations, getLocaleFromUrl, type SupportedLocale } from '../i18n/utils';

export interface HistoryItem {
  id: string;
  slug: string;
  material: string;
  shape: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  isMetric: boolean;
  timestamp: number;
}

export interface ShoppingItem {
  id: string;
  slug: string;
  material: string;
  shape: string;
  type: string;
  title: string;
  details: string;
  checked: boolean;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  isMetric?: boolean;
  unitPrice?: number;
  estimatedCost?: number;
}

interface CalculatorShellProps {
  type: string;
  material: string;
  shape: string;
  slug: string;
  locale?: string;
  
  isMetric: boolean;
  setIsMetric: (val: boolean) => void;
  waste: number;
  setWaste: (val: number) => void;
  priceInput: string;
  setPriceInput: (val: string) => void;
  pricePerUnit: number;
  
  results: any;
  onAdd: () => ShoppingItem | void;
  onRestore: (inputs: Record<string, any>, isMetric: boolean) => void;
  
  children: React.ReactNode; // Inputs
  renderVisualizer: () => React.ReactNode;
  renderOutputs: () => React.ReactNode;
}

export default function CalculatorShell({
  type,
  material,
  shape,
  slug,
  locale,
  
  isMetric,
  setIsMetric,
  waste,
  setWaste,
  priceInput,
  setPriceInput,
  pricePerUnit,
  
  results,
  onAdd,
  onRestore,
  
  children,
  renderVisualizer,
  renderOutputs
}: CalculatorShellProps) {
  const activeLocale = (locale || (typeof window !== 'undefined' ? getLocaleFromUrl(window.location.pathname) : 'en')) as SupportedLocale;
  const t = getTranslations(activeLocale);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [printDate, setPrintDate] = useState<string>('');

  // Load cache on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('buildyardage_history');
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        setHistory(Array.isArray(parsed) ? parsed.slice(0, 3) : []);
      }

      const storedList = localStorage.getItem('buildyardage_shopping');
      if (storedList) setShoppingList(JSON.parse(storedList));

      setPrintDate(new Date().toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    } catch (e) {
      console.error('LocalStorage hydration failed:', e);
    }
  }, []);

  // Sync helpers
  const saveShoppingList = (newList: ShoppingItem[]) => {
    setShoppingList(newList);
    try {
      localStorage.setItem('buildyardage_shopping', JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const saveHistory = (newHistList: HistoryItem[]) => {
    const trimmed = newHistList.slice(0, 3);
    setHistory(trimmed);
    try {
      localStorage.setItem('buildyardage_history', JSON.stringify(trimmed));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = (newItem?: ShoppingItem) => {
    const itemToAdd = newItem || onAdd();
    if (itemToAdd) {
      saveShoppingList([itemToAdd, ...shoppingList]);
      const newHist: HistoryItem = {
        id: Date.now().toString(),
        slug,
        material,
        shape,
        inputs: itemToAdd.inputs || {},
        outputs: itemToAdd.outputs || {},
        isMetric,
        timestamp: Date.now()
      };
      saveHistory([newHist, ...history.slice(0, 2)]);
    }
  };

  // Budget calculations
  const grandTotalCost = useMemo(() => {
    return shoppingList
      .filter((item) => item.checked)
      .reduce((sum, rawItem) => {
        const item = fillLegacyItemData(rawItem);
        return sum + (item.estimatedCost || 0);
      }, 0);
  }, [shoppingList]);

  // Actions
  const toggleShoppingItem = (id: string) => {
    const updated = shoppingList.map((item) => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    saveShoppingList(updated);
  };

  const removeShoppingItem = (id: string) => {
    const filtered = shoppingList.filter((item) => item.id !== id);
    saveShoppingList(filtered);
  };

  const clearShoppingList = () => {
    saveShoppingList([]);
  };

  const restoreCalculation = (item: HistoryItem) => {
    const confirmRestore = window.confirm(
      `Restore dimensions for ${item.material} ${item.shape}?\n\nThis will overwrite your current calculator inputs with the saved dimensions.`
    );
    if (confirmRestore) {
      setIsMetric(item.isMetric);
      if (item.inputs.waste !== undefined) setWaste(item.inputs.waste);
      if (item.inputs.pricePerUnit !== undefined) setPriceInput(item.inputs.pricePerUnit.toString());
      else setPriceInput("");
      onRestore(item.inputs, item.isMetric);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Metric Toggle inside parent shell
  const handleUnitToggle = () => {
    setIsMetric(!isMetric);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Upper Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 print-full-width no-print">
        
        {/* COLUMN 1: Inputs Panel (4 cols) */}
        <section className="lg:col-span-4 bg-canvas border border-hairline rounded-lg p-6 flex flex-col justify-between shadow-sm calculator-inputs">
          <div>
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <h2 className="text-md font-bold text-ink flex items-center gap-2">
                <Ruler size={18} className="text-brand-accent" />
                <span>{t.calculatorShell.inputsHeader}</span>
              </h2>
              {/* Unit Toggle Switch */}
              <button 
                onClick={handleUnitToggle}
                className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-hairline bg-surface-soft text-ink hover:bg-hairline active:scale-95 transition-all cursor-pointer"
              >
                <span>{isMetric ? t.calculatorShell.metric : t.calculatorShell.imperial}</span>
              </button>
            </div>

            {/* Form Inputs (Children) */}
            <div className="space-y-6">
              {children}

              {/* Waste Factor Slider */}
              <div className="space-y-2 border-t border-hairline pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <label className="font-semibold text-ink">{t.calculatorShell.wasteMargin} (%)</label>
                  <span className="font-mono font-bold text-red-500">+{waste}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={waste}
                  onChange={(e) => setWaste(parseInt(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAddItem()}
            className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-md shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>{t.calculatorShell.addToTakeoff}</span>
          </button>
        </section>

        {/* COLUMN 2: Visualizer & Outputs (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6 print-card-border">
          {/* Dynamic SVG Visualizer Panel */}
          <div className="bg-surface-card border border-hairline rounded-lg p-5 flex items-center justify-center min-h-[220px]">
            {renderVisualizer()}
          </div>

          {/* Core Calculation Outputs Card */}
          <div className="bg-canvas border border-hairline rounded-lg p-6 flex flex-col justify-between flex-grow shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">{t.calculatorShell.resultsHeader}</h3>
              
              <div className="space-y-4">
                {renderOutputs()}

                {/* Pricing Input & Cost Estimation */}
                {results && (
                  <div className="border-t border-hairline pt-4 mt-6 space-y-4">
                    {/* Unit Price input row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                      <label className="text-sm font-semibold text-ink">
                        {t.calculatorShell.pricePerUnit}
                      </label>
                      <div className="relative rounded-md shadow-sm w-full sm:w-36">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-muted-soft text-xs">$</span>
                        </div>
                        <input 
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          className="w-full text-sm font-mono border border-hairline rounded pl-7 pr-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent text-left sm:text-right"
                        />
                      </div>
                    </div>

                    {/* Estimated Cost row (calculated only if a price is entered) */}
                    {pricePerUnit > 0 && (results as any).estimatedCost !== undefined && (
                      <div className="flex justify-between items-baseline pt-2">
                        <span className="text-sm text-ink font-bold">{t.calculatorShell.estimatedCost}</span>
                        <span className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                          ${(results as any).estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Note on Waste Margin */}
            <div className="mt-6 p-3 bg-red-50 dark:bg-zinc-900 border border-red-100 dark:border-zinc-800 rounded flex gap-2.5 items-start">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span className="text-xs text-red-700 dark:text-zinc-400">
                Calculations include a <strong>{waste}% waste margin</strong>.
              </span>
            </div>
          </div>
        </section>

        {/* COLUMN 3: Shopping List & History (3 cols) */}
        <section className="lg:col-span-3 flex flex-col gap-6 print-full-width">
          {/* Jobsite Shopping List Sidebar Card */}
          <div className="bg-canvas border border-hairline rounded-lg p-5 flex flex-col shadow-sm shopping-list-print">
            <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4 no-print">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <ShoppingBag size={16} className="text-brand-accent" />
                <span>{t.calculatorShell.takeoffTitle}</span>
              </h3>
              {shoppingList.length > 0 && (
                <button 
                  onClick={clearShoppingList}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>{t.calculatorShell.clearTakeoff}</span>
                </button>
              )}
            </div>

            {/* Printable checklist header */}
            <div className="hidden print:block pb-4 mb-4 border-b border-black">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">Build Yardage</h2>
              <h3 className="text-md font-bold text-black mt-1">{t.calculatorShell.takeoffTitle}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Printed on: {printDate}</p>
            </div>

            {/* Shopping List Items */}
            {shoppingList.length === 0 ? (
              <div className="text-center py-8 text-muted no-print">
                <p className="text-xs">{t.calculatorShell.noTakeoffItems}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ul className="space-y-3">
                  {shoppingList.map((item) => (
                    <li 
                      key={item.id} 
                      className="flex items-start justify-between gap-3 text-xs border-b border-hairline-soft pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-2">
                        {/* Checkbox */}
                        <button 
                          onClick={() => toggleShoppingItem(item.id)}
                          className="text-muted hover:text-brand-accent mt-0.5 shrink-0 no-print cursor-pointer"
                        >
                          {item.checked ? (
                            <CheckSquare size={14} className="text-brand-accent" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                        <div className="hidden print:block border border-black h-4.5 w-4.5 shrink-0 mr-1 mt-0.5"></div>
                        
                        <div>
                          <p className={`font-semibold text-ink print-text-black ${item.checked ? '' : 'line-through opacity-50'}`}>
                            {item.title}
                          </p>
                          <p className="text-[10px] text-muted font-mono mt-0.5 print-text-black">
                            {item.details}
                          </p>
                          {item.estimatedCost !== undefined && item.estimatedCost !== null && (
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1 print-text-black">
                              Cost: ${Number(item.estimatedCost).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Remove individual item */}
                      <button 
                        onClick={() => removeShoppingItem(item.id)}
                        className="text-muted-soft hover:text-red-500 shrink-0 mt-0.5 no-print cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Grand Total Cost Summary */}
                {grandTotalCost > 0 && (
                  <div className="border-t border-hairline pt-3 mt-3 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider">{t.calculatorShell.totalProjectCost}</span>
                    <span className="text-sm font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                      ${grandTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {/* Print & PDF Action */}
                <button
                  onClick={handlePrint}
                  className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 px-3 border border-hairline hover:bg-surface-soft text-ink font-semibold rounded text-xs transition-all active:scale-95 duration-100 no-print cursor-pointer"
                >
                  <Printer size={13} />
                  <span>{t.calculatorShell.printTakeoff}</span>
                </button>
              </div>
            )}
          </div>

          {/* History / Local Cache Panel (no-print) */}
          <div className="bg-canvas border border-hairline rounded-lg p-5 flex flex-col shadow-sm history-panel no-print">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-hairline pb-3 mb-4">
              <History size={16} className="text-zinc-500" />
              <span>{t.calculatorShell.history}</span>
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-muted text-center py-6">No recent calculations.</p>
            ) : (
              <ul className="space-y-3">
                {history.map((item) => (
                  <li key={item.id} className="text-xs">
                    <button
                      onClick={() => restoreCalculation(item)}
                      className="w-full text-left p-2.5 rounded border border-hairline bg-surface-soft hover:bg-hairline hover:border-muted-soft transition-all duration-150 flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold text-ink group-hover:text-brand-accent transition-colors">
                          {item.material} {item.shape}
                        </span>
                        <span className="block text-[10px] text-muted mt-0.5">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <Eye size={12} className="text-muted-soft opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        
      </div>

      {/* Printable checklist container (only visible on print, spans full page width) */}
      <div className="hidden print:block print-only-checklist w-full max-w-4xl mx-auto p-8 bg-white text-black font-sans">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight font-sans flex items-center gap-2 select-none">
              <img src="/favicon.svg" alt="Build Yardage Logo" className="h-7 w-7" />
              <span>
                <span className="text-black">Build</span>
                <span style={{ color: '#4f46e5' }}>yardage</span>
              </span>
            </h1>
            <p className="text-xs text-zinc-600 mt-1 font-sans">High-Performance Aggregates & Material Estimator</p>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">URL: www.buildyardage.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-md font-bold uppercase tracking-wider text-indigo-600">Jobsite Estimates Report</h2>
            <p className="text-xs text-zinc-500 mt-1">Printed on: {printDate}</p>
          </div>
        </div>

        {/* Contractor Estimation Guide & Best Practices */}
        <div className="mb-10 border border-zinc-200 bg-zinc-50 rounded-lg p-8 page-break-inside-avoid text-zinc-800 text-xs">
          <div className="border-b border-zinc-200 pb-4 mb-5">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider">Contractor Reference Manual</h4>
              <span className="text-[9px] text-zinc-400 font-mono">Doc ID: BY-REF-001</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-950 mt-1">General Estimation & Best Practices Manual</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-sans mt-2">
              This manual provides standard calculations, material density guidelines, and field-tested waste margins to assist in jobsite material ordering. All calculations are mathematical approximations based on dimensional inputs and standard contractor allowances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Waste Factors & Allowances */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10px] border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                Waste Factor Allowances
              </h4>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Ordering exact volume leads to shortages due to form bowing, compaction, and spills:
              </p>
              <ul className="space-y-1.5 text-[11px] text-zinc-700 font-sans pl-1">
                <li><strong>Slabs & Driveways:</strong> +10% waste buffer to account for sub-grade variation.</li>
                <li><strong>Columns & Sonotubes:</strong> +5% to 10% waste buffer depending on hole smoothness.</li>
                <li><strong>Gravel Bases:</strong> +10% to 15% to compensate for compaction sinking.</li>
                <li><strong>Drywall Panels:</strong> +10% cuts, off-angles & window header waste.</li>
                <li><strong>Wood Framing:</strong> +10% plates, blocking & warped stud allowance.</li>
                <li><strong>Steel Rebar:</strong> +10% overlap splice and grid edge trim margins.</li>
              </ul>
            </div>

            {/* Column 2: Materials & Density Conversions */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10px] border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Reference Constants
              </h4>
              <div className="space-y-2 text-[11px] text-zinc-700 font-sans">
                <div>
                  <span className="font-bold text-zinc-900 block">Concrete Weight (Standard):</span>
                  1 Cubic Yard ≈ 4,050 lbs (approx. 2.025 Tons) of cured standard weight mix.
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block">Gravel Bulk Density:</span>
                  1 Cubic Yard of compacted gravel subbase ≈ 2,800 lbs (approx. 1.4 Tons).
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block">Pre-mix Bag Coverage Yield:</span>
                  80lb bag = 0.60 cu ft | 60lb bag = 0.45 cu ft | 40lb bag = 0.30 cu ft.
                </div>
              </div>
            </div>

            {/* Column 3: Wall & Drywall Estimating Rules */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10px] border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Site Estimation Rules
              </h4>
              <div className="space-y-2 text-[11px] text-zinc-700 font-sans">
                <div>
                  <span className="font-bold text-zinc-900 block">Wall Studs (16" O.C. Layout):</span>
                  Calculate 1 stud per linear foot of wall length + 2 extra studs per corner or intersection.
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block">Drywall Seam & mud Estimation:</span>
                  Approx. 75 ft of joint tape & 0.05 lbs of joint compound per 100 sq ft of sheet surface.
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block">Drywall Screws Coverage:</span>
                  Approx. 30 screws needed per 4ft x 8ft panel (spaced 12" O.C. on studs).
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="mt-6 pt-4 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
            <p className="leading-normal">
              <strong>Checklist Guide:</strong> Aggregates, pricing, and project budgets are calculated live from jobsite dimensions. Please verify all volume and structural tolerances with your supplier before ordering.
            </p>
            <div className="p-2.5 bg-white border border-zinc-200 rounded font-mono text-zinc-600 flex gap-4 shrink-0">
              <span>Unit System: {isMetric ? 'Metric' : 'Imperial'}</span>
              <span>Default Margin: +{waste}%</span>
            </div>
          </div>
        </div>

        {/* Section 1: Detailed Calculation Cards List */}
        <div className="space-y-8">
          <h2 className="text-md font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-1 mb-4">
            Compiled Project Specifications
          </h2>
          
          {shoppingList.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center border border-dashed border-zinc-200 rounded">
              No materials added to your jobsite checklist yet.
            </p>
          ) : (
            <div className="space-y-6">
              {shoppingList.map((rawItem) => {
                const item = fillLegacyItemData(rawItem);
                return (
                  <div key={item.id} className="print-card-container border border-zinc-300 rounded-lg p-5 bg-white page-break-inside-avoid">
                    {/* Item Header */}
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          {item.material}
                        </span>
                        <h3 className="text-xs font-bold text-zinc-900">{item.title}</h3>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono">ID: #{item.id.slice(-6)}</span>
                    </div>

                    {/* SVG & Specs grid */}
                    {item.inputs && item.outputs ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* SVG Visualizer (Left) */}
                        <div className="flex items-center justify-center bg-zinc-50 border border-zinc-100 rounded-md p-3 min-h-[140px]">
                          {renderPrintSVG(item)}
                        </div>

                        {/* Detailed Output Grid (Right) */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Estimated Specifications</h4>
                          {renderPrintSpecs(item)}
                          <span className="text-[9px] text-zinc-400 font-sans block leading-relaxed mt-1">
                            * Output includes waste factor (+{item.inputs.waste || 10}%). Inputs: {
                              item.type === 'cylindrical' 
                                ? `Dia: ${item.inputs.thickness}${item.isMetric ? 'cm' : 'in'}, H: ${item.inputs.length}${item.isMetric ? 'cm' : 'in'}` 
                                : item.type === 'framing'
                                ? `L: ${item.inputs.length}${item.isMetric ? 'm' : 'ft'}, Spacing: ${item.inputs.studSpacing || 16}" o.c.`
                                : item.type === 'rebar'
                                ? `Grid: ${item.inputs.length}x${item.inputs.width}${item.isMetric ? 'm' : 'ft'}, Clearance: ${item.inputs.thickness}${item.isMetric ? 'cm' : 'in'}, Spacing: ${item.inputs.rebarSpacing}${item.isMetric ? 'cm' : 'in'}`
                                : `${item.inputs.length}x${item.type === 'drywall' ? item.inputs.drywallWidth : item.inputs.width}x${item.inputs.thickness} ${item.isMetric ? 'm/cm' : 'ft/in'}`
                            }.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-700 font-mono bg-zinc-50 p-2 rounded">
                        {item.details}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Printable Grand Budget Summary */}
              {grandTotalCost > 0 && (
                <div className="border border-zinc-300 rounded-lg p-5 bg-zinc-50 flex items-center justify-between page-break-inside-avoid shadow-inner">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Jobsite Project Budget Summary</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Calculated total of all checked estimates</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-400 block uppercase">Project Budget</span>
                    <span className="text-xl font-mono font-extrabold text-indigo-700">
                      ${grandTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Jobsite Notes */}
        <div className="border border-zinc-300 p-4 rounded-md mt-8 page-break-inside-avoid">
          <h3 className="text-xs font-bold uppercase text-zinc-700 mb-2">Jobsite Notes</h3>
          <div className="h-12 border-b border-dashed border-zinc-300 mb-3"></div>
          <div className="h-12 border-b border-dashed border-zinc-300 mb-3"></div>
          <div className="h-12 border-b border-dashed border-zinc-300"></div>
        </div>

        {/* Section 3: Disclaimer Footer */}
        <div className="border-t border-zinc-300 pt-4 text-[9px] text-zinc-500 leading-relaxed page-break-inside-avoid mt-8">
          <p><strong>Disclaimer:</strong> This material estimate report compiles mathematical material calculations based on inputs provided by the user. These figures are approximations and include waste margin factors. Field conditions, sub-grade variations, structural reinforcements, and contractor practices can affect actual quantities needed. Consult a licensed contractor or local building supplier to verify ordering requirements before purchasing material.</p>
          <p className="mt-1 text-right text-zinc-400 font-mono">buildyardage.com</p>
        </div>
      </div>
    </div>
  );
}
