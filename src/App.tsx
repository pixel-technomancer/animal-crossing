import { useState, useMemo, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import type { Page } from './components/layout/Navigation';
import { useCollection } from './hooks/useCollection';
import { useCreatureData } from './hooks/useCreatureData';
import { DashboardPage } from './pages/DashboardPage';
import { CreaturePage } from './pages/CreaturePage';
import { FossilsPage } from './pages/FossilsPage';
import { ArtPage } from './pages/ArtPage';
import { RecipesPage } from './pages/RecipesPage';
import { TurnipsPage } from './pages/TurnipsPage';
import { TipsPage } from './pages/TipsPage';
import { loadLearnedRecipes, saveLearnedRecipes, toggleLearnedRecipe } from './utils/storage';
import type { Category } from './types/common';

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const { fish, bugs, sea, fossils, art, recipes, loading } = useCreatureData();
  const collection = useCollection();
  const [learnedRecipes, setLearnedRecipes] = useState(loadLearnedRecipes);

  const handleToggleLearnedRecipe = useCallback((id: string) => {
    setLearnedRecipes((prev) => {
      const next = toggleLearnedRecipe(prev, id);
      saveLearnedRecipes(next);
      return next;
    });
  }, []);

  const totals: Record<Category, number> = useMemo(
    () => ({
      fish: fish.length,
      bugs: bugs.length,
      sea: sea.length,
      fossils: fossils.length,
      art: art.length,
    }),
    [fish, bugs, sea, fossils, art]
  );

  const navCounts = useMemo(
    () => ({
      fish: { caught: collection.state.caught.fish.length, total: totals.fish },
      bugs: { caught: collection.state.caught.bugs.length, total: totals.bugs },
      sea: { caught: collection.state.caught.sea.length, total: totals.sea },
      fossils: { caught: collection.state.caught.fossils.length, total: totals.fossils },
      art: { caught: collection.state.caught.art.length, total: totals.art },
    }),
    [collection.state.caught, totals]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <p className="text-brown font-bold font-heading text-lg">Loading your island guide...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            fish={fish}
            bugs={bugs}
            sea={sea}
            hemisphere={collection.hemisphere}
            caught={collection.state.caught}
            donated={collection.state.donated}
            totals={totals}
            onNavigate={setActivePage}
          />
        );
      case 'fish':
        return (
          <CreaturePage
            creatures={fish}

            hemisphere={collection.hemisphere}
            caught={collection.state.caught.fish}
            donated={collection.state.donated.fish}
            onToggleCaught={(id) => collection.toggleCaught('fish', id)}
            onToggleDonated={(id) => collection.toggleDonated('fish', id)}
            title="Fish"
            color="sky"
            fallbackEmoji="🐟"
          />
        );
      case 'bugs':
        return (
          <CreaturePage
            creatures={bugs}

            hemisphere={collection.hemisphere}
            caught={collection.state.caught.bugs}
            donated={collection.state.donated.bugs}
            onToggleCaught={(id) => collection.toggleCaught('bugs', id)}
            onToggleDonated={(id) => collection.toggleDonated('bugs', id)}
            title="Bugs"
            color="leaf"
            fallbackEmoji="🦋"
          />
        );
      case 'sea':
        return (
          <CreaturePage
            creatures={sea}

            hemisphere={collection.hemisphere}
            caught={collection.state.caught.sea}
            donated={collection.state.donated.sea}
            onToggleCaught={(id) => collection.toggleCaught('sea', id)}
            onToggleDonated={(id) => collection.toggleDonated('sea', id)}
            title="Sea Creatures"
            fallbackEmoji="🦑"
            color="teal"
          />
        );
      case 'fossils':
        return (
          <FossilsPage
            fossils={fossils}
            caught={collection.state.caught.fossils}
            donated={collection.state.donated.fossils}
            onToggleCaught={(id) => collection.toggleCaught('fossils', id)}
            onToggleDonated={(id) => collection.toggleDonated('fossils', id)}
          />
        );
      case 'art':
        return (
          <ArtPage
            art={art}
            caught={collection.state.caught.art}
            donated={collection.state.donated.art}
            onToggleCaught={(id) => collection.toggleCaught('art', id)}
            onToggleDonated={(id) => collection.toggleDonated('art', id)}
          />
        );
      case 'recipes':
        return (
          <RecipesPage
            recipes={recipes}
            learned={learnedRecipes}
            onToggleLearned={handleToggleLearnedRecipe}
          />
        );
      case 'turnips':
        return <TurnipsPage />;
      case 'tips':
        return <TipsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header
        hemisphere={collection.hemisphere}
        onHemisphereChange={collection.setHemisphere}
      />
      <Navigation
        activePage={activePage}
        onPageChange={setActivePage}
        counts={navCounts}
      />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
