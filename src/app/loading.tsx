export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center font-mono text-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="animate-pulse tracking-widest text-sm uppercase font-bold">Initializing System...</p>
      </div>
    </div>
  );
}
