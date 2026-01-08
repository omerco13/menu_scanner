/**
 * Maps category keywords to decorative images.
 * Uses Unsplash free images for beautiful food photography.
 */

interface CategoryImageConfig {
  keywords: string[];
  imageUrl: string;
  emoji: string;
}

const categoryImageMap: CategoryImageConfig[] = [
  {
    keywords: ['breakfast', 'brunch', 'morning'],
    imageUrl: '/category-images/breakfast.png',
    emoji: '🍳'
  },
  {
    keywords: ['lunch', 'sandwich', 'sandwiches', 'burgers'],
    imageUrl: '/category-images/burger.png',
    emoji: '🍔'
  },
  {
    keywords: ['dinner', 'mains', 'entrees', 'main course'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    emoji: '🍽️'
  },
  {
    keywords: ['pizza', 'pizzas'],
    imageUrl: '/category-images/pizza.png',
    emoji: '🍕'
  },
  {
    keywords: ['pasta', 'spaghetti', 'noodles'],
    imageUrl: '/category-images/pasta.png',
    emoji: '🍝'
  },
  {
    keywords: ['salad', 'salads', 'greens'],
    imageUrl: '/category-images/salad.png',
    emoji: '🥗'
  },
  {
    keywords: ['dessert', 'desserts', 'sweets', 'cake', 'cakes', 'pastry', 'pastries'],
    imageUrl: '/category-images/dessert.png',
    emoji: '🍰'
  },
  {
    keywords: ['coffee', 'espresso', 'latte', 'cappuccino', 'hot drinks'],
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    emoji: '☕'
  },
  {
    keywords: ['drinks', 'beverages', 'cold drinks', 'soda', 'juice'],
    imageUrl: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&h=300&fit=crop',
    emoji: '🥤'
  },
  {
    keywords: ['cocktail', 'cocktails', 'bar', 'alcohol', 'wine', 'beer'],
    imageUrl: '/category-images/cocktail.png',
    emoji: '🍹'
  },
  {
    keywords: ['appetizer', 'appetizers', 'starters', 'snacks'],
    imageUrl: 'https://images.unsplash.com/photo-1599974244258-a8e2c5b90df0?w=400&h=300&fit=crop',
    emoji: '🍤'
  },
  {
    keywords: ['soup', 'soups'],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    emoji: '🍲'
  },
  {
    keywords: ['sushi', 'japanese', 'asian'],
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    emoji: '🍣'
  },
  {
    keywords: ['ice cream', 'gelato', 'frozen'],
    imageUrl: '/category-images/ice-cream.png',
    emoji: '🍦'
  },
  {
    keywords: ['vegetarian', 'vegan', 'plant-based'],
    imageUrl: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=400&h=300&fit=crop',
    emoji: '🥬'
  },
  {
    keywords: ['seafood', 'fish', 'shellfish'],
    imageUrl: '/category-images/fish.png',
    emoji: '🐟'
  },
  {
    keywords: ['steak', 'meat', 'bbq', 'grill'],
    imageUrl: '/category-images/steak.png',
    emoji: '🥩'
  },
];

/**
 * Get category image based on category name
 */
export function getCategoryImage(categoryName: string): { imageUrl: string; emoji: string } | null {
  if (!categoryName) return null;

  const normalizedName = categoryName.toLowerCase();

  // Find matching category
  const match = categoryImageMap.find(config =>
    config.keywords.some(keyword => normalizedName.includes(keyword))
  );

  return match ? { imageUrl: match.imageUrl, emoji: match.emoji } : null;
}

/**
 * Get just the emoji for inline use
 */
export function getCategoryEmoji(categoryName: string): string {
  const image = getCategoryImage(categoryName);
  return image?.emoji || '📋';
}
