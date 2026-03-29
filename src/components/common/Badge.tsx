interface BadgeProps {
  variant: 'available' | 'leaving' | 'new' | 'caught' | 'donated' | 'fake';
  children: React.ReactNode;
}

const styles: Record<BadgeProps['variant'], string> = {
  available: 'bg-leaf/15 text-leaf-dark border-leaf/30 animate-pulse-soft',
  leaving: 'bg-coral/15 text-coral-dark border-coral/30',
  new: 'bg-sky/15 text-sky-dark border-sky/30',
  caught: 'bg-golden/15 text-golden-dark border-golden/30',
  donated: 'bg-teal/15 text-teal border-teal/30',
  fake: 'bg-coral/20 text-coral-dark border-coral-dark/30',
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[variant]}`}>
      {children}
    </span>
  );
}
