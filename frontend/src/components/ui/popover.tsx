import * as React from "react";
import { cn } from "@/lib/utils";

const PopoverInitial = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block w-full">{children}</div>;
};

const PopoverTriggerInitial = ({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // This is a bit hacky for a simplified version
  return React.cloneElement(children as React.ReactElement<any>, {
    onClick: (e: any) => {
      const clickEvent = (children as any).props.onClick;
      if (clickEvent) clickEvent(e);
      // We need a way to communicate to PopoverContent
    }
  });
};

// Re-doing Popover to be more functional
export const PopoverRoot = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="relative w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen });
        }
        return child;
      })}
    </div>
  );
};

export const PopoverTriggerFull = ({ children, isOpen, setIsOpen }: any) => {
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {children}
    </div>
  );
};

export const PopoverContent = ({ children, isOpen, setIsOpen, className, align = "start" }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      <div className={cn(
        "absolute top-full mt-2 bg-white border border-border rounded-xl shadow-xl z-50 p-4 min-w-[200px]",
        align === "start" ? "left-0" : "right-0",
        className
      )}>
        {children}
      </div>
    </>
  );
};

// To match the NewsPage.tsx usage:
// <Popover>
//   <PopoverTrigger asChild> <button>...</button> </PopoverTrigger>
//   <PopoverContent> ... </PopoverContent>
// </Popover>

const PopoverWrapper = ({ children }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="relative w-full">
      {React.Children.map(children, (child) => {
         if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen });
        }
        return child;
      })}
    </div>
  );
};

const PopoverTriggerWrapper = ({ children, asChild, isOpen, setIsOpen }: any) => {
  const handleClick = () => setIsOpen(!isOpen);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick
    });
  }
  
  return <div onClick={handleClick}>{children}</div>;
};

export { PopoverWrapper as Popover, PopoverTriggerWrapper as PopoverTrigger };
