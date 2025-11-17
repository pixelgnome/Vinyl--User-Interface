export function VinylLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Vinyl Record Icon */}
      <div className="relative w-10 h-10">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full animate-[spin_8s_linear_infinite]" style={{ background: 'linear-gradient(135deg, #333 0%, #2a2a2a 100%)' }}>
          {/* Label area */}
          <div className="absolute inset-2 rounded-full bg-card border-2 border-background flex items-center justify-center">
            {/* Center hole */}
            <div className="w-2 h-2 rounded-full bg-background" />
          </div>
          {/* Grooves */}
          <div className="absolute inset-1 rounded-full border" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <div className="absolute inset-[6px] rounded-full border" style={{ borderColor: 'rgba(255,255,255,0.05)' }} />
        </div>
        {/* Dollar sign overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none animate-[spin_8s_linear_infinite]" style={{ color: '#555' }}>
          <span className="text-xs font-bold drop-shadow-lg">$</span>
        </div>
      </div>

      {/* Text Logo */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-bold" style={{ color: '#eee' }}>
            Vinyl
          </span>
          <span className="font-bold" style={{ color: '#eee', fontSize: '1em' }}>$</span>
        </div>
        <span className="text-[10px] tracking-wider text-muted-foreground uppercase mt-0.5">
          Record Label Scanner
        </span>
      </div>
    </div>
  );
}
