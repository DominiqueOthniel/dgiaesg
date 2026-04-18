import { useEffect, useState, useRef } from "react";

export function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [direction, setDirection] = useState<"down" | "up">("down");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentScrollY = window.scrollY;
        
        // Update direction only when visibility changes or while visible
        if (currentScrollY > lastScrollY.current) {
          setDirection("down");
        } else if (currentScrollY < lastScrollY.current) {
          setDirection("up");
        }
        
        setIsVisible(entry.isIntersecting);
        lastScrollY.current = currentScrollY;
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it enters the viewport fully
      }
    );

    const el = elementRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return { elementRef, isVisible, direction };
}
