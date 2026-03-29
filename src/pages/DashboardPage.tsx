import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Creature, Hemisphere, Category } from '../types/common';
import { CATEGORY_INFO } from '../types/common';
import { isAvailableNow, isLeavingThisMonth, isNewThisMonth } from '../utils/availability';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import type { Page } from '../components/layout/Navigation';

interface DashboardPageProps {
  fish: Creature[];
  bugs: Creature[];
  sea: Creature[];
  hemisphere: Hemisphere;
  caught: Record<Category, string[]>;
  donated: Record<Category, string[]>;
  totals: Record<Category, number>;
  onNavigate: (page: Page) => void;
}

export function DashboardPage({
  fish,
  bugs,
  sea,
  hemisphere,
  caught,
  donated,
  totals,
  onNavigate,
}: DashboardPageProps) {
  const allCreatures = useMemo(
    () => [
      ...fish.map((c) => ({ ...c, _category: 'fish' as Category })),
      ...bugs.map((c) => ({ ...c, _category: 'bugs' as Category })),
      ...sea.map((c) => ({ ...c, _category: 'sea' as Category })),
    ],
    [fish, bugs, sea]
  );

  const availableNow = useMemo(
    () => allCreatures.filter((c) => isAvailableNow(c, hemisphere) && !caught[c._category].includes(c['file-name'])),
    [allCreatures, hemisphere, caught]
  );

  const leavingSoon = useMemo(
    () => allCreatures.filter((c) => isLeavingThisMonth(c, hemisphere) && !caught[c._category].includes(c['file-name'])),
    [allCreatures, hemisphere, caught]
  );

  const newThisMonth = useMemo(
    () => allCreatures.filter((c) => isNewThisMonth(c, hemisphere) && !caught[c._category].includes(c['file-name'])),
    [allCreatures, hemisphere, caught]
  );

  const month = new Date().toLocaleString('en-US', { month: 'long' });

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-leaf-light/30 via-sky-light/20 to-golden/10 rounded-[20px] p-6 border border-leaf/10"
      >
        <h2 className="text-2xl font-extrabold text-brown-dark font-heading">
          Welcome to Pirate Bay Island! 🏴‍☠️
        </h2>
        <p className="text-brown mt-2 font-medium">
          It's <span className="font-bold text-leaf-dark">{month}</span>. Here's what you can find right now.
        </p>
      </motion.div>

      {/* Leaving Soon Alert */}
      {leavingSoon.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-coral/8 border border-coral/20 rounded-[16px] p-4"
        >
          <h3 className="text-base font-bold text-coral-dark font-heading flex items-center gap-2">
            Leaving After {month}!
          </h3>
          <p className="text-xs text-brown-light mt-1 mb-3">
            {leavingSoon.length} unobtained creature{leavingSoon.length !== 1 ? 's' : ''} won't be available next month
          </p>
          <div className="flex flex-wrap gap-2">
            {leavingSoon.slice(0, 10).map((c) => (
              <button
                key={`${c._category}-${c.id}`}
                onClick={() => onNavigate(c._category === 'sea' ? 'sea' : c._category as Page)}
                className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 hover:bg-white transition-colors cursor-pointer"
              >
                <img src={c.icon_uri} alt="" className="w-6 h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-xs font-bold text-brown-dark">{c.name['name-USen']}</span>
                <Badge variant="leaving">Leaving</Badge>
              </button>
            ))}
            {leavingSoon.length > 10 && (
              <span className="text-xs font-bold text-coral-dark self-center">
                +{leavingSoon.length - 10} more
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* New This Month */}
      {newThisMonth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-sky/8 border border-sky/20 rounded-[16px] p-4"
        >
          <h3 className="text-base font-bold text-sky-dark font-heading flex items-center gap-2">
            New in {month}!
          </h3>
          <p className="text-xs text-brown-light mt-1 mb-3">
            {newThisMonth.length} new creature{newThisMonth.length !== 1 ? 's' : ''} appeared this month
          </p>
          <div className="flex flex-wrap gap-2">
            {newThisMonth.slice(0, 10).map((c) => (
              <button
                key={`${c._category}-${c.id}`}
                onClick={() => onNavigate(c._category === 'sea' ? 'sea' : c._category as Page)}
                className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 hover:bg-white transition-colors cursor-pointer"
              >
                <img src={c.icon_uri} alt="" className="w-6 h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-xs font-bold text-brown-dark">{c.name['name-USen']}</span>
                <Badge variant="new">New</Badge>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Now */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[16px] shadow-card p-4"
      >
        <h3 className="text-base font-bold text-leaf-dark font-heading flex items-center gap-2">
          Available Right Now
          <span className="text-xs font-bold text-brown-light bg-sand px-2 py-0.5 rounded-full">
            {availableNow.length} unobtained
          </span>
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
          {availableNow.slice(0, 18).map((c) => (
            <button
              key={`${c._category}-${c.id}`}
              onClick={() => onNavigate(c._category === 'sea' ? 'sea' : c._category as Page)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-cream/50 hover:bg-leaf/5 transition-colors cursor-pointer"
            >
              <img src={c.icon_uri} alt="" className="w-8 h-8" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="text-[10px] font-bold text-brown-dark text-center leading-tight truncate w-full">
                {c.name['name-USen']}
              </span>
              <span className="text-[9px] text-golden-dark font-semibold">
                {c.price.toLocaleString()} Bells
              </span>
            </button>
          ))}
        </div>
        {availableNow.length > 18 && (
          <p className="text-xs text-brown-light font-semibold mt-2 text-center">
            +{availableNow.length - 18} more available
          </p>
        )}
      </motion.div>

      {/* Collection Progress */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-[16px] shadow-card p-5"
      >
        <h3 className="text-base font-bold text-brown-dark font-heading mb-4">
          Collection Progress
        </h3>
        <div className="space-y-4">
          {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
            <ProgressBar
              key={cat}
              label={CATEGORY_INFO[cat].label}
              caught={donated[cat].length}
              total={totals[cat]}
              color={CATEGORY_INFO[cat].color}
            />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-sand/50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-brown-dark">Total Donated</span>
            <span className="text-sm font-extrabold text-teal">
              {Object.values(donated).reduce((sum, arr) => sum + arr.length, 0)} / {Object.values(totals).reduce((sum, n) => sum + n, 0)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
