'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward, Activity } from 'lucide-react';
import { useExperience } from './experience-provider';
import { advanceFeed, initialFeed } from './feed-model';

const price = (cents: number) => (cents / 100).toFixed(2);
export function MarketDemo() {
  const [feed, setFeed] = useState(initialFeed);
  const [view, setView] = useState<'depth' | 'book' | 'tape'>('depth');
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const panel = useRef<HTMLElement>(null);
  const { experience } = useExperience();
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { setReduced(query.matches); setRunning(!query.matches); };
    sync(); query.addEventListener('change', sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (panel.current) observer.observe(panel.current);
    const onVisibility = () => setForeground(!document.hidden);
    onVisibility(); document.addEventListener('visibilitychange', onVisibility);
    return () => { query.removeEventListener('change', sync); observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  const playing = running;
  useEffect(() => {
    if (!playing || !visible || !foreground || experience !== 'exchange') return;
    const timer = setInterval(() => setFeed(advanceFeed), 700);
    return () => clearInterval(timer);
  }, [playing, visible, foreground, experience]);
  const last = feed.events[0];
  const totalBid = feed.bids.reduce((sum, n) => sum + n, 0);
  const totalAsk = feed.asks.reduce((sum, n) => sum + n, 0);
  const maxQty = Math.max(...feed.bids, ...feed.asks);
  const depthArea = (sizes: number[], bid: boolean) => {
    const maxTotal = Math.max(totalBid, totalAsk);
    let total = 0;
    let path = `M${bid ? 232 : 248},100`;
    sizes.forEach((size, i) => {
      total += size;
      const x = bid ? 232 - i * 58 : 248 + i * 58;
      const y = 100 - total / maxTotal * 92;
      path += ` H${x} V${y}`;
    });
    return path + ` V100 Z`;
  };

  return <section ref={panel} className="exchange-market tick-terminal" aria-label="Simulated tick-by-tick market feed">
    <div className="tick-toolbar">
      <span className="tick-state" data-running={playing}><i />{playing ? 'REPLAYING' : 'PAUSED'}</span>
      <div>
        <button aria-label={playing ? 'Pause market replay' : 'Play market replay'} type="button" onClick={() => setRunning(value => !value)}>{playing ? <Pause size={14} /> : <Play size={14} />}<span>{playing ? 'Pause' : 'Play'}</span></button>
        <button aria-label="Advance simulated market tick" onClick={() => { setRunning(false); setFeed(advanceFeed); }}><StepForward size={14} /><span>Step</span></button>
        <button aria-label="Reset market replay" onClick={() => { setRunning(false); setFeed(initialFeed); }}><RotateCcw size={14} /><span>Reset</span></button>
      </div>
    </div>
    <div className="tick-quotes"><div><small>BEST BID</small><strong className="tick-bid">1,024.70</strong><span>{feed.bids[0]} units</span></div><div><small>SPREAD</small><strong>0.10</strong><span>2 ticks</span></div><div><small>BEST ASK</small><strong className="tick-ask">1,024.80</strong><span>{feed.asks[0]} units</span></div></div>
    <div className="tick-sequence"><span>SEQ <b>{feed.seq}</b></span><span>MBP / 5 LEVELS</span><span>STEP 0.05</span></div>
    <div className="market-view-controls" role="group" aria-label="Market panel view">
      <button type="button" aria-pressed={view === 'depth'} onClick={() => setView('depth')}>Depth chart</button>
      <button type="button" aria-pressed={view === 'book'} onClick={() => setView('book')}>Order book</button>
      <button type="button" aria-pressed={view === 'tape'} onClick={() => setView('tape')}>Event tape</button>
    </div>
    <div key={view} className="market-view-body">
    {view === 'depth' ? <div>
    <div className="depth-chart" aria-label="Cumulative simulated order book depth">
      <div className="depth-chart-heading"><span>BID DEPTH</span><small>CUMULATIVE SIZE / 5 LEVELS</small><span>ASK DEPTH</span></div>
      <svg viewBox="0 0 480 100" preserveAspectRatio="none" role="img" aria-label={`Cumulative depth: ${totalBid} bid units and ${totalAsk} ask units`}>
        {[25,50,75].map(y => <path key={y} d={`M0 ${y}H480`} stroke="#292929" strokeWidth="1" />)}
        <path d={depthArea(feed.bids, true)} fill="#72d7ff22" stroke="#72d7ff" strokeWidth="1.5" />
        <path d={depthArea(feed.asks, false)} fill="#ffaaaa22" stroke="#ffaaaa" strokeWidth="1.5" />
        <path d="M240 0V100" stroke="#777" strokeDasharray="3 4" />
      </svg>
      <div className="depth-chart-scale"><span>1,024.50</span><span>SPREAD 0.10</span><span>1,025.00</span></div>
    </div>
    <div className="depth-totals"><div><span>Total bid size</span><strong>{totalBid.toLocaleString('en-US')} <small>units</small></strong></div><div><span>Total ask size</span><strong>{totalAsk.toLocaleString('en-US')} <small>units</small></strong></div></div>
    </div> : view === 'book' ? <div>
    <table className="tick-depth"><caption className="sr-only">Simulated market depth</caption><thead><tr><th>Bid size</th><th>Bid</th><th>Ask</th><th>Ask size</th></tr></thead><tbody>{feed.bids.map((qty, i) => <tr key={i}>
      <td key={'b'+i+(last?.side === 'BID' && last.level === i ? feed.seq : '')} className={last?.side === 'BID' && last.level === i ? 'tick-update' : ''}><span className="depth-bar bid-bar" style={{width:qty/maxQty*100+'%'}} />{qty}</td>
      <td className="tick-bid">{price(102470-i*5)}</td><td className="tick-ask">{price(102480+i*5)}</td>
      <td key={'a'+i+(last?.side === 'ASK' && last.level === i ? feed.seq : '')} className={last?.side === 'ASK' && last.level === i ? 'tick-update' : ''}><span className="depth-bar ask-bar" style={{width:feed.asks[i]/maxQty*100+'%'}} />{feed.asks[i]}</td>
    </tr>)}</tbody></table>
    <div className="tick-imbalance"><span>DEPTH BALANCE</span><div><i style={{width:totalBid/(totalBid+totalAsk)*100+'%'}} /></div><span>{Math.round(totalBid/(totalBid+totalAsk)*100)}% BID</span></div>
    </div> : <div>
    <div className="exchange-panel-title"><span>INCREMENTAL EVENT FEED</span><span>EXCHANGE TIME / SYNTHETIC</span></div>
    <div className="tick-events" data-empty={!last}><table><caption className="sr-only">Most recent book events</caption><thead><tr><th>Sequence / time</th><th>Event</th><th>Side</th><th>Qty</th></tr></thead><tbody>{feed.events.map(event => <tr key={event.seq} className="tick-arrival"><td>{event.seq}<small>{event.time}</small></td><td data-kind={event.kind}>{event.kind}</td><td>{event.side}</td><td>{event.qty}</td></tr>)}</tbody></table>{!last && <p>Snapshot loaded. Step forward to inspect the first event.</p>}</div>
    </div>}
    </div>
    <div className="tick-trades"><span>LAST EXECUTION</span>{feed.trades[0] ? <b key={feed.trades[0].seq} className="tick-arrival">{price(feed.trades[0].price)} × {feed.trades[0].qty} <small>{feed.trades[0].side === 'ASK' ? 'BUY AGGRESSOR' : 'SELL AGGRESSOR'}</small></b> : <b>Awaiting trade event</b>}</div>
  </section>;
}
