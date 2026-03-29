import { Check, Star } from 'lucide-react';
import type { Creature, Hemisphere } from '../../types/common';
import { isAvailableNow, isLeavingThisMonth, isNewThisMonth } from '../../utils/availability';
import { Badge } from '../common/Badge';

interface CreatureCardProps {
  creature: Creature;
  hemisphere: Hemisphere;
  isCaught: boolean;
  isDonated: boolean;
  onToggleCaught: () => void;
  onToggleDonated: () => void;
  onClick: () => void;
  fallbackEmoji?: string;
}

export function CreatureCard({
  creature,
  hemisphere,
  isCaught,
  isDonated,
  onToggleCaught,
  onToggleDonated,
  onClick,
  fallbackEmoji = '🐟',
}: CreatureCardProps) {
  const available = isAvailableNow(creature, hemisphere);
  const leaving = isLeavingThisMonth(creature, hemisphere);
  const isNew = isNewThisMonth(creature, hemisphere);
  const name = creature.name['name-USen'];

  return (
    <div
      className={`
        relative bg-white rounded-[16px] shadow-card hover:shadow-card-hover
        transition-all duration-200 overflow-hidden cursor-pointer group
        ${isDonated ? 'ring-2 ring-teal/30' : ''}
        ${!available ? 'opacity-75' : ''}
      `}
    >
      {/* Card body - clickable for detail */}
      <div onClick={onClick} className="p-3 pb-2">
        {/* Badges */}
        <div className="flex gap-1 mb-2 min-h-[20px] flex-wrap">
          {available && <Badge variant="available">Available</Badge>}
          {leaving && <Badge variant="leaving">Leaving!</Badge>}
          {isNew && <Badge variant="new">New</Badge>}
          {isDonated && <Badge variant="donated">Donated</Badge>}
        </div>

        {/* Icon */}
        <div className="flex justify-center py-2">
          <img
            src={creature.icon_uri}
            alt={name}
            className="w-14 h-14 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden text-3xl">
            {fallbackEmoji}
          </span>
        </div>

        {/* Name & Price */}
        <h3 className="text-sm font-bold text-brown-dark text-center mt-1 leading-tight">
          {name}
        </h3>
        <p className="text-xs text-golden-dark font-semibold text-center mt-0.5">
          {creature.price.toLocaleString()} 🔔
        </p>
        <p className="text-[10px] text-brown-light text-center mt-0.5 truncate">
          {creature.availability.location}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex border-t border-sand/50">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCaught(); }}
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold transition-all cursor-pointer
            ${isCaught
              ? 'bg-golden/10 text-golden-dark'
              : 'text-brown-light hover:bg-sand/30'
            }`}
          title={isCaught ? 'Mark as not obtained' : 'Mark as obtained'}
        >
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
            ${isCaught ? 'border-golden-dark bg-golden' : 'border-brown-light/30'}`}>
            {isCaught && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          Obtained
        </button>
        <div className="w-px bg-sand/50" />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleDonated(); }}
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold transition-all cursor-pointer
            ${isDonated
              ? 'bg-teal/10 text-teal'
              : 'text-brown-light hover:bg-sand/30'
            }`}
          title={isDonated ? 'Mark as not donated' : 'Mark as donated'}
        >
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
            ${isDonated ? 'border-teal bg-teal' : 'border-brown-light/30'}`}>
            {isDonated && <Star className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          Museum
        </button>
      </div>
    </div>
  );
}
