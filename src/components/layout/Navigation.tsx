import { Bug, Fish, Shell, Bone, Palette, LayoutDashboard, Lightbulb, Hammer, TrendingUp } from 'lucide-react';

export type Page = 'dashboard' | 'fish' | 'bugs' | 'sea' | 'fossils' | 'art' | 'recipes' | 'turnips' | 'tips';

interface NavigationProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  counts?: Record<string, { caught: number; total: number }>;
}

const navItems: { id: Page; label: string; icon: typeof Fish; color: string }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard, color: 'text-golden-dark' },
  { id: 'fish', label: 'Fish', icon: Fish, color: 'text-sky-dark' },
  { id: 'bugs', label: 'Bugs', icon: Bug, color: 'text-leaf-dark' },
  { id: 'sea', label: 'Sea', icon: Shell, color: 'text-teal' },
  { id: 'fossils', label: 'Fossils', icon: Bone, color: 'text-brown' },
  { id: 'art', label: 'Art', icon: Palette, color: 'text-coral-dark' },
  { id: 'recipes', label: 'DIY', icon: Hammer, color: 'text-brown' },
  { id: 'turnips', label: 'Turnips', icon: TrendingUp, color: 'text-leaf-dark' },
  { id: 'tips', label: 'Tips', icon: Lightbulb, color: 'text-golden-dark' },
];

export function Navigation({ activePage, onPageChange, counts }: NavigationProps) {
  return (
    <nav className="sticky top-[61px] z-40 bg-cream-dark/90 backdrop-blur-md border-b border-sand-dark/20">
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex overflow-x-auto no-scrollbar">
          {navItems.map(({ id, label, icon: Icon, color }) => {
            const isActive = activePage === id;
            const count = counts?.[id];
            return (
              <button
                key={id}
                onClick={() => onPageChange(id)}
                className={`
                  flex flex-col items-center gap-0.5 px-4 py-2.5 font-semibold text-xs transition-all whitespace-nowrap cursor-pointer
                  ${isActive
                    ? `${color} border-b-2 border-current bg-white/50`
                    : 'text-brown-light hover:text-brown-dark hover:bg-white/30 border-b-2 border-transparent'
                  }
                `}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
                {count && (
                  <span className="text-[10px] font-bold opacity-70">
                    {count.caught}/{count.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
