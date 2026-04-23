export interface ServingSize {
  unit: string;
  weight: number; // in g or ml
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'bread' | 'dishes' | 'protein' | 'veg' | 'fruit' | 'dairy' | 'drink' | 'fat' | 'extra' | 'legumes' | 'pastry';
  calories: number; // per 100g/ml
  protein: number;
  carbs: number;
  fat: number;
  baseUnit: 'g' | 'ml';
  servings: ServingSize[];
}

export const foodDatabase: FoodItem[] = [
  // 🍞 BREAD & PASTRIES (Moroccan Style)
  { 
    id: 'khobz', name: 'Khobz (Moroccan Bread) خبز', category: 'bread', calories: 250, protein: 8, carbs: 50, fat: 2, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 200 }, { unit: 'half', weight: 100 }, { unit: 'quarter', weight: 50 }]
  },
  { 
    id: 'msemen', name: 'Msemen (Rghifa) مسمن', category: 'bread', calories: 350, protein: 7, carbs: 45, fat: 15, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 100 }]
  },
  { 
    id: 'harcha', name: 'Harcha حرشة', category: 'bread', calories: 320, protein: 6, carbs: 48, fat: 12, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 120 }, { unit: 'small', weight: 60 }]
  },
  { 
    id: 'baghrir', name: 'Baghrir (Pancake) بغرير', category: 'bread', calories: 200, protein: 6, carbs: 40, fat: 1, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 70 }]
  },
  { 
    id: 'batbout', name: 'Batbout بطبوط', category: 'bread', calories: 270, protein: 8, carbs: 55, fat: 3, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 80 }]
  },

  // 🥘 MAIN DISHES & TAGINES
  { 
    id: 'tajine_beef', name: 'Beef Tajine طاجين لحم', category: 'dishes', calories: 180, protein: 18, carbs: 12, fat: 8, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 350 }, { unit: 'small plate', weight: 200 }]
  },
  { 
    id: 'tajine_chicken', name: 'Chicken Tajine طاجين دجاج', category: 'dishes', calories: 150, protein: 15, carbs: 10, fat: 6, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 350 }]
  },
  { 
    id: 'couscous', name: 'Couscous كسكس', category: 'dishes', calories: 180, protein: 6, carbs: 36, fat: 2, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 400 }, { unit: 'bowl', weight: 250 }]
  },
  { 
    id: 'rfissa', name: 'Rfissa رفيسة', category: 'dishes', calories: 220, protein: 12, carbs: 25, fat: 10, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 400 }]
  },
  { 
    id: 'bastilla_chicken', name: 'Chicken Bastilla بسطيلة دجاج', category: 'dishes', calories: 310, protein: 15, carbs: 35, fat: 12, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 250 }]
  },
  { 
    id: 'seffa', name: 'Seffa (Medfouna) سفة', category: 'dishes', calories: 280, protein: 8, carbs: 52, fat: 6, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 300 }]
  },

  // 🥣 LEGUMES & SOUPS (Popular)
  { 
    id: 'loubia', name: 'Loubia (White Beans) لوبيا', category: 'legumes', calories: 140, protein: 9, carbs: 22, fat: 2, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 350 }, { unit: 'bowl', weight: 250 }]
  },
  { 
    id: 'adas', name: 'Adas (Lentils) عدس', category: 'legumes', calories: 130, protein: 8, carbs: 20, fat: 3, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 350 }, { unit: 'bowl', weight: 250 }]
  },
  { 
    id: 'bissara', name: 'Bissara (Fava Beans) بصارة', category: 'legumes', calories: 120, protein: 7, carbs: 18, fat: 4, baseUnit: 'g',
    servings: [{ unit: 'bowl', weight: 300 }, { unit: 'zlafa', weight: 300 }]
  },
  { 
    id: 'harira', name: 'Harira Soup حريرة', category: 'dishes', calories: 95, protein: 4, carbs: 14, fat: 2, baseUnit: 'g',
    servings: [{ unit: 'bowl', weight: 300 }, { unit: 'zlafa', weight: 300 }]
  },

  // 🥗 SALADS & VEGGIES
  { 
    id: 'chlada_marocaine', name: 'Moroccan Salad (Tomato/Onion) شلاظة مغربية', category: 'veg', calories: 45, protein: 1, carbs: 5, fat: 3, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 150 }, { unit: 'bowl', weight: 100 }]
  },
  { 
    id: 'rice_salad', name: 'Rice Salad (Jardiniere) شلاظة روز', category: 'veg', calories: 160, protein: 4, carbs: 28, fat: 5, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 200 }, { unit: 'bowl', weight: 150 }]
  },
  { 
    id: 'zaalouk', name: 'Zaalouk زعلوك', category: 'veg', calories: 80, protein: 2, carbs: 8, fat: 4, baseUnit: 'g',
    servings: [{ unit: 'small bowl', weight: 100 }, { unit: 'spoon', weight: 20 }]
  },
  { 
    id: 'taktouka', name: 'Taktouka تكتوكة', category: 'veg', calories: 75, protein: 2, carbs: 7, fat: 5, baseUnit: 'g',
    servings: [{ unit: 'small bowl', weight: 100 }]
  },
  { 
    id: 'bakoula', name: 'Bakoula (Spinach style) بقولة', category: 'veg', calories: 90, protein: 4, carbs: 8, fat: 6, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 150 }]
  },

  // 🥚 PROTEINS
  { 
    id: 'egg', name: 'Egg بيض', category: 'protein', calories: 155, protein: 13, carbs: 1, fat: 11, baseUnit: 'g',
    servings: [{ unit: 'egg', weight: 60 }]
  },
  { 
    id: 'chicken', name: 'Chicken دجاج', category: 'protein', calories: 165, protein: 31, carbs: 0, fat: 4, baseUnit: 'g',
    servings: [{ unit: 'breast', weight: 200 }, { unit: 'thigh', weight: 150 }]
  },
  { 
    id: 'kefta', name: 'Kefta كفتة', category: 'protein', calories: 250, protein: 26, carbs: 0, fat: 17, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 50 }]
  },
  { 
    id: 'sardine', name: 'Sardines (Grilled) سردين', category: 'protein', calories: 200, protein: 25, carbs: 0, fat: 11, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 40 }]
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
  { 
    id: 'handia', name: 'Prickly Pear هندية', category: 'fruit', calories: 41, protein: 0.7, carbs: 10, fat: 0.5, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 100 }]
  },
  { 
    id: 'dates', name: 'Dates تمر', category: 'fruit', calories: 280, protein: 2, carbs: 75, fat: 0.4, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 10 }]
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
  { 
    id: 'panache', name: 'Fruit Panaché عصير مشكل', category: 'drink', calories: 85, protein: 1.5, carbs: 18, fat: 1, baseUnit: 'ml',
    servings: [{ unit: 'glass', weight: 250 }]
  },

  // 🍟 CARBS & OTHERS
  { 
    id: 'rice', name: 'Cooked Rice روز', category: 'extra', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, baseUnit: 'g',
    servings: [{ unit: 'plate', weight: 200 }, { unit: 'bowl', weight: 150 }]
  },
  { 
    id: 'fries', name: 'French Fries فريت', category: 'extra', calories: 312, protein: 3.4, carbs: 41, fat: 15, baseUnit: 'g',
    servings: [{ unit: 'portion', weight: 150 }]
  },
  { 
    id: 'olive_oil', name: 'Olive Oil زيت زيتون', category: 'fat', calories: 884, protein: 0, carbs: 0, fat: 100, baseUnit: 'ml',
    servings: [{ unit: 'spoon', weight: 14 }, { unit: 'tbsp', weight: 14 }]
  },
  { 
    id: 'chebakia', name: 'Chebakia شباكية', category: 'pastry', calories: 480, protein: 8, carbs: 55, fat: 28, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 15 }]
  },
  { 
    id: 'briouat_almond', name: 'Almond Briouat بريوات لوز', category: 'pastry', calories: 450, protein: 9, carbs: 52, fat: 24, baseUnit: 'g',
    servings: [{ unit: 'piece', weight: 20 }]
  },
];

export const findFoodByName = (name: string): FoodItem | undefined => {
  const normalizedSearch = name.toLowerCase().trim();
  return foodDatabase.find(food => 
    food.name.toLowerCase().includes(normalizedSearch) || 
    food.id.toLowerCase().includes(normalizedSearch)
  );
};
