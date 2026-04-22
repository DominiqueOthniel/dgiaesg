import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2";

    const variants = {
        default: "border-transparent bg-brand-secondary text-white",
        secondary: "border-transparent bg-slate-100 text-slate-900",
        destructive: "border-transparent bg-error/10 text-error border-error/20",
        outline: "text-text-muted border-slate-200 bg-white",
        success: "border-transparent bg-success/10 text-success border-success/20",
        warning: "border-transparent bg-warning/10 text-warning border-warning/20",
    };

    return (
        <div className={cn(baseStyles, variants[variant], className)} {...props} />
    );
}

export { Badge };
