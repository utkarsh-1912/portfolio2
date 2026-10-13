'use client';

import { useEffect, useState } from 'react';

interface LocalClockProps {
  /** IANA time zone, e.g. "Asia/Kolkata". */
  timeZone: string;
  label: string;
  className?: string;
}

/** A live ticking clock. Renders only after mount to avoid hydration mismatches. */
export function LocalClock({ timeZone, label, className }: LocalClockProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <span className={className}>
      {label} <span className="tabular-nums text-foreground">{time ?? '--:--:--'}</span>
    </span>
  );
}
