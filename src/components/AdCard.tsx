import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AdCardProps {
  className?: string;
}

export default function AdCard({ className = "" }: AdCardProps) {
  // Mock ads that look like clean native utility recommendations to preserve UX
  const mockAds = [
    {
      title: "Need a Professional Concrete Contractor?",
      description: "Get up to 4 free slab & footing quotes from top-rated local concrete specialists in your area.",
      cta: "Get Free Quotes",
      link: "#"
    },
    {
      title: "Premium Framing & Lumber Supplies",
      description: "Order studs, headers, and sheathing in bulk. Save 15% on commercial contractor orders this month.",
      cta: "Browse Catalog",
      link: "#"
    },
    {
      title: "Rent Concrete Mixers & Tools Nearby",
      description: "Local tool rentals at affordable day rates. Pick up or get delivery directly to your job site.",
      cta: "Check Rates",
      link: "#"
    }
  ];

  // Pick a random mock ad to render
  const [adIndex, setAdIndex] = React.useState(0);
  React.useEffect(() => {
    // Statically choose one based on loading to prevent hydration mismatch
    setAdIndex(Math.floor(Math.random() * mockAds.length));
  }, []);

  const activeAd = mockAds[adIndex];

  return (
    <div 
      role="ad" 
      className={`w-full h-[260px] border border-hairline bg-surface-card rounded-lg flex flex-col justify-between p-5 transition-all duration-200 select-none print:hidden ${className}`}
    >
      {/* Ad Badge Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-soft dark:text-zinc-500">
          Sponsored Link
        </span>
        <span className="text-[10px] font-mono bg-hairline dark:bg-zinc-800 text-muted px-1.5 py-0.5 rounded">
          AdSpace (CPC Target)
        </span>
      </div>

      {/* Ad Content */}
      <div className="my-3">
        <h4 className="text-sm font-bold text-ink dark:text-zinc-200 group-hover:text-brand-accent transition-colors flex items-center gap-1.5">
          {activeAd.title}
        </h4>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          {activeAd.description}
        </p>
      </div>

      {/* CTA Button */}
      <div className="flex items-center justify-between border-t border-hairline pt-3 mt-1">
        <span className="text-xs text-brand-accent dark:text-indigo-400 font-medium">
          buildyardage.com/deals
        </span>
        <a 
          href={activeAd.link}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-semibold rounded transition-colors active:scale-95 duration-100"
        >
          <span>{activeAd.cta}</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
