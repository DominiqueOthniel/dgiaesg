import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
        const baseStyles = "btn-base";

        const variants = {
            default: "bg-brand-secondary text-white hover:bg-brand-secondary/90 shadow-sm",
            primary: "bg-brand-accent text-white hover:bg-brand-accent/90 shadow-sm",
            destructive: "bg-error text-white hover:bg-error/90 shadow-sm",
            outline: "border border-slate-200 bg-transparent text-text-main hover:bg-slate-50",
            secondary: "bg-surface-muted text-text-main hover:bg-surface-muted/80",
            ghost: "hover:bg-slate-100 text-text-muted hover:text-text-main",
            link: "text-brand-accent underline-offset-4 hover:underline shadow-none p-0 h-auto",
        };

        const sizes = {
            default: "h-11 px-6",
            sm: "h-9 px-3 text-xs",
            lg: "h-12 px-8 text-base",
            icon: "h-10 w-10",
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
