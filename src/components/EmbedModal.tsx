import React, { useState } from 'react';
import { X, Code, Copy, Check } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorSlug: string;
  calculatorTitle: string;
  t: any;
}

export default function EmbedModal({
  isOpen,
  onClose,
  calculatorSlug,
  calculatorTitle,
  t
}: EmbedModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Clean slug for embed iframe route
  const embedSlug = calculatorSlug.replace(/-calculator$/, '');
  const embedUrl = `https://buildyardage.com/embed/${embedSlug}`;

  // Standardized Backlink Embed Snippet
  const snippet = `<iframe src="${embedUrl}" width="100%" height="480" style="border:0; overflow:hidden;" title="BuildYardage Calculator"></iframe>\n<p style="font-size:12px; text-align:center; margin-top:6px; font-family:sans-serif;">\n  Powered by <a href="https://buildyardage.com/" target="_blank" rel="noopener">BuildYardage</a>\n</p>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        className="bg-canvas border border-hairline rounded-xl max-w-xl w-full p-6 shadow-2xl relative space-y-5 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Close */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent">
              <Code size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">
                {t?.calculatorShell?.embedModalTitle || 'Embed Calculator on Your Website'}
              </h3>
              <p className="text-xs text-muted">
                {t?.calculatorShell?.embedModalDesc || 'Copy and paste the HTML snippet below to embed this interactive calculator.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-muted hover:text-ink p-1.5 rounded-lg hover:bg-surface-soft transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-ink uppercase tracking-wider">
            HTML Embed Snippet
          </label>
          <div className="relative">
            <textarea
              readOnly
              value={snippet}
              rows={5}
              className="w-full font-mono text-xs p-3.5 rounded-lg border border-hairline bg-surface-card text-ink focus:outline-none focus:ring-1 focus:ring-brand-accent resize-none selection:bg-brand-accent/20"
            />
          </div>
        </div>

        {/* Preview Container */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">
            Widget Preview
          </label>
          <div className="border border-hairline rounded-lg overflow-hidden bg-surface-card p-3 text-center">
            <div className="text-[11px] text-muted mb-1 font-mono">
              [iframe src="{embedUrl}"]
            </div>
            <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '6px', fontFamily: 'sans-serif' }}>
              Powered by <a href="https://buildyardage.com/" target="_blank" rel="noopener" className="text-brand-accent underline font-medium">BuildYardage</a>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-hairline hover:bg-surface-soft text-ink transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-brand-accent hover:bg-brand-accent/90 text-white shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? (t?.calculatorShell?.embedCopied || 'Copied to Clipboard!') : (t?.calculatorShell?.copyEmbedCode || 'Copy HTML Code')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
