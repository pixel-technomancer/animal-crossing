import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  placeholder?: string;
}

export function SearchBar({ query, onQueryChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light" />
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-sand-dark/30 text-brown-dark placeholder:text-brown-light/50 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all"
      />
      {query && (
        <button
          onClick={() => onQueryChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-sand flex items-center justify-center hover:bg-sand-dark transition-colors cursor-pointer"
        >
          <X className="w-3 h-3 text-brown" />
        </button>
      )}
    </div>
  );
}
