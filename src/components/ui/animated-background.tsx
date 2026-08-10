'use client';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
    </div>
  );
}
