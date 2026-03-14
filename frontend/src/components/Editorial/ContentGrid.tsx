import React from "react";
import { cn } from "../../lib/utils";

interface ContentGridProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    className?: string;
    asymmetric?: boolean;
}

const ContentGrid = ({ children, sidebar, className, asymmetric = true }: ContentGridProps) => {
    return (
        <section className={cn("editorial-container py-12 md:py-20", className)}>
            <div className={cn(
                "grid grid-cols-1 gap-12",
                sidebar ? (asymmetric ? "lg:grid-cols-3" : "lg:grid-cols-2") : "grid-cols-1"
            )}>
                {/* Main Content Area */}
                <div className={cn(
                    "flex flex-col gap-12",
                    sidebar && asymmetric ? "lg:col-span-2" : ""
                )}>
                    {children}
                </div>

                {/* Sidebar Area */}
                {sidebar && (
                    <aside className="flex flex-col gap-12 border-t-4 border-brand-secondary lg:border-t-0 lg:border-l lg:border-surface-muted lg:pl-12 pt-12 lg:pt-0">
                        {sidebar}
                    </aside>
                )}
            </div>
        </section>
    );
};

export default ContentGrid;
