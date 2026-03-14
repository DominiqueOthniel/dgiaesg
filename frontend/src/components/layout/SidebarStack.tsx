import type { ReactNode } from "react";

type SidebarStackProps = {
  children: ReactNode;
};

export function SidebarStack({ children }: SidebarStackProps) {
  return <div className="space-y-10">{children}</div>;
}

