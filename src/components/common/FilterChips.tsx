import type { FilterMode } from '../../hooks/useSearch';

interface FilterChipsProps {
  active: FilterMode;
  onChange: (f: FilterMode) => void;
  showAvailability?: boolean;
}

const baseFilters: { id: FilterMode; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'not-caught', label: 'Not Obtained' },
  { id: 'caught', label: 'Obtained' },
  { id: 'donated', label: 'Donated' },
  { id: 'not-donated', label: 'Not Donated' },
];

const availabilityFilters: { id: FilterMode; label: string }[] = [
  { id: 'available', label: 'Available Now' },
  { id: 'leaving', label: 'Leaving Soon' },
  { id: 'new', label: 'New This Month' },
];

export function FilterChips({ active, onChange, showAvailability = false }: FilterChipsProps) {
  const allFilter = baseFilters[0];
  const restFilters = baseFilters.slice(1);
  const filters = showAvailability ? [allFilter, ...availabilityFilters, ...restFilters] : baseFilters;

  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
      {filters.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`
            whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer
            ${active === id
              ? 'bg-leaf text-white shadow-sm'
              : 'bg-white/70 text-brown-light hover:bg-white hover:text-brown-dark border border-sand-dark/20'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
