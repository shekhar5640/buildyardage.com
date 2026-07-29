import React, { useMemo } from 'react';

interface DimensionInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  isMetric: boolean;
  metricUnit?: string;
  imperialUnit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function DimensionInput({
  label,
  value,
  onChange,
  isMetric,
  metricUnit = 'm',
  imperialUnit = 'ft',
  min = 1,
  max = 100,
  step = 0.5
}: DimensionInputProps) {
  
  // Calculate feet and inches for display
  const { feet, inches } = useMemo(() => {
    let f = Math.floor(value);
    let i = Math.round((value - f) * 12);
    if (i === 12) {
      f += 1;
      i = 0;
    }
    return { feet: f, inches: i };
  }, [value]);

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFeet = parseInt(e.target.value) || 0;
    onChange(newFeet + inches / 12);
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInches = parseInt(e.target.value) || 0;
    onChange(feet + newInches / 12);
  };

  const currentUnit = isMetric ? metricUnit : imperialUnit;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <label className="font-medium text-ink">
          {label} ({currentUnit})
        </label>
        <span className="font-mono font-semibold text-brand-accent">
          {!isMetric && imperialUnit === 'ft' ? (
            `${feet}' ${inches}"`
          ) : (
            `${value} ${currentUnit}`
          )}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-grow accent-indigo-600 dark:accent-indigo-400"
        />
        
        {!isMetric && imperialUnit === 'ft' ? (
          <div className="flex gap-1">
            <div className="relative">
              <input 
                type="number"
                min="0"
                value={feet}
                onChange={handleFeetChange}
                className="w-16 text-center text-sm font-mono border border-hairline rounded pl-2 pr-4 py-2 min-h-[44px] bg-canvas text-ink focus:outline-none focus:border-brand-accent"
              />
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted text-xs font-bold">ft</span>
            </div>
            <div className="relative">
              <input 
                type="number"
                min="0"
                max="11"
                value={inches}
                onChange={handleInchesChange}
                className="w-16 text-center text-sm font-mono border border-hairline rounded pl-2 pr-4 py-2 min-h-[44px] bg-canvas text-ink focus:outline-none focus:border-brand-accent"
              />
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted text-xs font-bold">in</span>
            </div>
          </div>
        ) : (
          <input 
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-20 text-center text-sm font-mono border border-hairline rounded pl-2 pr-6 py-2 min-h-[44px] bg-canvas text-ink focus:outline-none focus:border-brand-accent"
          />
        )}
      </div>
    </div>
  );
}
