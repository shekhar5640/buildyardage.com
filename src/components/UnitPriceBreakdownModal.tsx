import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Calculator } from 'lucide-react';

// ─── Sub-cost config per calculator type ─────────────────────────────────────

interface SubCostField {
  id: string;
  label: string;
  placeholder: string;
  suffix?: string;
  isPercent?: boolean;
}

interface BreakdownConfig {
  title: string;
  unitLabel: string;
  description: string;
  fields: SubCostField[];
}

function getBreakdownConfig(type: string, ctx: Record<string, any>): BreakdownConfig {
  switch (type) {
    case 'rectangular':
      return {
        title: 'Concrete Slab – Cost Breakdown',
        unitLabel: ctx.isMetric ? 'per m³' : 'per yd³',
        description: 'Build up your all-in unit price for ready-mix concrete delivered and poured on site.',
        fields: [
          { id: 'readymix', label: 'Ready-mix concrete', placeholder: '0.00' },
          { id: 'delivery', label: 'Delivery / short-load freight', placeholder: '0.00' },
          { id: 'rebar',    label: 'Rebar / wire mesh allowance', placeholder: '0.00' },
          { id: 'subbase',  label: 'Gravel sub-base prep allowance', placeholder: '0.00' },
        ],
      };
    case 'cylindrical':
      return {
        title: 'Concrete Column – Cost Breakdown',
        unitLabel: 'per yd³',
        description: 'Build up your all-in cost per cubic yard for column concrete including formwork and rebar.',
        fields: [
          { id: 'concrete',  label: 'Concrete mix cost', placeholder: '0.00' },
          { id: 'delivery',  label: 'Pump truck / delivery fee', placeholder: '0.00' },
          { id: 'sonotube',  label: 'Sonotube / formwork allowance', placeholder: '0.00' },
          { id: 'rebarcage', label: 'Rebar cage & tie wire allowance', placeholder: '0.00' },
        ],
      };
    case 'gravel-rect':
      return {
        title: 'Gravel Driveway – Cost Breakdown',
        unitLabel: ctx.isMetric ? 'per tonne' : 'per ton',
        description: 'Build up your all-in cost per ton of gravel delivered and compacted.',
        fields: [
          { id: 'material',   label: 'Base gravel material', placeholder: '0.00' },
          { id: 'trucking',   label: 'Trucking / delivery fee', placeholder: '0.00' },
          { id: 'geotextile', label: 'Geotextile fabric allowance', placeholder: '0.00' },
          { id: 'compaction', label: 'Compaction equipment allowance', placeholder: '0.00' },
        ],
      };
    case 'drywall': {
      const sheet = ctx.sheetSize || '4x8';
      return {
        title: 'Drywall Sheet – Cost Breakdown',
        unitLabel: `per ${sheet} sheet`,
        description: `Build up your all-in cost per ${sheet} drywall sheet including mud, tape, and fasteners.`,
        fields: [
          { id: 'board',      label: `Raw ${sheet} drywall board price`, placeholder: '0.00' },
          { id: 'mud',        label: 'Joint compound & tape allowance', placeholder: '0.00' },
          { id: 'cornerbead', label: 'Corner bead & primer allowance', placeholder: '0.00' },
          { id: 'waste',      label: 'Cutting waste factor', placeholder: '10', suffix: '%', isPercent: true },
        ],
      };
    }
    case 'framing':
      return {
        title: 'Wood Framing – Cost Breakdown',
        unitLabel: 'per lumber piece',
        description: 'Build up your all-in cost per piece of dimensional lumber (studs + plates priced equally).',
        fields: [
          { id: 'stud',     label: 'Stud / joist lumber price', placeholder: '0.00' },
          { id: 'plate',    label: 'Plate & blocking allowance', placeholder: '0.00' },
          { id: 'hardware', label: 'Nails, screws & hardware allowance', placeholder: '0.00' },
          { id: 'waste',    label: 'Waste & defect factor', placeholder: '10', suffix: '%', isPercent: true },
        ],
      };
    case 'rebar':
      return {
        title: 'Rebar Grid – Cost Breakdown',
        unitLabel: `per ${ctx.rebarSize || '#4'} bar`,
        description: `Build up your all-in cost per ${ctx.rebarSize || '#4'} rebar stick including accessories and delivery.`,
        fields: [
          { id: 'raw',      label: 'Raw rebar cost per bar', placeholder: '0.00' },
          { id: 'chairs',   label: 'Chairs, tie wire & safety caps', placeholder: '0.00' },
          { id: 'delivery', label: 'Cutting / bending / delivery', placeholder: '0.00' },
        ],
      };
    default:
      return {
        title: 'Cost Breakdown',
        unitLabel: 'per unit',
        description: 'Build up the all-in unit price from individual cost components.',
        fields: [
          { id: 'material', label: 'Material cost', placeholder: '0.00' },
          { id: 'labor',    label: 'Labor & delivery', placeholder: '0.00' },
        ],
      };
  }
}

// ─── Component ─────────────────────────────────────────────────────────────

interface UnitPriceBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (total: number) => void;
  calculatorType: string;
  currency: string;
  isMetric: boolean;
  breakdownContext?: Record<string, any>;
}

export default function UnitPriceBreakdownModal({
  isOpen,
  onClose,
  onApply,
  calculatorType,
  currency,
  isMetric,
  breakdownContext = {},
}: UnitPriceBreakdownModalProps) {
  const config = useMemo(
    () => getBreakdownConfig(calculatorType, { ...breakdownContext, isMetric }),
    [calculatorType, breakdownContext, isMetric]
  );

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    config.fields.forEach(f => { init[f.id] = ''; });
    return init;
  });

  // Reset fields when calculator type changes
  useEffect(() => {
    const init: Record<string, string> = {};
    config.fields.forEach(f => { init[f.id] = ''; });
    setValues(init);
  }, [config]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const total = useMemo(() => {
    let baseSum = 0;
    let wastePercent = 0;
    config.fields.forEach(f => {
      const v = parseFloat(values[f.id] || '0') || 0;
      if (f.isPercent) {
        wastePercent = v;
      } else {
        baseSum += v;
      }
    });
    return baseSum * (1 + wastePercent / 100);
  }, [values, config]);

  const handleChange = useCallback((id: string, val: string) => {
    setValues(prev => ({ ...prev, [id]: val }));
  }, []);

  const handleApply = () => {
    if (total > 0) {
      onApply(parseFloat(total.toFixed(2)));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop — matches existing EmbedModal overlay style
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="breakdown-modal-title"
    >
      {/* Card */}
      <div
        className="relative w-full sm:max-w-md bg-canvas border border-hairline rounded-t-xl sm:rounded-lg shadow-xl flex flex-col max-h-[92dvh] sm:max-h-[85dvh] overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'bpModalIn 0.18s ease' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-accent/10 text-brand-accent">
              <Calculator size={16} />
            </div>
            <div>
              <h2
                id="breakdown-modal-title"
                className="text-sm font-semibold text-ink leading-snug"
              >
                {config.title}
              </h2>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-3 shrink-0 p-1.5 rounded-md text-muted hover:text-ink hover:bg-surface-card transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sub-cost fields */}
        <div className="overflow-y-auto px-5 py-4 space-y-3">
          {config.fields.map(field => (
            <div key={field.id} className="flex items-center gap-3">
              <label
                htmlFor={`bp-${field.id}`}
                className="flex-1 text-xs font-medium text-body leading-tight"
              >
                {field.label}
              </label>
              <div className="relative flex items-center w-28 shrink-0">
                {!field.isPercent && (
                  <span className="absolute left-2.5 text-xs font-bold text-muted pointer-events-none select-none">
                    {currency}
                  </span>
                )}
                <input
                  id={`bp-${field.id}`}
                  type="number"
                  min="0"
                  step={field.isPercent ? '1' : '0.01'}
                  placeholder={field.placeholder}
                  value={values[field.id]}
                  onChange={e => handleChange(field.id, e.target.value)}
                  className={`w-full text-sm font-mono rounded-md border border-hairline bg-canvas text-ink px-2.5 py-1.5 focus:outline-none focus:border-brand-accent transition-colors ${field.isPercent ? 'text-center pr-6' : 'pl-6 text-right'}`}
                />
                {field.isPercent && field.suffix && (
                  <span className="absolute right-2.5 text-xs font-bold text-muted pointer-events-none select-none">
                    {field.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total + Action buttons */}
        <div className="px-5 py-4 border-t border-hairline bg-surface-soft">
          {/* Running total */}
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              All-In Unit Price<span className="normal-case font-normal ml-1 text-muted">{config.unitLabel}</span>
            </span>
            <span className="text-2xl font-mono font-extrabold text-brand-accent">
              {currency}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Buttons — matches site's button-primary / button-secondary pattern from DESIGN.md */}
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md border border-hairline bg-canvas text-sm font-semibold text-ink hover:bg-surface-card transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={total <= 0}
              className="flex-1 py-2.5 rounded-md bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all active:scale-95"
            >
              Apply to Calculator
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bpModalIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
