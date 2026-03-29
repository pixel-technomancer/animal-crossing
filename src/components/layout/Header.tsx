import { useState, useEffect } from 'react';
import { Leaf, ArrowRightLeft } from 'lucide-react';
import type { Hemisphere } from '../../types/common';
import { SyncModal } from '../common/SyncModal';

interface HeaderProps {
  hemisphere: Hemisphere;
  onHemisphereChange: (h: Hemisphere) => void;
  onDataImported: () => void;
}

export function Header({ onDataImported }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [showSync, setShowSync] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const month = time.toLocaleString('en-US', { month: 'long' });
  const day = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-sand-dark/30">
      <div className="max-w-6xl mx-auto px-4 py-3 pl-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-leaf flex items-center justify-center shadow-card">
            <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-brown-dark font-heading leading-tight tracking-tight">
              Pixel's Guide
            </h1>
            <p className="text-xs text-brown-light font-medium">
              Animal Crossing Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-brown-dark">
              {month} {day}
            </span>
            <span className="text-xs text-brown-light font-semibold">
              {displayHour}:{minutes} {ampm}
            </span>
          </div>

          <button
            onClick={() => setShowSync(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-golden/20 hover:bg-golden/30 text-golden-dark font-semibold text-sm transition-colors cursor-pointer"
            title="Sync data between devices"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Hemisphere toggle — hidden for now, hardcoded to northern
          <button
            onClick={() =>
              onHemisphereChange(hemisphere === 'northern' ? 'southern' : 'northern')
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky/20 hover:bg-sky/30 text-sky-dark font-semibold text-sm transition-colors cursor-pointer"
            title={`Switch to ${hemisphere === 'northern' ? 'Southern' : 'Northern'} Hemisphere`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">
              {hemisphere === 'northern' ? 'Northern' : 'Southern'}
            </span>
          </button>
          */}
        </div>
      </div>
      {showSync && (
        <SyncModal
          onClose={() => setShowSync(false)}
          onImported={onDataImported}
        />
      )}
    </header>
  );
}
