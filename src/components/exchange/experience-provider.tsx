'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Experience = 'daylight' | 'exchange';
const ExperienceContext = createContext({ experience: 'daylight' as Experience, setExperience: (_: Experience) => {} });

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [experience, update] = useState<Experience>('daylight');
  const pathname = usePathname();
  const privatePage = pathname.startsWith('/admin') || pathname.startsWith('/login');
  useEffect(() => {
    try { update(localStorage.getItem('utkristi-experience') === 'exchange' ? 'exchange' : 'daylight'); } catch { /* optional storage */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.experience = privatePage ? 'daylight' : experience;
  }, [experience, privatePage, ready]);
  const setExperience = (next: Experience) => {
    update(next);
    document.documentElement.dataset.experience = next;
    try { localStorage.setItem('utkristi-experience', next); } catch { /* optional storage */ }
  };
  return <ExperienceContext.Provider value={{ experience, setExperience }}>{children}</ExperienceContext.Provider>;
}

export const useExperience = () => useContext(ExperienceContext);
