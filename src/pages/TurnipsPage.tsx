import { useState, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';

interface TurnipWeek {
  buyPrice: number | null;
  prices: (number | null)[];  // 12 slots: Mon AM, Mon PM, Tue AM, ... Sat PM
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STORAGE_KEY = 'acnh-turnip-data';

function loadTurnipData(): TurnipWeek {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmpty();
    return JSON.parse(raw) as TurnipWeek;
  } catch {
    return getEmpty();
  }
}

function saveTurnipData(data: TurnipWeek): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getEmpty(): TurnipWeek {
  return { buyPrice: null, prices: Array(12).fill(null) };
}

type Pattern = 'decreasing' | 'small-spike' | 'large-spike' | 'fluctuating' | 'unknown';

function detectPattern(buy: number, prices: (number | null)[]): { pattern: Pattern; confidence: string } {
  const filled = prices.filter((p): p is number => p !== null);
  if (!buy || filled.length < 3) return { pattern: 'unknown', confidence: 'Need more data' };

  const ratios = prices.map((p) => (p !== null ? p / buy : null));
  const filledRatios = ratios.filter((r): r is number => r !== null);

  // Check for large spike: any price > 2x buy
  const hasLargeSpike = filledRatios.some((r) => r >= 2.0);
  if (hasLargeSpike) return { pattern: 'large-spike', confidence: 'High' };

  // Check for small spike: prices between 1.4-2.0x
  const hasSmallSpike = filledRatios.some((r) => r >= 1.4 && r < 2.0);
  if (hasSmallSpike) return { pattern: 'small-spike', confidence: 'Medium' };

  // Check for consistently decreasing
  const allDecreasing = filledRatios.every((r) => r < 1.0);
  if (allDecreasing && filled.length >= 4) return { pattern: 'decreasing', confidence: 'High' };
  if (allDecreasing) return { pattern: 'decreasing', confidence: 'Medium' };

  // Fluctuating: mix of ups and downs, nothing too high
  const maxRatio = Math.max(...filledRatios);
  if (maxRatio < 1.4) return { pattern: 'fluctuating', confidence: 'Medium' };

  return { pattern: 'unknown', confidence: 'Need more data' };
}

const PATTERN_INFO: Record<Pattern, { label: string; emoji: string; color: string; description: string }> = {
  'large-spike': {
    label: 'Large Spike',
    emoji: '',
    color: 'text-leaf-dark',
    description: 'Prices spike to 2-6x your buy price! Sell at the peak (usually Wed/Thu).',
  },
  'small-spike': {
    label: 'Small Spike',
    emoji: '',
    color: 'text-sky-dark',
    description: 'A moderate spike to 1.4-2x. Not as dramatic but still profitable.',
  },
  'fluctuating': {
    label: 'Fluctuating',
    emoji: '',
    color: 'text-golden-dark',
    description: 'Prices bounce around your buy price. Sell if you see anything above what you paid.',
  },
  'decreasing': {
    label: 'Decreasing',
    emoji: '',
    color: 'text-coral-dark',
    description: 'Prices only go down all week. Sell on a friend\'s island or cut your losses early.',
  },
  'unknown': {
    label: 'Not Sure Yet',
    emoji: '',
    color: 'text-brown-light',
    description: 'Enter more prices to help identify the pattern.',
  },
};

const TIPS = [
  { title: 'Buy on Sunday', text: 'Daisy Mae visits every Sunday morning (5 AM - 12 PM) selling turnips for 90-110 Bells each.' },
  { title: 'Prices Change Twice Daily', text: 'Nook\'s Cranny updates turnip prices at noon. Check both AM (8-12) and PM (12-10) prices.' },
  { title: 'Turnips Rot on Sunday', text: 'Any unsold turnips will rot when the next Sunday arrives. They also rot if you time travel backwards!' },
  { title: 'Don\'t Put Them in Storage', text: 'Turnips can\'t go in your home storage. Place them on the ground inside your house or outside.' },
  { title: 'Visit Friends', text: 'If your prices are bad, visit a friend\'s island with better prices to sell there instead.' },
  { title: 'Track Every Price', text: 'Even low prices help predict the pattern. Enter both AM and PM prices each day for the best prediction.' },
  { title: 'The 4 Patterns', text: 'Prices follow one of 4 patterns each week: Fluctuating, Small Spike, Large Spike, or Decreasing.' },
  { title: 'Pattern Odds', text: 'After a Decreasing week, you\'re very likely to get a Large Spike next week. Keep track across weeks!' },
];

export function TurnipsPage() {
  const [data, setData] = useState<TurnipWeek>(loadTurnipData);

  const updateData = (updated: TurnipWeek) => {
    setData(updated);
    saveTurnipData(updated);
  };

  const setBuyPrice = (value: string) => {
    const num = value ? parseInt(value, 10) : null;
    updateData({ ...data, buyPrice: num && !isNaN(num) ? num : null });
  };

  const setPrice = (index: number, value: string) => {
    const num = value ? parseInt(value, 10) : null;
    const prices = [...data.prices];
    prices[index] = num && !isNaN(num) ? num : null;
    updateData({ ...data, prices });
  };

  const resetWeek = () => updateData(getEmpty());

  const { pattern, confidence } = useMemo(
    () => (data.buyPrice ? detectPattern(data.buyPrice, data.prices) : { pattern: 'unknown' as Pattern, confidence: 'Enter buy price' }),
    [data.buyPrice, data.prices]
  );

  const patternInfo = PATTERN_INFO[pattern];
  const filledPrices = data.prices.filter((p): p is number => p !== null);
  const maxPrice = filledPrices.length > 0 ? Math.max(...filledPrices) : 0;
  const minPrice = filledPrices.length > 0 ? Math.min(...filledPrices) : 0;
  const profit = data.buyPrice && maxPrice > 0 ? maxPrice - data.buyPrice : null;

  // For the price chart
  const chartMax = Math.max(maxPrice, data.buyPrice || 0, 200);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-brown-dark font-heading">Stalk Market</h2>
          <p className="text-sm text-brown-light mt-0.5">Track your turnip prices this week</p>
        </div>
        <button
          onClick={resetWeek}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coral/10 text-coral-dark text-sm font-bold hover:bg-coral/20 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Week
        </button>
      </div>

      {/* Buy Price + Pattern */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-[16px] shadow-card p-5">
          <h3 className="text-sm font-bold text-brown-light mb-3">Sunday Buy Price</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={data.buyPrice ?? ''}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="e.g. 98"
              className="w-full px-4 py-3 rounded-xl bg-sand/30 border border-sand-dark/20 text-brown-dark font-bold text-lg text-center focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all"
            />
            <span className="text-brown-light font-semibold text-sm whitespace-nowrap">Bells</span>
          </div>
          {data.buyPrice && (
            <p className="text-xs text-brown-light mt-2 text-center">
              You paid <span className="font-bold text-golden-dark">{(data.buyPrice * 10).toLocaleString()}</span> Bells per stack of 10
            </p>
          )}
        </div>

        <div className={`bg-white rounded-[16px] shadow-card p-5 border-2 ${pattern !== 'unknown' ? 'border-leaf/20' : 'border-transparent'}`}>
          <h3 className="text-sm font-bold text-brown-light mb-2">Predicted Pattern</h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{patternInfo.emoji}</span>
            <span className={`text-lg font-extrabold ${patternInfo.color}`}>{patternInfo.label}</span>
          </div>
          <p className="text-xs text-brown-light">{patternInfo.description}</p>
          <p className="text-[11px] text-brown-light/70 mt-1">Confidence: {confidence}</p>
        </div>
      </div>

      {/* Stats Bar */}
      {filledPrices.length > 0 && data.buyPrice && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-[12px] shadow-card p-3 text-center">
            <p className="text-[11px] font-semibold text-brown-light">Highest</p>
            <p className={`text-lg font-extrabold ${maxPrice > data.buyPrice ? 'text-leaf-dark' : 'text-coral-dark'}`}>
              {maxPrice}
            </p>
          </div>
          <div className="bg-white rounded-[12px] shadow-card p-3 text-center">
            <p className="text-[11px] font-semibold text-brown-light">Lowest</p>
            <p className="text-lg font-extrabold text-brown-dark">{minPrice}</p>
          </div>
          <div className="bg-white rounded-[12px] shadow-card p-3 text-center">
            <p className="text-[11px] font-semibold text-brown-light">Best Profit</p>
            <p className={`text-lg font-extrabold ${profit && profit > 0 ? 'text-leaf-dark' : 'text-coral-dark'}`}>
              {profit !== null ? (profit > 0 ? `+${profit}` : profit) : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Price Chart */}
      {filledPrices.length > 0 && (
        <div className="bg-white rounded-[16px] shadow-card p-5">
          <h3 className="text-sm font-bold text-brown-dark mb-4">Price Chart</h3>
          <div className="flex items-end gap-1 h-32">
            {data.prices.map((price, i) => {
              const height = price ? (price / chartMax) * 100 : 0;
              const isAboveBuy = data.buyPrice && price && price > data.buyPrice;
              const dayIndex = Math.floor(i / 2);
              const isAM = i % 2 === 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-brown-light">
                    {price || ''}
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      price
                        ? isAboveBuy
                          ? 'bg-leaf'
                          : 'bg-coral/60'
                        : 'bg-sand/30'
                    }`}
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-[8px] text-brown-light font-semibold">
                    {DAYS[dayIndex]?.slice(0, 1)}{isAM ? 'a' : 'p'}
                  </span>
                </div>
              );
            })}
          </div>
          {data.buyPrice && (
            <div className="relative mt-1">
              <div
                className="absolute w-full border-t-2 border-dashed border-golden/50"
                style={{ bottom: `${(data.buyPrice / chartMax) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Price Input Grid */}
      <div className="bg-white rounded-[16px] shadow-card p-5">
        <h3 className="text-sm font-bold text-brown-dark mb-4">Daily Prices</h3>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-brown-light mb-2">
          <div />
          {DAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        {/* AM row */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          <div className="flex items-center justify-center text-xs font-bold text-brown-light">AM</div>
          {DAYS.map((_, dayIdx) => {
            const idx = dayIdx * 2;
            const price = data.prices[idx];
            const isAbove = data.buyPrice && price && price > data.buyPrice;
            return (
              <input
                key={idx}
                type="number"
                value={price ?? ''}
                onChange={(e) => setPrice(idx, e.target.value)}
                placeholder="—"
                className={`w-full px-1 py-2 rounded-lg text-center text-sm font-bold border transition-all focus:outline-none focus:ring-2 focus:ring-leaf/30
                  ${price
                    ? isAbove
                      ? 'bg-leaf/10 border-leaf/30 text-leaf-dark'
                      : 'bg-coral/5 border-coral/20 text-coral-dark'
                    : 'bg-sand/20 border-sand-dark/15 text-brown-dark'
                  }`}
              />
            );
          })}
        </div>
        {/* PM row */}
        <div className="grid grid-cols-7 gap-2">
          <div className="flex items-center justify-center text-xs font-bold text-brown-light">PM</div>
          {DAYS.map((_, dayIdx) => {
            const idx = dayIdx * 2 + 1;
            const price = data.prices[idx];
            const isAbove = data.buyPrice && price && price > data.buyPrice;
            return (
              <input
                key={idx}
                type="number"
                value={price ?? ''}
                onChange={(e) => setPrice(idx, e.target.value)}
                placeholder="—"
                className={`w-full px-1 py-2 rounded-lg text-center text-sm font-bold border transition-all focus:outline-none focus:ring-2 focus:ring-leaf/30
                  ${price
                    ? isAbove
                      ? 'bg-leaf/10 border-leaf/30 text-leaf-dark'
                      : 'bg-coral/5 border-coral/20 text-coral-dark'
                    : 'bg-sand/20 border-sand-dark/15 text-brown-dark'
                  }`}
              />
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h3 className="text-lg font-extrabold text-brown-dark font-heading mb-3">Stalk Market Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPS.map((tip, i) => (
            <div key={i} className="bg-white rounded-[16px] shadow-card p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-golden/10 flex items-center justify-center text-golden-dark font-extrabold text-sm shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brown-dark">{tip.title}</h4>
                  <p className="text-xs text-brown-light mt-0.5 leading-relaxed">{tip.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
