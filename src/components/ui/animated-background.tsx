export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none"
    >
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent rounded-full filter blur-3xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-secondary rounded-full filter blur-2xl opacity-10 animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-primary/40 rounded-lg filter blur-3xl opacity-20 animate-pulse-slow animation-delay-6000"></div>
    </div>
  );
}
