// ---------------------------------------------------------------------------
// FilterDropdown — professional pill-style filter button with an animated
// dropdown panel for sub-categories. Replaces the cramped horizontal chip
// rows on NewsPage + ThemePillarPage.
//
// • Active state highlights with brand gold accent.
// • Popover content uses Radix animations (already wired in shadcn).
// • Sub-categories appear as a clean grid inside the popover.
// ---------------------------------------------------------------------------

import { ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  /** Short label shown on the trigger pill before the active value. */
  triggerLabel: string;
  options: FilterOption[];
  /** Currently selected value. */
  value: string;
  onChange: (value: string) => void;
  /** Sub-options shown only when `value` is selected (optional). */
  subOptionsByValue?: Record<string, FilterOption[]>;
  /** Currently selected sub-value (optional). */
  subValue?: string;
  onSubChange?: (subValue: string) => void;
  /** Tailwind classes for the active accent — defaults to brand gold. */
  accentClass?: string;
  /** Icon rendered on the left of the trigger. */
  icon?: React.ReactNode;
}

export function FilterDropdown({
  triggerLabel,
  options,
  value,
  onChange,
  subOptionsByValue,
  subValue,
  onSubChange,
  accentClass = "bg-[hsl(var(--brand-gold)/0.18)] border-[hsl(var(--brand-gold)/0.6)] text-foreground",
  icon,
}: FilterDropdownProps) {
  const activeOption = options.find((o) => o.value === value) ?? options[0];
  const subs = subOptionsByValue?.[value];
  const hasSubs = Boolean(subs && subs.length > 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group inline-flex items-center gap-2 h-10 pl-3 pr-2.5 rounded-full border text-xs font-black uppercase tracking-[0.14em] transition-all shadow-sm hover:shadow-md",
            value !== "all"
              ? accentClass
              : "bg-white/80 border-white/70 text-foreground hover:bg-white hover:border-[hsl(var(--brand-gold)/0.5)]",
          )}
        >
          {icon}
          <span className="opacity-70 normal-case tracking-normal text-[10px] font-semibold">
            {triggerLabel}
          </span>
          <span className="truncate max-w-[140px]">{activeOption.label}</span>
          <ChevronDown className="w-3.5 h-3.5 chev-rotate opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-72 p-2 rounded-2xl border border-[hsl(var(--brand-gold)/0.35)] shadow-[0_24px_60px_-20px_hsl(var(--brand-deep)/0.45)] bg-card/95 backdrop-blur-xl"
      >
        <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          {triggerLabel}
        </div>
        <ul className="grid grid-cols-1 gap-0.5">
          {options.map((opt) => {
            const isActive = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  onClick={() => {
                    onChange(opt.value);
                    if (onSubChange) onSubChange("all");
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 h-9 rounded-lg text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-[hsl(var(--brand-gold)/0.15)] text-foreground"
                      : "hover:bg-muted/60 text-foreground/80",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isActive && (
                    <Check className="w-3.5 h-3.5 text-[hsl(var(--brand-gold-dark))]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {hasSubs && onSubChange && (
          <div className="mt-2 pt-2 border-t border-[hsl(var(--brand-gold)/0.2)]">
            <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Sous-catégories
            </div>
            <div className="flex flex-wrap gap-1.5 px-1 pb-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {subs!.map((s) => {
                const active = subValue === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => onSubChange(s.value)}
                    className={cn(
                      "h-7 px-2.5 rounded-full text-[11px] font-bold border transition-all",
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-white/60 border-border text-muted-foreground hover:text-foreground hover:bg-white",
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
