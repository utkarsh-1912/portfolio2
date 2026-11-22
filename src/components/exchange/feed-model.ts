export type FeedEvent = { seq: number; time: string; kind: 'ADD' | 'CANCEL' | 'TRADE'; side: 'BID' | 'ASK'; level: number; qty: number; price: number };
export type FeedState = { seq: number; bids: number[]; asks: number[]; events: FeedEvent[]; trades: FeedEvent[] };
export const initialFeed: FeedState = { seq: 480120, bids: [420, 680, 350, 920, 560], asks: [380, 540, 810, 460, 720], events: [], trades: [] };

// Deterministic, bounded market-by-price replay. Prices use integer cents.
// Display cadence is deliberately slowed; timestamps are synthetic exchange time.
export function advanceFeed(state: FeedState): FeedState {
  const seq = state.seq + 1;
  const n = seq - 480120;
  let kind = (['ADD', 'CANCEL', 'ADD', 'TRADE', 'CANCEL', 'TRADE'] as const)[(n - 1) % 6];
  const side = n % 2 ? 'BID' : 'ASK';
  const level = kind === 'TRADE' ? 0 : n % 5;
  const bids = [...state.bids], asks = [...state.asks];
  const book = side === 'BID' ? bids : asks;
  const requested = 10 + (n * 17) % 90;
  if (kind !== 'ADD' && book[level] <= requested + 10) kind = 'ADD';
  if (kind === 'ADD' && book[level] > 2000) kind = 'CANCEL';
  const qty = kind === 'ADD' ? requested : Math.min(requested, Math.max(0, book[level] - 10));
  book[level] += kind === 'ADD' ? qty : -qty;
  const micros = n * 137;
  const seconds = Math.floor(micros / 1000000) % 60;
  const event: FeedEvent = {
    seq, kind, side, level, qty,
    price: side === 'BID' ? 102470 - level * 5 : 102480 + level * 5,
    time: '09:15:' + String(seconds).padStart(2, '0') + '.' + String(micros % 1000000).padStart(6, '0'),
  };
  return { seq, bids, asks, events: [event, ...state.events].slice(0, 6), trades: kind === 'TRADE' ? [event, ...state.trades].slice(0, 4) : state.trades };
}
