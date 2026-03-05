'use client';

import { useState, useEffect } from 'react';

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY, currentTarget } = event;
      if (currentTarget instanceof HTMLElement) {
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth) * 100;
        const y = (clientY / innerHeight) * 100;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:28px_48px]"></div>
      <div
        className="absolute inset-0 h-full w-full bg-[radial-gradient(circle_400px_at_50%_300px,#3F51B533,transparent)] transition-all duration-300"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x}% ${mousePosition.y}%, #3F51B533, transparent)`,
        }}
      ></div>
    </div>
  );
}
