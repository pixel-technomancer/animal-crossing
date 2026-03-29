import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tips, tipCategories } from '../data/tips';

export function TipsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('getting-started');

  const filtered = tips
    .filter((t) => t.category === activeCategory)
    .sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold text-brown-dark font-heading">Tips & Advice</h2>
        <p className="text-sm text-brown-light mt-0.5">
          Helpful tips for your island life
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {tipCategories.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5
              ${activeCategory === id
                ? 'bg-leaf text-white shadow-sm'
                : 'bg-white/70 text-brown-light hover:bg-white hover:text-brown-dark border border-sand-dark/20'
              }
            `}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((tip, i) => (
            <motion.div
              key={tip.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[16px] shadow-card p-5 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-leaf/10 flex items-center justify-center text-leaf-dark font-extrabold text-sm shrink-0 mt-0.5">
                  {tip.priority}
                </div>
                <div>
                  <h3 className="text-base font-bold text-brown-dark font-heading">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-brown leading-relaxed mt-1.5">
                    {tip.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
