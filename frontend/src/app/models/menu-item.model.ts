export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory; // au lieu de 'category: string', lier directement l'objet MenuCategory
  isVegetarian: boolean;
  isAvailable: boolean;
  allergens: string[]; // ex: ['gluten', 'dairy']
}

export interface MenuCategory {
  id: number;        // Utiliser un id numérique pour plus de clarté
  label: string;     // ex: 'Main Courses'
}

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 1, label: 'Starters' },
  { id: 2, label: 'Main Courses' },
  { id: 3, label: 'Desserts' },
  { id: 4, label: 'Drinks' }
];
