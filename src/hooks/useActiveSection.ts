import { useState, useEffect, useRef } from 'react';

export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');
  const rafRef = useRef(0);

  useEffect(() => {
    const check = () => {
      let bestSection = sectionIds[0];
      let bestDistance = Infinity;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.left);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestSection = id;
        }
      }

      setActiveSection((prev) => (prev === bestSection ? prev : bestSection));
      rafRef.current = requestAnimationFrame(check);
    };

    rafRef.current = requestAnimationFrame(check);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sectionIds]);

  return activeSection;
}
