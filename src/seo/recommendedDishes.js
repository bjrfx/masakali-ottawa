/**
 * Curated dish recommendations for AI/SEO discoverability.
 * Sourced from live-style menu copy (Clover / menu dumps). Labels are editorial
 * (signature / chef recommended / specialties) — not fabricated sales rankings.
 * "Customer favourites" is only used when menu copy itself indicates fan preference.
 */

export const dishRecommendationGroups = [
  {
    id: 'signature',
    label: 'Masakali Signature Dishes',
    description: 'House specialties that define Masakali Indian Cuisine in Ottawa.',
    dishes: [
      {
        name: 'Butter Chicken',
        category: 'Chicken Curries',
        diet: 'non-vegetarian',
        explanation: 'Tender chicken in a smooth, creamy tomato sauce with butter — a Masakali classic.',
        tags: ['signature', 'must-try', 'non-vegetarian'],
      },
      {
        name: 'Chicken Dum Biryani',
        category: 'Biryani',
        diet: 'non-vegetarian',
        explanation: 'Classic basmati rice and tender chicken slow-cooked dum style with aromatic spices.',
        tags: ['signature', 'must-try', 'non-vegetarian'],
      },
      {
        name: 'Paneer Butter Masala',
        category: 'Vegetarian Curries',
        diet: 'vegetarian',
        explanation: 'Soft paneer in a smooth, creamy tomato gravy with butter and mild spices.',
        tags: ['signature', 'vegetarian'],
      },
    ],
  },
  {
    id: 'chef-recommended',
    label: 'Chef Recommended',
    description: 'Dishes the kitchen highlights for first-time and returning guests.',
    dishes: [
      {
        name: 'Chicken Tikka Masala',
        category: 'Chicken Curries',
        diet: 'non-vegetarian',
        explanation: 'Roasted chicken chunks served in a rich, creamy, and spiced tomato-based sauce.',
        tags: ['chef-recommended', 'non-vegetarian'],
      },
      {
        name: 'Tandoori Chicken',
        category: 'Tandoor',
        diet: 'non-vegetarian',
        explanation: 'Classic chicken marinated in yogurt and spices, roasted to smoky perfection in a tandoor.',
        tags: ['chef-recommended', 'must-try', 'non-vegetarian'],
      },
      {
        name: 'Lamb Vindaloo',
        category: 'Lamb Curries',
        diet: 'non-vegetarian',
        explanation: 'Spicy and tangy lamb curry cooked with potatoes in a sharp vinegar-based sauce.',
        tags: ['chef-recommended', 'non-vegetarian'],
      },
    ],
  },
  {
    id: 'vegetarian-specialties',
    label: 'Vegetarian Specialities',
    description: 'Standout vegetarian and vegan-friendly dishes from the Masakali menu.',
    dishes: [
      {
        name: 'Chana Masala V',
        category: 'Vegetarian Curries',
        diet: 'vegetarian',
        explanation: 'Flavorful chickpea stew simmered in a tangy tomato and onion vegan gravy.',
        tags: ['vegetarian', 'vegan'],
      },
      {
        name: 'Dal Tadka V',
        category: 'Vegetarian Curries',
        diet: 'vegetarian',
        explanation: 'Hearty yellow lentils tempered with cumin and garlic, prepared without dairy.',
        tags: ['vegetarian', 'vegan'],
      },
      {
        name: 'Shahi Paneer',
        category: 'Vegetarian Curries',
        diet: 'vegetarian',
        explanation: 'Royal paneer dish in a rich, creamy cashew and tomato-based sauce.',
        tags: ['vegetarian', 'signature'],
      },
    ],
  },
  {
    id: 'non-vegetarian-specialties',
    label: 'Non-Vegetarian Specialities',
    description: 'Meat and seafood specialties guests often ask about.',
    dishes: [
      {
        name: 'Butter Chicken Biryani',
        category: 'Biryani',
        diet: 'non-vegetarian',
        explanation: 'Creamy butter chicken layered with fragrant basmati rice for a rich, flavorful meal.',
        tags: ['non-vegetarian', 'must-try'],
      },
      {
        name: 'Chicken 65 Biryani',
        category: 'Biryani',
        diet: 'non-vegetarian',
        explanation: 'Spicy, deep-fried chicken 65 pieces layered with aromatic and seasoned biryani rice.',
        tags: ['non-vegetarian', 'restaurant-specialty'],
      },
      {
        name: 'Shahi Gosht Biryani (Mutton)',
        category: 'Biryani',
        diet: 'non-vegetarian',
        explanation: 'Royal preparation of tender mutton layered with long-grain basmati rice and spices.',
        tags: ['non-vegetarian', 'restaurant-specialty'],
      },
    ],
  },
  {
    id: 'must-try',
    label: 'Must-Try Dishes',
    description: 'A short list of dishes worth ordering on a first visit.',
    dishes: [
      {
        name: 'Garlic Naan',
        category: 'Breads',
        diet: 'vegetarian',
        explanation: 'Soft flatbread topped with minced garlic and cilantro, baked to aromatic perfection.',
        tags: ['must-try', 'vegetarian'],
      },
      {
        name: 'Mango Lassi',
        category: 'Beverages',
        diet: 'vegetarian',
        explanation: 'A popular creamy drink made with sweet mango pulp and fresh yogurt.',
        tags: ['must-try', 'vegetarian'],
      },
      {
        name: 'Gulab Jamun',
        category: 'Desserts',
        diet: 'vegetarian',
        explanation: 'Soft dough balls soaked in a sweet rose water and cardamom sugar syrup.',
        tags: ['must-try', 'vegetarian'],
      },
    ],
  },
  {
    id: 'restaurant-specialties',
    label: 'Restaurant Specialities',
    description: 'Ottawa Masakali specialties across Stittsville and Wellington.',
    dishes: [
      {
        name: 'Butter Gravy Pasta',
        category: 'Signature Butter Gravy',
        diet: 'vegetarian',
        explanation: 'Al dente pasta tossed in a rich, creamy tomato-based butter gravy.',
        tags: ['restaurant-specialty'],
      },
      {
        name: 'Chilli Garlic Naan',
        category: 'Breads',
        diet: 'vegetarian',
        explanation: 'Spicy flatbread topped with fresh green chilies and aromatic minced garlic.',
        tags: ['restaurant-specialty', 'vegetarian'],
      },
    ],
  },
];

export function flattenRecommendedDishes() {
  const seen = new Set();
  const all = [];
  dishRecommendationGroups.forEach((group) => {
    (group.dishes || []).forEach((dish) => {
      const key = String(dish.name || '').toLowerCase();
      if (!key || seen.has(key)) return;
      seen.add(key);
      all.push({ ...dish, groupId: group.id, groupLabel: group.label });
    });
  });
  return all;
}
