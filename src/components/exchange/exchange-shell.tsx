'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

type ExtraLink = { name: string; href: string };
const desks = [
  { href: '/', name: 'Overview', kn: 'ಆರಂಭ', note: 'Start here' },
  { href: '/about', name: 'Profile', kn: 'ಪರಿಚಯ', note: 'Background & tools' },
  { href: '/projects', name: 'Projects', kn: 'ಕೆಲಸ', note: 'Builds & case studies' },
  { href: '/blog', name: 'Research', kn: 'ಬರಹ', note: 'Notes from the desk' },
];

function useDesk(extraLinks: ExtraLink[]) {
  const path = usePathname();
  const index = desks.findIndex(desk => path === desk.href || (desk.href !== '/' && path.startsWith(desk.href + '/')));
  const extra = extraLinks.find(item => item.href === path);
  const current = desks[index] ?? (extra ? { ...extra, kn: 'ಟಿಪ್ಪಣಿ', note: 'Desk notebook' } : { name: 'Off the tape', kn: 'ಹುಡುಕಾಟ', note: 'Portfolio index' });
  return { path, index, current, privatePage: /^\/(admin|login)(\/|$)/.test(path) };
}

export function ExchangeShell({ extraLinks }: { extraLinks: ExtraLink[] }) {
  const { path, index, current, privatePage } = useDesk(extraLinks);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { setMenuOpen(false); }, [path]);
  if (privatePage) return null;
  return <div className="exchange-only exchange-shell">
    <header className="exchange-topbar">
      <Link href="/" className="exchange-brand"><span lang="kn">ಉ</span><strong>Utkristi Exchange<span>UTKRISTI / PERSONAL PORTFOLIO</span></strong></Link>
    <nav id="exchange-navigation" className="exchange-navbar" data-open={menuOpen} aria-label="Exchange navigation" onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false); }}>
      {desks.map(({ href, name, kn }, i) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={index === i ? (path === href ? 'page' : 'location') : undefined}><small>0{i + 1}</small>{name}<span lang="kn">{kn}</span></Link>)}
      {extraLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} aria-current={path === link.href ? 'page' : undefined}>{link.name}</Link>)}
      <Link href="/#contact" onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></Link>
    </nav>
      <div className="exchange-tools">
        <ThemeToggle />
        <button type="button" className="exchange-menu-toggle appearance-trigger" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="exchange-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </header>

    {path !== '/' && <div className="exchange-page-strip">
      <div><Link href="/">SESSION</Link><span> / </span><span>{index >= 0 ? `0${index + 1}` : 'NOTEBOOK'} / {current.name}</span></div>
      <span className="exchange-chapter-note">{current.note}</span>
      <span lang="kn">{current.kn}</span>
    </div>}
  </div>;
}

export function ExchangeColophon({ extraLinks }: { extraLinks: ExtraLink[] }) {
  const { path, index, privatePage } = useDesk(extraLinks);
  if (privatePage) return null;
  const next = desks[(index + 1) % desks.length];
  const previous = index > 0 ? desks[index - 1] : null;
  return <footer className="exchange-only exchange-colophon">
    <nav aria-label="Continue the session">
      {previous ? <Link href={previous.href}><small><ArrowLeft className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /> PREVIOUS DESK</small><strong>{previous.name}</strong></Link> : <Link href="/#contact"><small><ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /> GET IN TOUCH</small><strong>Contact desk</strong></Link>}
      <Link href={next.href}><small>{next.href === '/' ? 'BACK TO THE BELL' : 'NEXT DESK'} <ArrowRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></small><strong>{next.name}</strong></Link>
    </nav>
    <div className="exchange-colophon-end"><div><span lang="kn">ಮತ್ತೆ ಸಿಗೋಣ.</span><p>Until next time, from the Exchange.</p></div>
      <div className="exchange-colophon-links">{extraLinks.map(link => <Link key={link.href} href={link.href} aria-current={link.href === path ? 'page' : undefined}>{link.name}</Link>)}<a href="https://github.com/utkarsh-1912">GitHub <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></a><a href="https://www.linkedin.com/in/utkarsh-gupta-3a374119a/">LinkedIn <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></a></div>
    </div>
  </footer>;
}
