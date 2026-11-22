'use client';

import { ChartNoAxesCombined, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useExperience } from '@/components/exchange/experience-provider';

const modes = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'exchange', label: 'Exchange', Icon: ChartNoAxesCombined },
] as const;

/**
 * One button that cycles Light → Dark → Exchange (the trading theme) → Light.
 * The icon shows the current mode. `allowExchange={false}` (the admin) cycles light/dark only.
 */
export function ThemeToggle({ allowExchange = true }: { allowExchange?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { experience, setExperience } = useExperience();
  const available = modes.filter(item => allowExchange || item.value !== 'exchange');
  const mode = allowExchange && experience === 'exchange' ? 'exchange' : theme === 'dark' ? 'dark' : 'light';
  const index = available.findIndex(item => item.value === mode);
  const current = available[index];
  const next = available[(index + 1) % available.length];
  const Icon = current.Icon;

  return <button
    type="button"
    className="appearance-trigger appearance-cycle"
    data-mode={mode}
    aria-label={`Appearance: ${current.label}. Switch to ${next.label}`}
    title={`${current.label} → ${next.label}`}
    onClick={() => {
      if (next.value === 'exchange') setExperience('exchange');
      else {
        setTheme(next.value);
        if (allowExchange) setExperience('daylight');
      }
    }}
  >
    <span key={mode} className="appearance-cycle-icon"><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></span>
    <span className="sr-only" role="status">{current.label} appearance</span>
  </button>;
}
