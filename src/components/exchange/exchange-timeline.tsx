'use client';

import { useState } from 'react';
import { BriefcaseBusiness, GraduationCap, ChevronDown } from 'lucide-react';

type Entry = { id: number; degree: string; institution: string; duration: string; description: string; icon: string };
export function ExchangeTimeline({ items }: { items: Entry[] }) {
  const [filter, setFilter] = useState('All');
  const shown = items.filter(item => filter === 'All' || (filter === 'Work') === (item.icon === 'Briefcase'));
  return <div className="career-log">
    <div className="career-toolbar"><div role="group" aria-label="Filter career timeline">{['All', 'Work', 'Education'].map(value => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div><span role="status">{shown.length} ENTRIES</span></div>
    <ol>{shown.map(item => {
      const work = item.icon === 'Briefcase';
      return <li key={item.id}><span className="career-marker" aria-hidden="true">{work ? <BriefcaseBusiness size={13} /> : <GraduationCap size={13} />}</span><details><summary><div className="career-date"><time>{item.duration}</time><span>{work ? 'WORK' : 'EDUCATION'}</span></div><h3>{item.degree}</h3><p>{item.institution}</p><ChevronDown className="career-expand" size={14} aria-hidden="true" /></summary><div className="career-description">{item.description || 'No additional details available.'}</div></details></li>;
    })}</ol>
    {!shown.length && <p className="career-empty">No entries in this category.</p>}
  </div>;
}
