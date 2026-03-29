interface ProgressBarProps {
  caught: number;
  total: number;
  label: string;
  color?: string;
}

export function ProgressBar({ caught, total, label, color = 'leaf' }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((caught / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-bold text-brown-dark">{label}</span>
        <span className="text-xs font-semibold text-brown-light">
          {caught}/{total} ({pct}%)
        </span>
      </div>
      <div className="h-3 bg-sand rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            pct === 100
              ? 'bg-gradient-to-r from-golden to-golden-dark'
              : `bg-gradient-to-r from-${color} to-${color}-dark`
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
