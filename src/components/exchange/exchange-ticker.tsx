'use client';
import { useState } from 'react';
import { Pause, Play } from 'lucide-react';

const items = ['UTK / EXCHANGE', 'ELECTRONIC TRADING', 'FIX PROTOCOL', 'MARKET DATA / ORDER BOOK / EXECUTION', 'ಬೆಂಗಳೂರು · ಕರ್ನಾಟಕ', 'BUILD / OBSERVE / REFINE'];
export function ExchangeTicker() {
  const [paused, setPaused] = useState(false);
  return <div className="exchange-ticker" data-paused={paused}>
    <span className="ticker-label">SYSTEMS WIRE</span>
    <div className="ticker-window"><div className="ticker-track">{[0, 1].map(copy => <div className="ticker-copy" key={copy} aria-hidden={copy === 1 ? true : undefined}>{items.map((item, i) => <span key={item} lang={i === 4 ? 'kn' : undefined}><i aria-hidden="true" />{item}</span>)}</div>)}</div></div>
    <button aria-label={paused ? 'Resume ticker' : 'Pause ticker'} onClick={() => setPaused(!paused)}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>
  </div>;
}
