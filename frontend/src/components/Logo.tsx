import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "main" | "footer";
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ variant = "main", className, iconOnly = false }: LogoProps) {
  // Refined Mandala Flower icon (Matching Image 2)
  const FlowerIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
      {/* 8 refined mandala petals */}
      {[
        { color: "#E91E63", rotate: 0 },
        { color: "#9C27B0", rotate: 45 },
        { color: "#2196F3", rotate: 90 },
        { color: "#00BCD4", rotate: 135 },
        { color: "#4CAF50", rotate: 180 },
        { color: "#FFC107", rotate: 225 },
        { color: "#FF9800", rotate: 270 },
        { color: "#607D8B", rotate: 315 },
      ].map((p, i) => (
        <g key={i} transform={`rotate(${p.rotate} 50 50)`}>
          {/* Main Petal */}
          <path 
            d="M50 50 L65 35 Q75 25 50 5 Q25 25 35 35 Z" 
            fill={p.color} 
          />
          {/* Inner White Layer */}
          <path 
            d="M50 42 L58 34 Q62 28 50 15 Q38 28 42 34 Z" 
            fill="white" 
            opacity="0.6" 
          />
        </g>
      ))}
      
      {/* Central brown circle with Africa shape */}
      <circle cx="50" cy="50" r="11" fill="#4E342E" />
      <path d="M47 45 Q50 45 52 46 L53 48 Q52 50 52 52 L50 55 L47 52 Q46 50 46 48 Z" fill="#ffffff" />
    </svg>
  );

  if (variant === "footer") {
    return (
      <div className={cn("flex flex-col items-center text-center gap-1.5", className)}>
        <div className="w-12 h-12 flex items-center justify-center transform group-hover:scale-105 transition-transform">
          <FlowerIcon />
        </div>
        {!iconOnly && (
          <div className="flex flex-col items-center">
            <div className="flex items-center font-black text-lg tracking-tighter leading-none">
              <span className="text-white">DGIA</span>
              <span className="text-[#3DB6F2] ml-0.5">ESG</span>
            </div>
            <span className="text-[8px] font-black text-brand-gold uppercase tracking-[0.3em] mt-1">
              REVIEW
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center text-center -space-y-0.5", className)}>
      <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center transform group-hover:scale-105 transition-transform">
        <FlowerIcon />
      </div>
      {!iconOnly && (
        <div className="flex flex-col items-center">
          <div className="flex items-center font-black text-sm md:text-base tracking-tight leading-none">
            <span className="text-[#27B35A]">DGIA</span>
            <span className="text-[#3DB6F2]">ESG</span>
          </div>
          <span className="text-[7px] font-black text-muted-foreground/80 uppercase tracking-[0.2em] mt-1">
            Africa Certified
          </span>
        </div>
      )}
    </div>
  );
}
