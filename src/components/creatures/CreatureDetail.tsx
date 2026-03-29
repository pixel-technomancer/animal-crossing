import { X, MapPin, Clock, Calendar, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Creature, Hemisphere } from '../../types/common';
import { MONTHS } from '../../types/common';
import { getAvailabilityMonths, getAvailabilityHours, formatTimeRange, formatMonthRange } from '../../utils/availability';

interface CreatureDetailProps {
  creature: Creature | null;
  hemisphere: Hemisphere;
  onClose: () => void;
}

export function CreatureDetail({ creature, hemisphere, onClose }: CreatureDetailProps) {
  return (
    <AnimatePresence>
      {creature && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-dark/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-cream rounded-[24px] shadow-modal w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-sky-light/50 to-leaf-light/30 p-6 rounded-t-[24px]">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-brown" />
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={creature.image_uri || creature.icon_uri}
                  alt={creature.name['name-USen']}
                  className="w-24 h-24 object-contain drop-shadow-lg"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src !== creature.icon_uri) {
                      img.src = creature.icon_uri;
                    }
                  }}
                />
                <div>
                  <h2 className="text-2xl font-extrabold text-brown-dark font-heading">
                    {creature.name['name-USen']}
                  </h2>
                  <p className="text-sm text-brown-light font-medium mt-1 italic">
                    "{creature['catch-phrase']}"
                  </p>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <InfoTile icon={<DollarSign className="w-4 h-4" />} label="Sell Price" value={`${creature.price.toLocaleString()} Bells`} />
                <InfoTile icon={<MapPin className="w-4 h-4" />} label="Location" value={creature.availability.location || 'Unknown'} />
                <InfoTile icon={<Clock className="w-4 h-4" />} label="Time" value={formatTimeRange(creature)} />
                <InfoTile icon={<Calendar className="w-4 h-4" />} label="Season" value={formatMonthRange(creature, hemisphere)} />
                {creature.shadow && <InfoTile icon={<span className="text-sm">🌑</span>} label="Shadow" value={creature.shadow} />}
                {creature.speed && creature.speed !== '' && <InfoTile icon={<span className="text-sm">💨</span>} label="Speed" value={creature.speed} />}
                {creature['price-cj'] && <InfoTile icon={<span className="text-sm">🐟</span>} label="CJ Price" value={`${creature['price-cj'].toLocaleString()} Bells`} />}
                {creature['price-flick'] && <InfoTile icon={<span className="text-sm">🦋</span>} label="Flick Price" value={`${creature['price-flick'].toLocaleString()} Bells`} />}
              </div>

              {/* Month Calendar */}
              <div>
                <h3 className="text-sm font-bold text-brown-dark mb-2">Monthly Availability</h3>
                <MonthCalendar creature={creature} hemisphere={hemisphere} />
              </div>

              {/* Hour Bar */}
              <div>
                <h3 className="text-sm font-bold text-brown-dark mb-2">Active Hours</h3>
                <HourBar creature={creature} />
              </div>

              {/* Museum Description */}
              <div className="bg-white/60 rounded-xl p-4 border border-sand-dark/20">
                <h3 className="text-sm font-bold text-teal mb-2">🏛️ Museum Plaque</h3>
                <p className="text-xs text-brown leading-relaxed">
                  {creature['museum-phrase']}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/60 rounded-xl p-3 border border-sand-dark/15">
      <div className="flex items-center gap-1.5 text-brown-light mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-bold text-brown-dark">{value}</p>
    </div>
  );
}

function MonthCalendar({ creature, hemisphere }: { creature: Creature; hemisphere: Hemisphere }) {
  const availableMonths = getAvailabilityMonths(creature, hemisphere);
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="grid grid-cols-6 gap-1.5">
      {MONTHS.map((month, i) => {
        const monthNum = i + 1;
        const isAvailable = availableMonths.includes(monthNum);
        const isCurrent = monthNum === currentMonth;
        return (
          <div
            key={month}
            className={`
              text-center py-1.5 rounded-lg text-xs font-bold transition-all
              ${isAvailable
                ? isCurrent
                  ? 'bg-leaf text-white ring-2 ring-leaf-dark ring-offset-1'
                  : 'bg-leaf/15 text-leaf-dark'
                : isCurrent
                  ? 'bg-sand text-brown ring-2 ring-brown-light ring-offset-1'
                  : 'bg-sand/40 text-brown-light/50'
              }
            `}
          >
            {month}
          </div>
        );
      })}
    </div>
  );
}

function HourBar({ creature }: { creature: Creature }) {
  const activeHours = getAvailabilityHours(creature);
  const currentHour = new Date().getHours();

  return (
    <div className="space-y-1">
      <div className="flex gap-[2px]">
        {Array.from({ length: 24 }, (_, i) => {
          const isActive = activeHours.includes(i);
          const isCurrent = i === currentHour;
          return (
            <div
              key={i}
              className={`
                flex-1 h-6 rounded-sm transition-all relative
                ${isActive
                  ? isCurrent
                    ? 'bg-golden ring-1 ring-golden-dark'
                    : 'bg-sky/40'
                  : 'bg-sand/50'
                }
              `}
              title={`${i}:00 - ${i + 1}:00${isActive ? ' (active)' : ''}`}
            >
              {isCurrent && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-golden-dark" />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] text-brown-light font-semibold">
        <span>12AM</span>
        <span>6AM</span>
        <span>12PM</span>
        <span>6PM</span>
        <span>12AM</span>
      </div>
    </div>
  );
}
