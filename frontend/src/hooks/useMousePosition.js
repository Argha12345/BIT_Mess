import { useState, useEffect } from 'react';

export function useMousePosition(containerRef) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      setMousePos({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y))
      });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setMousePos({ x: 0, y: 0 });
      setIsHovering(false);
    };

    const panel = containerRef.current;
    if (panel) {
      window.addEventListener('mousemove', handleMouseMove);
      panel.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (panel) {
        panel.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [containerRef]);

  return { mousePos, isHovering };
}
