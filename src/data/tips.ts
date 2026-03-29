export interface Tip {
  id: string;
  title: string;
  category: 'getting-started' | 'money' | 'museum' | 'island' | 'villagers' | 'seasonal';
  content: string;
  priority: number;
}

export const tips: Tip[] = [
  // Getting Started
  {
    id: 'gs-1',
    title: 'Your First Week Matters',
    category: 'getting-started',
    content: 'Focus on gathering resources, crafting tools, and paying off your first tent loan (5,000 Nook Miles). Talk to Tom Nook frequently — he guides your early progress and unlocks new features.',
    priority: 1,
  },
  {
    id: 'gs-2',
    title: 'Donate Everything New to Blathers',
    category: 'getting-started',
    content: 'The first time you catch any bug, fish, or sea creature, donate it to Blathers at the museum. You can always catch another to sell. Completing the museum is one of the most rewarding long-term goals.',
    priority: 2,
  },
  {
    id: 'gs-3',
    title: 'Shake Trees Carefully',
    category: 'getting-started',
    content: 'Two trees on your island drop furniture daily, and five drop wasp nests. Always have your net equipped when shaking trees! If wasps appear, press A immediately to catch them.',
    priority: 3,
  },
  {
    id: 'gs-4',
    title: 'Hit Rocks the Right Way',
    category: 'getting-started',
    content: 'Dig two holes behind you before hitting a rock to prevent recoil. Hit the rock rapidly — you can get up to 8 drops (bells, clay, stone, iron, gold) from a single rock. One rock per day is a "money rock" that drops only bells.',
    priority: 4,
  },
  {
    id: 'gs-5',
    title: 'Check Nook Miles+ Daily',
    category: 'getting-started',
    content: 'Nook Miles+ tasks refresh and reward you for activities you\'re already doing. Early on, prioritize the 5x multiplier tasks for quick Miles to unlock inventory upgrades and recipes.',
    priority: 5,
  },
  // Money Making
  {
    id: 'money-1',
    title: 'Turnip Trading (Stalk Market)',
    category: 'money',
    content: 'Buy turnips from Daisy Mae every Sunday morning. Sell at Nook\'s Cranny Mon-Sat when prices spike above your buy price. Prices change at noon daily. Track patterns: decreasing, small spike, large spike, or random.',
    priority: 1,
  },
  {
    id: 'money-2',
    title: 'High-Value Catches',
    category: 'money',
    content: 'Tarantulas/Scorpions sell for 8,000 bells. Sharks (Great White, Whale Shark) sell for 8,000-15,000. Oarfish sell for 9,000. Golden Trout sells for 15,000. Focus on these when they\'re in season!',
    priority: 2,
  },
  {
    id: 'money-3',
    title: 'Sell to CJ & Flick',
    category: 'money',
    content: 'CJ buys fish at 1.5x price. Flick buys bugs at 1.5x price. When they visit your island, save your high-value catches to sell to them instead of Nook\'s Cranny.',
    priority: 3,
  },
  {
    id: 'money-4',
    title: 'Money Trees',
    category: 'money',
    content: 'Bury 10,000 bells in the glowing spot you dig up each day. This guarantees 30,000 bells back (3x return). Burying more than 10,000 has a 70% chance of only returning 10,000 per bag.',
    priority: 4,
  },
  {
    id: 'money-5',
    title: 'Fruit Profits',
    category: 'money',
    content: 'Non-native fruit sells for 500 bells each (vs 100 for native). Plant orchards of non-native fruit trees for steady income. Coconuts sell for 250 bells.',
    priority: 5,
  },
  // Museum
  {
    id: 'museum-1',
    title: 'Track Seasonal Creatures',
    category: 'museum',
    content: 'Some creatures are only available for a few months. Use this guide\'s "Leaving This Month" filter to prioritize catching creatures before they disappear for months!',
    priority: 1,
  },
  {
    id: 'museum-2',
    title: 'Fossil Hunting Daily',
    category: 'museum',
    content: 'Four fossil dig spots appear on your island daily. Dig them all up and have Blathers assess them. Donate what you\'re missing, sell duplicates for 1,000-6,000 bells each.',
    priority: 2,
  },
  {
    id: 'museum-3',
    title: 'Watch Out for Fake Art',
    category: 'museum',
    content: 'Redd sells art from his trawler, but some pieces are forgeries. Always check for subtle differences before buying. Blathers won\'t accept fakes. This guide marks which art pieces have known fakes.',
    priority: 3,
  },
  {
    id: 'museum-4',
    title: 'Diving for Sea Creatures',
    category: 'museum',
    content: 'Equip a wetsuit and press A to dive in the ocean. Swim toward bubble trails and dive to collect sea creatures. Fast-moving shadows (like the Gigas Giant Clam) require corner-trapping near the net barrier.',
    priority: 4,
  },
  // Island Rating
  {
    id: 'island-1',
    title: 'Reach 3 Stars for K.K. Slider',
    category: 'island',
    content: 'You need: 7+ villagers, 50+ placed furniture items (spread across the island), 50+ planted flowers, and fencing. Talk to Isabelle for specific feedback on what to improve.',
    priority: 1,
  },
  {
    id: 'island-2',
    title: '5-Star Island Tips',
    category: 'island',
    content: 'For 5 stars: 10 villagers, 665+ "development points" from furniture/buildings, and keep weeds below 100. Items placed on the ground (dropped, not placed) count against you. Pick up loose items!',
    priority: 2,
  },
  {
    id: 'island-3',
    title: 'Flower Breeding',
    category: 'island',
    content: 'Plant flowers in checkerboard patterns to breed hybrids. Water daily (rain counts). Blue roses are the hardest — they require specific red-rose genetics. Start with simple hybrids like orange and pink.',
    priority: 3,
  },
  // Villagers
  {
    id: 'villager-1',
    title: 'Building Friendship',
    category: 'villagers',
    content: 'Talk to villagers daily, give them wrapped gifts (furniture worth 2,500+ bells is ideal), complete their requests, and send them letters. Friendship unlocks their photo — the ultimate reward.',
    priority: 1,
  },
  {
    id: 'villager-2',
    title: 'Moving Villagers Out',
    category: 'villagers',
    content: 'Villagers randomly ask to move. If you want to keep them, say no. To encourage moving: ignore them (don\'t talk or give gifts). When a villager has a thought bubble, that\'s your chance.',
    priority: 2,
  },
  {
    id: 'villager-3',
    title: 'Campsite Visitors',
    category: 'villagers',
    content: 'Campsite visitors can be invited to move in. If your island is full, they\'ll suggest replacing a random villager — keep asking until they name one you want to swap out.',
    priority: 3,
  },
  // Seasonal
  {
    id: 'seasonal-1',
    title: 'Seasonal DIY Recipes',
    category: 'seasonal',
    content: 'Shoot down balloon presents during different seasons for exclusive DIY recipes. Cherry blossom (spring), summer shells, mushrooms (fall), and snowflakes (winter) are time-limited materials.',
    priority: 1,
  },
  {
    id: 'seasonal-2',
    title: 'Holiday Events',
    category: 'seasonal',
    content: 'Special events include: Bunny Day (Easter), Festivale (Feb), Bug-Off (summer), Fishing Tourney (quarterly), Halloween, Turkey Day, and Toy Day. Each has unique items and activities.',
    priority: 2,
  },
];

export const tipCategories = [
  { id: 'getting-started' as const, label: 'Getting Started', emoji: '🏝️' },
  { id: 'money' as const, label: 'Making Bells', emoji: '💰' },
  { id: 'museum' as const, label: 'Museum Guide', emoji: '🏛️' },
  { id: 'island' as const, label: 'Island Rating', emoji: '⭐' },
  { id: 'villagers' as const, label: 'Villagers', emoji: '🏘️' },
  { id: 'seasonal' as const, label: 'Seasonal', emoji: '🌸' },
];
