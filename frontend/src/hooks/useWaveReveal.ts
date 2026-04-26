// ---------------------------------------------------------------------------
// useWaveReveal — IntersectionObserver hook that toggles `.wave-active` on a
// container when it scrolls into view, triggering the row-by-row card cascade
// defined in styles.css (.wave-item / .wave-active).
//
// Usage:
//   const ref = useWaveReveal<HTMLDivElement>();
//   <div ref={ref} className="grid ...">
//     {items.map((it, i) => (
//       <div className="wave-item" style={{ "--wave-delay": `${i * 90}ms` }}>
//     ))}
//   </div>
// ---------------------------------------------------------------------------

import { useEffect, useRef } from "react";

export function useWaveReveal<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("wave-active");
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.classList.add("wave-active");
        } else {
          // Re-trigger when scrolling back up
          node.classList.remove("wave-active");
        }
      });
    }, options);
    obs.observe(node);
    return () => obs.disconnect();
  }, [options]);

  return ref;
}
