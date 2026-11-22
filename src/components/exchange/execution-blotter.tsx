'use client';

import { useState } from 'react';

const orders = [
  { id: 'DEMO-001', symbol: 'ALPHA', side: 'BUY', qty: 1200, limit: '102.40', state: 'Working' },
  { id: 'DEMO-002', symbol: 'BETA', side: 'SELL', qty: 800, limit: '86.15', state: 'Filled' },
  { id: 'DEMO-003', symbol: 'GAMMA', side: 'BUY', qty: 500, limit: '241.70', state: 'Staged' },
] as const;

export function ExecutionBlotter() {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string>(orders[0].id);
  const [filter, setFilter] = useState('All');
  const [message, setMessage] = useState('Select an order to inspect its execution ticket.');
  const order = orders.find(item => item.id === selected)!;
  const status = statuses[order.id] ?? order.state;
  const visible = orders.filter(item => filter === 'All' || (statuses[item.id] ?? item.state) === filter);
  return <section className="execution-workspace" aria-label="Simulated execution workstation">
    <div className="exchange-panel-title"><span>EXECUTION WORKSPACE</span><span>SIMULATION / NO MARKET CONNECTION</span></div>
    <div className="execution-toolbar"><div role="group" aria-label="Filter simulated orders">{['All', 'Staged', 'Working', 'Filled', 'Cancelled'].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div><button onClick={() => { setStatuses({}); setFilter('All'); setMessage('Simulation reset.'); }}>Reset demo</button></div>
    <div className="execution-grid">
      <div className="execution-table-scroll"><table><caption className="sr-only">Simulated orders. Select an order ID to inspect its ticket.</caption><thead><tr>{['Order ID', 'Symbol', 'Side', 'Quantity', 'Limit', 'Status'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{visible.map(item => <tr key={item.id} data-selected={selected === item.id}><td><button aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setMessage('Order selected: ' + item.id); }}>{item.id}</button></td><td>{item.symbol}</td><td className={item.side === 'BUY' ? 'execution-buy' : 'execution-sell'}>{item.side}</td><td>{item.qty.toLocaleString('en-US')}</td><td>{item.limit}</td><td>{statuses[item.id] ?? item.state}</td></tr>)}</tbody></table>{visible.length === 0 && <p className="execution-empty">No {filter.toLowerCase()} orders in this simulation.</p>}</div>
      <div className="execution-ticket"><div className="exchange-panel-title"><span>ORDER TICKET</span><span>{order.id}</span></div><dl><div><dt>Instrument</dt><dd>{order.symbol} / DEMO</dd></div><div><dt>Side / quantity</dt><dd>{order.side} / {order.qty}</dd></div><div><dt>Limit / status</dt><dd>{order.limit} / {status}</dd></div></dl><div className="execution-ticket-actions"><button disabled={status !== 'Staged'} onClick={() => { setStatuses(prev => ({...prev, [order.id]: 'Working'})); setMessage(order.id + ': simulated routing complete.'); }}>Simulate route</button><button disabled={status !== 'Working' && status !== 'Staged'} onClick={() => { setStatuses(prev => ({...prev, [order.id]: 'Cancelled'})); setMessage(order.id + ': simulated cancellation complete.'); }}>Cancel demo order</button></div></div>
    </div>
    <div className="execution-status" role="status">{message}</div>
  </section>;
}
