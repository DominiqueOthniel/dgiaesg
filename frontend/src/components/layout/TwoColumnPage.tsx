import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TwoColumnPageProps = {
  title: string;
  subtitle?: string;
  headerMeta?: ReactNode;
  className?: string;
  children: {
    main: ReactNode;
    sidebar?: ReactNode;
  };
};

export function TwoColumnPage({ title, subtitle, headerMeta, children, className }: TwoColumnPageProps) {
  return (
    <div className={cn("py-24", className)}>
      <div className="editorial-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 border-b-4 border-brand-secondary/10 pb-6">
          <div>
            {headerMeta && (
              <span className="metadata mb-2 block text-brand-primary">{headerMeta}</span>
            )}
            <h1>{title}</h1>
            {subtitle && (
              <p className="text-xs text-text-muted max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.3fr)] gap-10">
          <div>
            {children.main}
          </div>
          {children.sidebar && (
            <aside className="space-y-10 lg:border-l lg:border-surface-muted lg:pl-8">
              {children.sidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

