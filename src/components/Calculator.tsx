import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trash2, Printer, Plus, History, CheckSquare, Square, 
  Hammer, Ruler, Layers, AlertCircle, ShoppingBag, Eye 
} from 'lucide-react';
import { 
  calculateConcreteSlab, 
  calculateConcreteColumn, 
  calculateGravel, 
  calculateDrywall, 
  calculateFraming 
} from '../utils/calcEngine';

interface CalculatorProps {
  slug: string;
  material: string;
  shape: string;
  type: string;
  defaultWastePercent: number;
  defaultThickness: number;
}

interface HistoryItem {
  id: string;
  slug: string;
  material: string;
  shape: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  isMetric: boolean;
  timestamp: number;
}

interface ShoppingItem {
  id: string;
  slug: string;
  title: string;
  material: string;
  details: string;
  checked: boolean;
}

export default function Calculator({
  slug,
  material,
  shape,
  type,
  defaultWastePercent,
  defaultThickness
}: CalculatorProps) {
  // State for Unit System: Imperial vs Metric
  const [isMetric, setIsMetric] = useState<boolean>(false);

  // States for Calculator Inputs
  const [length, setLength] = useState<number>(type === 'cylindrical' ? 0 : 10);
  const [width, setWidth] = useState<number>(type === 'cylindrical' || type === 'framing' ? 0 : 10);
  const [thickness, setThickness] = useState<number>(defaultThickness || 4); // thickness or height or depth
  const [waste, setWaste] = useState<number>(defaultWastePercent || 10);

  // Drywall specific states
  const [drywallWidth, setDrywallWidth] = useState<number>(12); // width of room
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(true);
  const [sheetSize, setSheetSize] = useState<'4x8' | '4x12'>('4x8');

  // Framing specific states
  const [studSpacing, setStudSpacing] = useState<16 | 24>(16);
  const [corners, setCorners] = useState<number>(2);
  const [topPlates, setTopPlates] = useState<number>(2);
  const [bottomPlates, setBottomPlates] = useState<number>(1);

  // Gravel specific state
  const [gravelDensity, setGravelDensity] = useState<number>(1.4);

  // Local Storage state: History & Shopping List
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [printDate, setPrintDate] = useState<string>("");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('buildyardage_history');
      if (storedHistory) setHistory(JSON.parse(storedHistory));

      const storedList = localStorage.getItem('buildyardage_shopping_list');
      if (storedList) setShoppingList(JSON.parse(storedList));

      setPrintDate(new Date().toLocaleDateString());
    } catch (e) {
      console.error("Error reading localStorage:", e);
    }
  }, []);

  // Save to LocalStorage helpers
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('buildyardage_history', JSON.stringify(newHistory));
  };

  const saveShoppingList = (newList: ShoppingItem[]) => {
    setShoppingList(newList);
    localStorage.setItem('buildyardage_shopping_list', JSON.stringify(newList));
  };

  // Convert inputs on toggle
  const handleUnitToggle = () => {
    setIsMetric(prev => {
      const next = !prev;
      if (next) {
        // Converting Imperial to Metric
        if (type !== 'cylindrical') {
          setLength(parseFloat((length * 0.3048).toFixed(2)));
          if (width > 0) setWidth(parseFloat((width * 0.3048).toFixed(2)));
        }
        // Thickness/Depth/Diameter
        if (type === 'cylindrical') {
          // diameter (in -> cm), height (in -> cm)
          setThickness(parseFloat((thickness * 2.54).toFixed(1))); // diameter
          setLength(parseFloat((length * 2.54).toFixed(1))); // height (stored in length for cylinder)
        } else {
          setThickness(parseFloat((thickness * 2.54).toFixed(1)));
        }
        // Drywall width
        if (type === 'drywall' && drywallWidth > 0) {
          setDrywallWidth(parseFloat((drywallWidth * 0.3048).toFixed(2)));
        }
      } else {
        // Converting Metric to Imperial
        if (type !== 'cylindrical') {
          setLength(parseFloat((length / 0.3048).toFixed(1)));
          if (width > 0) setWidth(parseFloat((width / 0.3048).toFixed(1)));
        }
        // Thickness/Depth/Diameter
        if (type === 'cylindrical') {
          setThickness(parseFloat((thickness / 2.54).toFixed(0)));
          setLength(parseFloat((length / 2.54).toFixed(0)));
        } else {
          setThickness(parseFloat((thickness / 2.54).toFixed(0)));
        }
        // Drywall width
        if (type === 'drywall' && drywallWidth > 0) {
          setDrywallWidth(parseFloat((drywallWidth / 0.3048).toFixed(1)));
        }
      }
      return next;
    });
  };

  // Reset inputs to default on load or page swap
  useEffect(() => {
    setIsMetric(false);
    if (type === 'rectangular') {
      setLength(12);
      setWidth(10);
      setThickness(4);
      setWaste(10);
    } else if (type === 'cylindrical') {
      setThickness(12); // diameter (inches)
      setLength(36); // height/depth (inches)
      setWaste(5);
    } else if (type === 'gravel-rect') {
      setLength(20);
      setWidth(10);
      setThickness(4); // depth in inches
      setWaste(10);
      setGravelDensity(1.4);
    } else if (type === 'drywall') {
      setLength(15); // room length
      setDrywallWidth(12); // room width
      setThickness(8); // room wall height
      setWaste(10);
      setIncludeCeiling(true);
      setSheetSize('4x8');
    } else if (type === 'framing') {
      setLength(20); // wall length
      setStudSpacing(16);
      setCorners(2);
      setTopPlates(2);
      setBottomPlates(1);
      setWaste(10);
    }
  }, [type, defaultThickness, defaultWastePercent]);

  // Math Calculations Engine Hook
  const results = useMemo(() => {
    if (type === 'rectangular') {
      return calculateConcreteSlab(length, width, thickness, waste, isMetric);
    } else if (type === 'cylindrical') {
      // diameter is stored in thickness, height is stored in length
      return calculateConcreteColumn(thickness, length, waste, isMetric);
    } else if (type === 'gravel-rect') {
      return calculateGravel(length, width, thickness, waste, gravelDensity, isMetric);
    } else if (type === 'drywall') {
      return calculateDrywall(length, drywallWidth, thickness, includeCeiling, sheetSize, waste, isMetric);
    } else if (type === 'framing') {
      return calculateFraming(length, studSpacing, corners, topPlates, bottomPlates, waste, isMetric);
    }
    return null;
  }, [
    type, length, width, thickness, waste, isMetric, 
    drywallWidth, includeCeiling, sheetSize, 
    studSpacing, corners, topPlates, bottomPlates, gravelDensity
  ]);

  // Add Current Calculation to Shopping List
  const addToShoppingList = () => {
    if (!results) return;

    let itemTitle = "";
    let itemDetails = "";

    const lUnit = isMetric ? "m" : "ft";
    const tUnit = isMetric ? "cm" : "in";

    if (type === 'rectangular') {
      itemTitle = `${material} ${shape} (${length}${lUnit} x ${width}${lUnit} x ${thickness}${tUnit})`;
      itemDetails = `${results.cubicYards} cu yd (${results.bags80lb} bags of 80lb)`;
    } else if (type === 'cylindrical') {
      itemTitle = `${material} Column (Dia: ${thickness}${tUnit}, H: ${length}${tUnit})`;
      itemDetails = `${results.cubicYards} cu yd (${results.bags80lb} bags of 80lb)`;
    } else if (type === 'gravel-rect') {
      itemTitle = `Gravel Base (${length}${lUnit} x ${width}${lUnit} x ${thickness}${tUnit})`;
      itemDetails = `${results.tons} tons (${results.cubicYards} cu yd)`;
    } else if (type === 'drywall') {
      const roomSize = drywallWidth > 0 
        ? `${length}x${drywallWidth}x${thickness}${lUnit}` 
        : `${length}x${thickness}${lUnit} Wall`;
      itemTitle = `Drywall Panels (${roomSize})`;
      itemDetails = `${results.sheetsNeeded} sheets (${sheetSize}), tape: ${results.tapeFeet}ft, screws: ${results.screwsNeeded}`;
    } else if (type === 'framing') {
      itemTitle = `Framed Wall (${length}${lUnit} Long, ${studSpacing}" o.c.)`;
      itemDetails = `${results.studsCount} Studs, ${results.bottomPlates16ft + results.topPlates16ft} Plates (16ft)`;
    }

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      slug,
      title: itemTitle,
      material,
      details: itemDetails,
      checked: true
    };

    saveShoppingList([...shoppingList, newItem]);

    // Cache calculation into history list
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      slug,
      material,
      shape,
      inputs: {
        length, width, thickness, waste, 
        drywallWidth, includeCeiling, sheetSize,
        studSpacing, corners, topPlates, bottomPlates, gravelDensity
      },
      outputs: results,
      isMetric,
      timestamp: Date.now()
    };

    const trimmedHistory = [newHistoryItem, ...history.filter(h => h.slug !== slug)].slice(0, 5);
    saveHistory(trimmedHistory);
  };

  // Remove individual checklist item
  const removeShoppingItem = (id: string) => {
    saveShoppingList(shoppingList.filter(item => item.id !== id));
  };

  // Toggle checklist checkbox
  const toggleShoppingItem = (id: string) => {
    saveShoppingList(
      shoppingList.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  // Clear shopping list
  const clearShoppingList = () => {
    saveShoppingList([]);
  };

  // Restore calculation from history
  const restoreCalculation = (item: HistoryItem) => {
    setIsMetric(item.isMetric);
    const inp = item.inputs;
    if (inp.length !== undefined) setLength(inp.length);
    if (inp.width !== undefined) setWidth(inp.width);
    if (inp.thickness !== undefined) setThickness(inp.thickness);
    if (inp.waste !== undefined) setWaste(inp.waste);
    if (inp.drywallWidth !== undefined) setDrywallWidth(inp.drywallWidth);
    if (inp.includeCeiling !== undefined) setIncludeCeiling(inp.includeCeiling);
    if (inp.sheetSize !== undefined) setSheetSize(inp.sheetSize);
    if (inp.studSpacing !== undefined) setStudSpacing(inp.studSpacing);
    if (inp.corners !== undefined) setCorners(inp.corners);
    if (inp.topPlates !== undefined) setTopPlates(inp.topPlates);
    if (inp.bottomPlates !== undefined) setBottomPlates(inp.bottomPlates);
    if (inp.gravelDensity !== undefined) setGravelDensity(inp.gravelDensity);
  };

  // Trigger browser printing
  const handlePrint = () => {
    window.print();
  };

  // SVG Scaled calculations
  const svgScale = useMemo(() => {
    if (type === 'rectangular' || type === 'gravel-rect') {
      // Slab scaling parameters
      const maxL = isMetric ? 15 : 50;
      const maxW = isMetric ? 15 : 50;
      const lPerc = Math.min(95, Math.max(30, (length / maxL) * 100));
      const wPerc = Math.min(95, Math.max(30, (width / maxW) * 100));
      return { length: lPerc, width: wPerc };
    } else if (type === 'cylindrical') {
      const maxD = isMetric ? 100 : 40;
      const maxH = isMetric ? 300 : 120;
      const dPerc = Math.min(90, Math.max(25, (thickness / maxD) * 100));
      const hPerc = Math.min(90, Math.max(25, (length / maxH) * 100));
      return { diameter: dPerc, height: hPerc };
    } else if (type === 'drywall') {
      const maxL = isMetric ? 15 : 50;
      const maxH = isMetric ? 6 : 20;
      const lPerc = Math.min(95, Math.max(35, (length / maxL) * 100));
      const hPerc = Math.min(95, Math.max(35, (thickness / maxH) * 100));
      return { length: lPerc, height: hPerc };
    } else if (type === 'framing') {
      const maxL = isMetric ? 15 : 50;
      const lPerc = Math.min(95, Math.max(30, (length / maxL) * 100));
      return { length: lPerc };
    }
    return {};
  }, [type, length, width, thickness, isMetric]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Upper Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 print-full-width no-print">
        
        {/* COLUMN 1: Inputs Panel (4 cols) */}
        <section className="lg:col-span-4 bg-canvas border border-hairline rounded-lg p-6 flex flex-col justify-between shadow-sm calculator-inputs">
          <div>
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <h2 className="text-md font-bold text-ink flex items-center gap-2">
                <Ruler size={18} className="text-brand-accent" />
                <span>Dimensions</span>
              </h2>
              {/* Unit Toggle Switch */}
              <button 
                onClick={handleUnitToggle}
                className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-hairline bg-surface-soft text-ink hover:bg-hairline active:scale-95 transition-all cursor-pointer"
              >
                <span>Units: {isMetric ? 'Metric' : 'Imperial'}</span>
              </button>
            </div>

            {/* Render Form Inputs based on Calculator Type */}
            <div className="space-y-6">
              {/* Rectangular Slab / Driveway Inputs */}
              {(type === 'rectangular' || type === 'gravel-rect') && (
                <>
                  {/* Length */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Length ({isMetric ? 'meters' : 'feet'})</label>
                      <span className="font-mono font-semibold text-brand-accent">{length} {isMetric ? 'm' : 'ft'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max={isMetric ? 30 : 100} 
                      step="0.5"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input 
                      type="number"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono border border-hairline rounded px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  {/* Width */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Width ({isMetric ? 'meters' : 'feet'})</label>
                      <span className="font-mono font-semibold text-brand-accent">{width} {isMetric ? 'm' : 'ft'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max={isMetric ? 30 : 100} 
                      step="0.5"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input 
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono border border-hairline rounded px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  {/* Thickness / Depth */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Thickness ({isMetric ? 'cm' : 'inches'})</label>
                      <span className="font-mono font-semibold text-brand-accent">{thickness} {isMetric ? 'cm' : 'in'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max={isMetric ? 100 : 36} 
                      step="0.5"
                      value={thickness}
                      onChange={(e) => setThickness(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input 
                      type="number"
                      value={thickness}
                      onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono border border-hairline rounded px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </>
              )}

              {/* Cylindrical Inputs */}
              {type === 'cylindrical' && (
                <>
                  {/* Diameter */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Diameter ({isMetric ? 'cm' : 'inches'})</label>
                      <span className="font-mono font-semibold text-brand-accent">{thickness} {isMetric ? 'cm' : 'in'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max={isMetric ? 150 : 60} 
                      step="1"
                      value={thickness}
                      onChange={(e) => setThickness(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input 
                      type="number"
                      value={thickness}
                      onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono border border-hairline rounded px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  {/* Height / Depth */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Height / Depth ({isMetric ? 'cm' : 'inches'})</label>
                      <span className="font-mono font-semibold text-brand-accent">{length} {isMetric ? 'cm' : 'in'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="6" 
                      max={isMetric ? 600 : 240} 
                      step="1"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input 
                      type="number"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono border border-hairline rounded px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </>
              )}

              {/* Drywall Inputs */}
              {type === 'drywall' && (
                <>
                  {/* Length of wall/room */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Room Length ({isMetric ? 'meters' : 'feet'})</label>
                      <span className="font-mono font-semibold text-brand-accent">{length} {isMetric ? 'm' : 'ft'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max={isMetric ? 30 : 100} 
                      step="0.5"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input 
                      type="number"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono border border-hairline rounded px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  {/* Width of room (set to 0 for single wall) */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Room Width ({isMetric ? 'meters' : 'feet'})</label>
                      <span className="font-mono font-secondary text-xs text-muted">(Enter 0 for single wall)</span>
                      <span className="font-mono font-semibold text-brand-accent">{drywallWidth} {isMetric ? 'm' : 'ft'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={isMetric ? 30 : 100} 
                      step="0.5"
                      value={drywallWidth}
                      onChange={(e) => setDrywallWidth(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input 
                      type="number"
                      value={drywallWidth}
                      onChange={(e) => setDrywallWidth(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono border border-hairline rounded px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  {/* Wall Height */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Wall Height ({isMetric ? 'meters' : 'feet'})</label>
                      <span className="font-mono font-semibold text-brand-accent">{thickness} {isMetric ? 'm' : 'ft'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max={isMetric ? 6 : 20} 
                      step="0.5"
                      value={thickness}
                      onChange={(e) => setThickness(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input 
                      type="number"
                      value={thickness}
                      onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono border border-hairline rounded px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  {/* Ceiling Checkbox */}
                  {drywallWidth > 0 && (
                    <label className="flex items-center gap-2 text-sm text-ink cursor-pointer font-medium select-none">
                      <input 
                        type="checkbox"
                        checked={includeCeiling}
                        onChange={(e) => setIncludeCeiling(e.target.checked)}
                        className="rounded border-hairline text-brand-accent focus:ring-brand-accent h-4 w-4"
                      />
                      <span>Include Ceiling Area</span>
                    </label>
                  )}

                  {/* Sheet Size Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Sheet Dimensions</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSheetSize('4x8')}
                        className={`py-2 px-3 text-xs font-semibold rounded border transition-all ${sheetSize === '4x8' ? 'bg-brand-primary text-on-primary border-brand-primary' : 'bg-canvas text-ink border-hairline hover:bg-surface-soft'}`}
                      >
                        4ft x 8ft Panel
                      </button>
                      <button
                        onClick={() => setSheetSize('4x12')}
                        className={`py-2 px-3 text-xs font-semibold rounded border transition-all ${sheetSize === '4x12' ? 'bg-brand-primary text-on-primary border-brand-primary' : 'bg-canvas text-ink border-hairline hover:bg-surface-soft'}`}
                      >
                        4ft x 12ft Panel
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Framing Inputs */}
              {type === 'framing' && (
                <>
                  {/* Length of wall */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Wall Length ({isMetric ? 'meters' : 'feet'})</label>
                      <span className="font-mono font-semibold text-brand-accent">{length} {isMetric ? 'm' : 'ft'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max={isMetric ? 30 : 100} 
                      step="0.5"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input 
                      type="number"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono border border-hairline rounded px-3 py-1.5 bg-canvas text-ink focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  {/* Spacing Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">Stud Spacing (On Center)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setStudSpacing(16)}
                        className={`py-2 px-3 text-xs font-semibold rounded border transition-all ${studSpacing === 16 ? 'bg-brand-primary text-on-primary border-brand-primary' : 'bg-canvas text-ink border-hairline hover:bg-surface-soft'}`}
                      >
                        16 inches o.c. (Standard)
                      </button>
                      <button
                        onClick={() => setStudSpacing(24)}
                        className={`py-2 px-3 text-xs font-semibold rounded border transition-all ${studSpacing === 24 ? 'bg-brand-primary text-on-primary border-brand-primary' : 'bg-canvas text-ink border-hairline hover:bg-surface-soft'}`}
                      >
                        24 inches o.c. (Utility)
                      </button>
                    </div>
                  </div>

                  {/* Corner stud blocks count */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-ink">Corners / Intersections</label>
                      <span className="font-mono font-semibold text-brand-accent">{corners} corners</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      step="1"
                      value={corners}
                      onChange={(e) => setCorners(parseInt(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>

                  {/* Plates count selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted uppercase">Top Plates</label>
                      <select 
                        value={topPlates} 
                        onChange={(e) => setTopPlates(parseInt(e.target.value) || 2)}
                        className="w-full text-sm border border-hairline rounded bg-canvas text-ink px-2.5 py-1.5 focus:outline-none focus:border-brand-accent"
                      >
                        <option value={1}>Single Plate (1x)</option>
                        <option value={2}>Double Plate (2x)</option>
                        <option value={3}>Triple Plate (3x)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted uppercase">Bottom Plates</label>
                      <select 
                        value={bottomPlates} 
                        onChange={(e) => setBottomPlates(parseInt(e.target.value) || 1)}
                        className="w-full text-sm border border-hairline rounded bg-canvas text-ink px-2.5 py-1.5 focus:outline-none focus:border-brand-accent"
                      >
                        <option value={1}>Single Plate (1x)</option>
                        <option value={2}>Double Plate (2x)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Custom Gravel Density for Tonnage Calculations */}
              {type === 'gravel-rect' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label className="font-medium text-ink">Material Density (tons / yd³)</label>
                    <span className="font-mono font-semibold text-brand-accent">{gravelDensity} t/yd³</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.0" 
                    max="1.8" 
                    step="0.05"
                    value={gravelDensity}
                    onChange={(e) => setGravelDensity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-[10px] text-muted block leading-tight">
                    Standard crushed gravel is approximately 1.4 tons per cubic yard (103 lbs/ft³). Wet sand is denser (~1.6 t/yd³).
                  </span>
                </div>
              )}

              {/* Waste Factor Slider (Applies to all) */}
              <div className="space-y-2 border-t border-hairline pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <label className="font-semibold text-ink">Waste Margin (%)</label>
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
            onClick={addToShoppingList}
            className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-md shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>Add to Jobsite Shopping List</span>
          </button>
        </section>

        {/* COLUMN 2: Visualizer & Real-time Outputs (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6 print-card-border">
          {/* Dynamic SVG Visualizer Panel */}
          <div className="bg-surface-card border border-hairline rounded-lg p-5 flex items-center justify-center min-h-[220px]">
            {/* Dynamic Inline SVGs based on Type */}
            {type === 'rectangular' && (
              <svg viewBox="0 0 300 180" className="w-full max-h-[180px]">
                {/* 3D isometric slab */}
                <polygon 
                  points="150,30 240,65 150,100 60,65" 
                  fill="var(--color-hairline)" 
                  stroke="var(--color-muted)" 
                  strokeWidth="1.5"
                />
                {/* Slab front left face */}
                <polygon 
                  points={`60,65 150,100 150,${100 + (thickness * 0.8)} 60,${65 + (thickness * 0.8)}`} 
                  fill="var(--color-surface-strong)" 
                  stroke="var(--color-muted)" 
                  strokeWidth="1.5"
                />
                {/* Slab front right face */}
                <polygon 
                  points={`150,100 240,65 240,${65 + (thickness * 0.8)} 150,${100 + (thickness * 0.8)}`} 
                  fill="var(--color-hairline-soft)" 
                  stroke="var(--color-muted)" 
                  strokeWidth="1.5"
                />
                {/* Dimension Arrows */}
                <path d="M50,75 L140,110" stroke="var(--color-brand-accent)" strokeWidth="1" markerEnd="url(#arrow)" />
                <path d="M250,75 L160,110" stroke="var(--color-brand-accent)" strokeWidth="1" markerEnd="url(#arrow)" />
                
                {/* Text Labels */}
                <text x="75" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">L: {length} {isMetric ? 'm' : 'ft'}</text>
                <text x="210" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">W: {width} {isMetric ? 'm' : 'ft'}</text>
                <text x="155" y={115 + (thickness * 0.5)} fontSize="9" fill="var(--color-brand-accent)" className="font-mono font-bold">T: {thickness} {isMetric ? 'cm' : 'in'}</text>
              </svg>
            )}

            {type === 'cylindrical' && (
              <svg viewBox="0 0 200 200" className="w-full max-h-[180px]">
                {/* Column top ellipse */}
                <ellipse 
                  cx="100" 
                  cy="40" 
                  rx={Math.max(20, thickness * 1.5)} 
                  ry={Math.max(8, thickness * 0.5)} 
                  fill="var(--color-hairline)" 
                  stroke="var(--color-muted)" 
                  strokeWidth="1.5" 
                />
                {/* Column cylinder body */}
                <path 
                  d={`M${100 - (thickness * 1.5)},40 L${100 - (thickness * 1.5)},${40 + (length * 0.8)} 
                     A${thickness * 1.5},${thickness * 0.5} 0 0,0 ${100 + (thickness * 1.5)},${40 + (length * 0.8)} 
                     L${100 + (thickness * 1.5)},40 Z`}
                  fill="var(--color-surface-strong)" 
                  fillOpacity="0.8"
                  stroke="var(--color-muted)" 
                  strokeWidth="1.5" 
                />
                {/* Dimension markup */}
                <text x="100" y="25" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">D: {thickness} {isMetric ? 'cm' : 'in'}</text>
                <text x={120 + (thickness * 1.5)} y={40 + (length * 0.4)} fontSize="10" fill="var(--color-brand-accent)" className="font-mono font-bold">H: {length} {isMetric ? 'cm' : 'in'}</text>
              </svg>
            )}

            {type === 'gravel-rect' && (
              <svg viewBox="0 0 300 180" className="w-full max-h-[180px]">
                <defs>
                  {/* Gravel Texture Pattern */}
                  <pattern id="gravel-pat" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="var(--color-muted)" />
                    <circle cx="7" cy="5" r="1" fill="var(--color-body)" />
                    <circle cx="4" cy="8" r="1.2" fill="var(--color-muted-soft)" />
                  </pattern>
                </defs>
                {/* 3D isometric slab */}
                <polygon 
                  points="150,30 240,65 150,100 60,65" 
                  fill="url(#gravel-pat)" 
                  stroke="var(--color-muted)" 
                  strokeWidth="1.5"
                />
                {/* Slab front left face */}
                <polygon 
                  points={`60,65 150,100 150,${100 + (thickness * 0.8)} 60,${65 + (thickness * 0.8)}`} 
                  fill="var(--color-surface-strong)" 
                  stroke="var(--color-muted)" 
                  strokeWidth="1.5"
                />
                {/* Slab front right face */}
                <polygon 
                  points={`150,100 240,65 240,${65 + (thickness * 0.8)} 150,${100 + (thickness * 0.8)}`} 
                  fill="var(--color-hairline-soft)" 
                  stroke="var(--color-muted)" 
                  strokeWidth="1.5"
                />
                {/* Dimension Arrows */}
                <text x="75" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">L: {length} {isMetric ? 'm' : 'ft'}</text>
                <text x="210" y="105" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">W: {width} {isMetric ? 'm' : 'ft'}</text>
                <text x="155" y={115 + (thickness * 0.5)} fontSize="9" fill="var(--color-brand-accent)" className="font-mono font-bold">Depth: {thickness} {isMetric ? 'cm' : 'in'}</text>
              </svg>
            )}

            {type === 'drywall' && (
              <svg viewBox="0 0 240 140" className="w-full max-h-[180px]">
                {/* Wall sketch */}
                <rect 
                  x="30" 
                  y="20" 
                  width="180" 
                  height="90" 
                  fill="var(--color-hairline)" 
                  stroke="var(--color-muted)" 
                  strokeWidth="1.5" 
                />
                {/* Drywall seams visual mock */}
                <line x1="75" y1="20" x2="75" y2="110" stroke="var(--color-muted-soft)" strokeDasharray="3" />
                <line x1="120" y1="20" x2="120" y2="110" stroke="var(--color-muted-soft)" strokeDasharray="3" />
                <line x1="165" y1="20" x2="165" y2="110" stroke="var(--color-muted-soft)" strokeDasharray="3" />
                
                <text x="120" y="70" textAnchor="middle" fontSize="11" fill="var(--color-brand-accent)" className="font-bold">
                  {results ? `${(results as DrywallResult).sheetsNeeded} Sheets (${sheetSize})` : ""}
                </text>
                
                {/* Dimensions text */}
                <text x="120" y="125" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">W: {length} {isMetric ? 'm' : 'ft'}</text>
                <text x="15" y="70" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold" transform="rotate(-90,15,70)">H: {thickness} {isMetric ? 'm' : 'ft'}</text>
              </svg>
            )}

            {type === 'framing' && (
              <svg viewBox="0 0 300 120" className="w-full max-h-[180px]">
                {/* Top double plate */}
                <rect x="20" y="15" width="260" height="4" fill="#d8b4fe" stroke="var(--color-muted)" strokeWidth="0.5" />
                <rect x="20" y="20" width="260" height="4" fill="#d8b4fe" stroke="var(--color-muted)" strokeWidth="0.5" />
                {/* Bottom plate */}
                <rect x="20" y="95" width="260" height="4" fill="#d8b4fe" stroke="var(--color-muted)" strokeWidth="0.5" />
                
                {/* Dynamic studs rendered horizontally */}
                {Array.from({ length: Math.min(15, Math.ceil(length * (studSpacing === 16 ? 0.75 : 0.5))) }).map((_, idx, arr) => {
                  const xPos = 20 + (idx * (260 / (arr.length - 1 || 1)));
                  return (
                    <rect 
                      key={idx} 
                      x={xPos} 
                      y="24" 
                      width="4" 
                      height="71" 
                      fill="#e9d5ff" 
                      stroke="var(--color-muted)" 
                      strokeWidth="0.5" 
                    />
                  );
                })}

                <text x="150" y="112" textAnchor="middle" fontSize="10" fill="var(--color-ink)" className="font-mono font-bold">Wall Length: {length} {isMetric ? 'm' : 'ft'}</text>
                <text x="150" y="65" textAnchor="middle" fontSize="10" fill="var(--color-brand-accent)" className="font-bold">
                  {results ? `${(results as FramingResult).studsCount} Studs (${studSpacing}" o.c.)` : ""}
                </text>
              </svg>
            )}
          </div>

          {/* Core Calculation Outputs Card */}
          <div className="bg-canvas border border-hairline rounded-lg p-6 flex flex-col justify-between flex-grow shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Calculation Outputs</h3>
              
              <div className="space-y-4">
                {/* Outputs based on Concrete Slab & Column */}
                {(type === 'rectangular' || type === 'cylindrical') && results && (
                  <>
                    {/* Volume (Cubic Yards) - Primary Highlight */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span className="text-sm text-body font-medium">Concrete Volume (Yards)</span>
                      <span className="text-2xl font-mono font-extrabold text-ink">
                        {(results as ConcreteSlabResult).cubicYards} <span className="text-sm font-medium">cu yd</span>
                      </span>
                    </div>

                    {/* Volume (Cubic Meters) */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span className="text-sm text-muted">Concrete Volume (Metric)</span>
                      <span className="text-md font-mono font-bold text-ink">
                        {(results as ConcreteSlabResult).cubicMeters} <span className="text-xs font-normal text-muted">m³</span>
                      </span>
                    </div>

                    {/* Volume (Cubic Feet) */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span className="text-sm text-muted">Concrete Volume (Feet)</span>
                      <span className="text-md font-mono font-bold text-ink">
                        {(results as ConcreteSlabResult).cubicFeet} <span className="text-xs font-normal text-muted">cu ft</span>
                      </span>
                    </div>

                    {/* Concrete Bags needed */}
                    <div className="mt-4 pt-2">
                      <h4 className="text-xs font-bold text-muted uppercase mb-3">Pre-mix Bag Counts</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                          <span className="block text-xs text-muted font-medium mb-1">80lb Bags</span>
                          <span className="text-md font-mono font-extrabold text-brand-accent">{(results as ConcreteSlabResult).bags80lb}</span>
                        </div>
                        <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                          <span className="block text-xs text-muted font-medium mb-1">60lb Bags</span>
                          <span className="text-md font-mono font-extrabold text-brand-accent">{(results as ConcreteSlabResult).bags60lb}</span>
                        </div>
                        <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                          <span className="block text-xs text-muted font-medium mb-1">40lb Bags</span>
                          <span className="text-md font-mono font-extrabold text-brand-accent">{(results as ConcreteSlabResult).bags40lb}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Outputs based on Gravel Base */}
                {type === 'gravel-rect' && results && (
                  <>
                    {/* Weight (Tons) - Primary Highlight */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span className="text-sm text-body font-medium">Estimated Weight (Tons)</span>
                      <span className="text-2xl font-mono font-extrabold text-brand-accent">
                        {(results as GravelResult).tons} <span className="text-sm font-medium">tons</span>
                      </span>
                    </div>

                    {/* Volume (Cubic Yards) */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span className="text-sm text-muted">Volume (Cubic Yards)</span>
                      <span className="text-md font-mono font-bold text-ink">
                        {(results as GravelResult).cubicYards} <span className="text-xs font-normal text-muted">cu yd</span>
                      </span>
                    </div>

                    {/* Volume (Cubic Feet) */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span className="text-sm text-muted">Volume (Cubic Feet)</span>
                      <span className="text-md font-mono font-bold text-ink">
                        {(results as GravelResult).cubicFeet} <span className="text-xs font-normal text-muted">cu ft</span>
                      </span>
                    </div>
                  </>
                )}

                {/* Outputs based on Drywall Panels */}
                {type === 'drywall' && results && (
                  <>
                    {/* Panels count - Primary Highlight */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span className="text-sm text-body font-medium">Drywall Sheets ({sheetSize})</span>
                      <span className="text-2xl font-mono font-extrabold text-brand-accent">
                        {(results as DrywallResult).sheetsNeeded} <span className="text-sm font-medium">sheets</span>
                      </span>
                    </div>

                    {/* Drywall area */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span className="text-sm text-muted">Total Wall/Ceiling Area</span>
                      <span className="text-md font-mono font-bold text-ink">
                        {(results as DrywallResult).totalAreaSqFt} <span className="text-xs font-normal text-muted">sq ft</span>
                      </span>
                    </div>

                    {/* Drywall Supplies lists */}
                    <div className="mt-4 pt-2">
                      <h4 className="text-xs font-bold text-muted uppercase mb-3">Estimated Finishing Supplies</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                          <span className="block text-xs text-muted font-medium mb-1">Joint Tape</span>
                          <span className="text-md font-mono font-extrabold text-ink">{(results as DrywallResult).tapeFeet} ft</span>
                        </div>
                        <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                          <span className="block text-xs text-muted font-medium mb-1">Joint Compound</span>
                          <span className="text-md font-mono font-extrabold text-ink">{(results as DrywallResult).compoundLbs} lbs</span>
                        </div>
                        <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                          <span className="block text-xs text-muted font-medium mb-1">Drywall Screws</span>
                          <span className="text-md font-mono font-extrabold text-ink">~{(results as DrywallResult).screwsNeeded}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Outputs based on Framing Studs */}
                {type === 'framing' && results && (
                  <>
                    {/* Studs Count - Primary Highlight */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span className="text-sm text-body font-medium">Studs Count ({studSpacing}" o.c.)</span>
                      <span className="text-2xl font-mono font-extrabold text-brand-accent">
                        {(results as FramingResult).studsCount} <span className="text-sm font-medium">pieces</span>
                      </span>
                    </div>

                    {/* Linear wall distance */}
                    <div className="flex justify-between items-baseline border-b border-hairline-soft pb-2">
                      <span class="text-sm text-muted">Total Wall Length</span>
                      <span className="text-md font-mono font-bold text-ink">
                        {length} <span className="text-xs font-normal text-muted">{isMetric ? 'meters' : 'ft'}</span>
                      </span>
                    </div>

                    {/* Plates Estimate lists */}
                    <div className="mt-4 pt-2">
                      <h4 className="text-xs font-bold text-muted uppercase mb-3">Lumber Plates (16ft Stock)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                          <span className="block text-xs text-muted font-medium mb-1">Top Plates (Double)</span>
                          <span className="text-md font-mono font-extrabold text-ink">{(results as FramingResult).topPlates16ft} pcs</span>
                        </div>
                        <div className="bg-surface-soft p-3 rounded border border-hairline text-center">
                          <span className="block text-xs text-muted font-medium mb-1">Bottom Plates</span>
                          <span className="text-md font-mono font-extrabold text-ink">{(results as FramingResult).bottomPlates16ft} pcs</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted block text-center mt-2 font-mono">
                        Total plates linear footage needed: {(results as FramingResult).totalPlatesLinearFt} ft
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Note on Waste Margin */}
            <div className="mt-6 p-3 bg-red-50 dark:bg-zinc-900 border border-red-100 dark:border-zinc-800 rounded flex gap-2.5 items-start">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span className="text-xs text-red-700 dark:text-zinc-400">
                Calculations include a <strong>{waste}% waste margin</strong> for trimming, spills, and jobsite inconsistencies. Order values are rounded up to the nearest whole material package unit.
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
                <span>Jobsite Shopping List</span>
              </h3>
              {shoppingList.length > 0 && (
                <button 
                  onClick={clearShoppingList}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Printable checklist header */}
            <div className="hidden print:block pb-4 mb-4 border-b border-black">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">Build Yardage</h2>
              <h3 className="text-md font-bold text-black mt-1">Material Estimate Shopping Checklist</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Printed on: {printDate}</p>
            </div>

            {/* Shopping List Items */}
            {shoppingList.length === 0 ? (
              <div className="text-center py-8 text-muted no-print">
                <p className="text-xs">No materials added to your checklist yet.</p>
                <p className="text-[10px] mt-1">Adjust dimensions on the left and click "Add to Jobsite Shopping List" to compile aggregates.</p>
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
                        {/* Print placeholder checkbox */}
                        <div className="hidden print:block border border-black h-4.5 w-4.5 shrink-0 mr-1 mt-0.5"></div>
                        
                        <div>
                          <p className={`font-semibold text-ink print-text-black ${item.checked ? '' : 'line-through opacity-50'}`}>
                            {item.title}
                          </p>
                          <p className="text-[10px] text-muted font-mono mt-0.5 print-text-black">
                            {item.details}
                          </p>
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

                {/* Print & PDF Action */}
                <button
                  onClick={handlePrint}
                  className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 px-3 border border-hairline hover:bg-surface-soft text-ink font-semibold rounded text-xs transition-all active:scale-95 duration-100 no-print cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print / PDF Checklist</span>
                </button>
              </div>
            )}
          </div>

          {/* History / Local Cache Panel (no-print) */}
          <div className="bg-canvas border border-hairline rounded-lg p-5 flex flex-col shadow-sm history-panel no-print">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-hairline pb-3 mb-4">
              <History size={16} className="text-zinc-500" />
              <span>Recent Calculations</span>
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
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-2">
              <span className="bg-black text-white px-2 py-0.5 rounded text-lg font-bold">BY</span>
              BUILD YARDAGE
            </h1>
            <p className="text-xs text-zinc-600 mt-1 font-sans">Professional Material Estimate & Jobsite Checklist</p>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">URL: www.buildyardage.com</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase text-zinc-700">Estimate Printout</p>
            <p className="text-xs text-zinc-500 mt-1">Date: {printDate}</p>
          </div>
        </div>

        {/* Checklist Table */}
        <h2 className="text-md font-bold uppercase tracking-wider text-zinc-800 mb-3 border-b border-zinc-200 pb-1">
          Shopping Checklist
        </h2>
        
        {shoppingList.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">No materials added to your checklist.</p>
        ) : (
          <table className="w-full text-left border-collapse border border-zinc-300 text-xs mb-8">
            <thead>
              <tr className="bg-zinc-100 border-b border-zinc-300">
                <th className="p-3 border-r border-zinc-300 w-12 text-center">Done</th>
                <th className="p-3 border-r border-zinc-300 font-bold">Material / Item Name</th>
                <th className="p-3 font-mono text-zinc-700 font-bold">Estimated Quantities & Configurations</th>
              </tr>
            </thead>
            <tbody>
              {shoppingList.map((item) => (
                <tr key={item.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                  <td className="p-3 border-r border-zinc-300 text-center">
                    <div className="mx-auto border border-black h-4 w-4 rounded-sm"></div>
                  </td>
                  <td className="p-3 border-r border-zinc-300 font-semibold text-zinc-900">
                    {item.title}
                    <span className="block text-[10px] text-zinc-500 mt-0.5 font-normal">Material Category: {item.material}</span>
                  </td>
                  <td className="p-3 font-mono text-zinc-900 leading-relaxed whitespace-pre-line">
                    {item.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Notes Box */}
        <div className="border border-zinc-300 p-4 rounded-md mb-8">
          <h3 className="text-xs font-bold uppercase text-zinc-700 mb-2">Jobsite Notes</h3>
          <div className="h-16 border-b border-dashed border-zinc-300 mb-4"></div>
          <div className="h-16 border-b border-dashed border-zinc-300 mb-4"></div>
          <div className="h-16 border-b border-dashed border-zinc-300"></div>
        </div>

        {/* Disclaimer Footer */}
        <div className="border-t border-zinc-300 pt-4 text-[10px] text-zinc-500 leading-relaxed">
          <p><strong>Disclaimer:</strong> This shopping checklist compiles mathematical material estimates based on inputs provided by the user. These figures are approximations and include custom waste margin factors. Field conditions, sub-grade variations, structural reinforcements, and contractor practices can affect actual quantities needed. Consult a licensed contractor or local building supplier to verify ordering requirements before purchasing material.</p>
          <p className="mt-2 text-right text-zinc-400 font-mono">buildyardage.com</p>
        </div>
      </div>
    </div>
  );
}
