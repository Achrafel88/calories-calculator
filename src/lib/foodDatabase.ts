export interface ServingSize {
  unit: string;
  weight: number; // in g or ml
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'bread' | 'dishes' | 'protein' | 'veg' | 'fruit' | 'dairy' | 'drink' | 'fat' | 'extra';
  calories: number; // per 100g/ml
  protein: number;
  carbs: number;
  fat: number;
  baseUnit: 'g' | 'ml';
  servings: ServingSize[];
}

export const foodDatabase: FoodItem[] = [
  // 🍞 BREAD
  { 
    id: 'khobz', name: 'Khobz (Moroccan Bread) خبز', category: 'bread', calories: 250, protein: 8, carbs: 50, fat: 2, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 200 }, { unit: 'half', weight: 100 }, { unit: 'quarter', weight: 50 }]
  },
  { 
    id: 'msemen', name: 'Msemen (Rghifa) مسمن', category: 'bread', calories: 350, protein: 7, carbs: 45, fat: 15, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 100 }]
  },
  { 
    id: 'batbout', name: 'Batbout بطبوط', category: 'bread', calories: 270, protein: 8, carbs: 55, fat: 3, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 80 }]
  },

  // 🥘 MAIN DISHES
  { 
    id: 'tajine', name: 'Tajine طاجين', category: 'dishes', calories: 160, protein: 15, carbs: 12, fat: 8, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 350 }, { unit: 'small plate', weight: 200 }, { unit: 'bowl', weight: 250 }]
  },
  { 
    id: 'couscous', name: 'Couscous كسكس', category: 'dishes', calories: 180, protein: 6, carbs: 36, fat: 2, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 400 }, { unit: 'bowl', weight: 250 }]
  },
  { 
    id: 'harira', name: 'Harira Soup حريرة', category: 'dishes', calories: 95, protein: 4, carbs: 14, fat: 2, baseUnit: 'g',
    servings: [{ unit: 'bowl', weight: 300 }, { unit: 'zlafa', weight: 300 }]
  },
  { 
    id: 'rfissa', name: 'Rfissa رفيسة', category: 'dishes', calories: 220, protein: 12, carbs: 25, fat: 10, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 400 }]
  },

  // 🥚 PROTEINS
  { 
    id: 'egg', name: 'Egg بيض', category: 'protein', calories: 155, protein: 13, carbs: 1, fat: 11, baseUnit: 'g',
    servings: [{ unit: 'egg', weight: 60 }, { unit: 'piece', weight: 60 }]
  },
  { 
    id: 'chicken', name: 'Chicken دجاج', category: 'protein', calories: 165, protein: 31, carbs: 0, fat: 4, baseUnit: 'g',
    servings: [{ unit: 'breast', weight: 200 }, { unit: 'thigh', weight: 150 }]
  },
  { 
    id: 'kefta', name: 'Kefta كفتة', category: 'protein', calories: 250, protein: 26, carbs: 0, fat: 17, baseUnit: 'g',
    servings: [{ unit: 'ball', weight: 30 }, { unit: 'piece', weight: 50 }]
  },

  // 🥗 VEGETABLES & SALADS
  { 
    id: 'chlada', name: 'Moroccan Salad شلاظة', category: 'veg', calories: 45, protein: 1, carbs: 5, fat: 3, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 150 }, { unit: 'spoon', weight: 20 }]
  },
  { 
    id: 'zaalouk', name: 'Zaalouk زعلوك', category: 'veg', calories: 80, protein: 2, carbs: 8, fat: 4, baseUnit: 'g',
    servings: [{ unit: 'small bowl', weight: 100 }, { unit: 'spoon', weight: 20 }]
  },

  // 🍌 FRUITS
  { 
    id: 'banana', name: 'Banana بنان', category: 'fruit', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 120 }]
  },
  { 
    id: 'apple', name: 'Apple تفاح', category: 'fruit', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 150 }]
  },
  { 
    id: 'orange', name: 'Orange ليمون', category: 'fruit', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 150 }]
  },

  // ☕ DRINKS
  { 
    id: 'atay', name: 'Moroccan Tea أتاي', category: 'drink', calories: 40, protein: 0, carbs: 10, fat: 0, baseUnit: 'ml',
    servings: [{ unit: 'glass', weight: 150 }]
  },
  { 
    id: 'coffee', name: 'Coffee قهوة', category: 'drink', calories: 2, protein: 0.1, carbs: 0, fat: 0, baseUnit: 'ml',
    servings: [{ unit: 'cup', weight: 150 }, { unit: 'glass', weight: 100 }]
  },

  // 🫒 FATS & EXTRAS
  { 
    id: 'olive_oil', name: 'Olive Oil زيت زيتون', category: 'fat', calories: 884, protein: 0, carbs: 0, fat: 100, baseUnit: 'ml',
    servings: [{ unit: 'spoon', weight: 14 }, { unit: 'tbsp', weight: 14 }]
  },
  { 
    id: 'honey', name: 'Honey عسل', category: 'extra', calories: 304, protein: 0.3, carbs: 82, fat: 0, baseUnit: 'g',
    servings: [{ unit: 'spoon', weight: 20 }, { unit: 'tsp', weight: 7 }]
  },
];

export const findFoodByName = (name: string): FoodItem | undefined => {
  const normalizedSearch = name.toLowerCase().trim();
  return foodDatabase.find(food => 
    food.name.toLowerCase().includes(normalizedSearch) || 
    food.id.toLowerCase().includes(normalizedSearch)
  );
};
