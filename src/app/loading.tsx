// Thin top progress bar while a page loads; the header and footer stay in place around it
export default function Loading() {
  return (
    <div role="progressbar" aria-label="Loading" className="fixed inset-x-0 top-0 z-[150] h-0.5 overflow-hidden bg-transparent">
      <div className="h-full w-1/3 animate-[loading-bar_1.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-primary" />
    </div>
  );
}
