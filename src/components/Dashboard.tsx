'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Utensils, Zap, Search, Target, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { findFoodByName, foodDatabase } from '@/lib/foodDatabase';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch', label: 'Lunch', icon: '🍲' },
  { id: 'dinner', label: 'Dinner', icon: '🥗' },
  { id: 'snack', label: 'Snacks', icon: '🍎' },
];

export const Dashboard = () => {
  const { profile, dailyLogs, addFoodEntry, removeFoodEntry } = useAppStore();
  const today = format(new Date(), 'yyyy-MM-dd');
  const dayLog = dailyLogs[today] || { date: today, entries: [] };
  
  const consumed = dayLog.entries.reduce((sum, e) => sum + e.calories, 0);
  const totalProtein = dayLog.entries.reduce((sum, e) => sum + (e.protein || 0), 0);
  const totalCarbs = dayLog.entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
  const totalFat = dayLog.entries.reduce((sum, e) => sum + (e.fat || 0), 0);

  const remaining = profile.calorieTarget - consumed;
  const progress = Math.min((consumed / profile.calorieTarget) * 100, 100);

  const [isAddingFood, setIsAddingFood] = useState(false);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [foodInput, setFoodInput] = useState('');
  const [suggestions, setSuggestions] = useState<typeof foodDatabase>([]);

  const handleInputChange = (val: string) => {
    setFoodInput(val);
    
    // Extract name part for suggestions
    const regex = /^(\d+)?\s*(\w+)?\s*(.*)$/i;
    const match = val.match(regex);
    const searchPart = (match?.[3] || match?.[2] || match?.[1] || '').toLowerCase().trim();

    if (searchPart.length > 1) {
      const filtered = foodDatabase.filter(f => 
        f.name.toLowerCase().includes(searchPart) || 
        f.id.toLowerCase().includes(searchPart)
      ).slice(0, 5); // show top 5
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (food: typeof foodDatabase[0]) => {
    // Keep the number if user already typed it, e.g., "200g " + "Chicken"
    const regex = /^(\d+\s*\w*\s*)/i;
    const match = foodInput.match(regex);
    const prefix = match ? match[1] : "";
    
    setFoodInput(`${prefix}${food.name}`);
    setSuggestions([]);
  };

  const handleAddFood = () => {
    // Advanced regex: [number] [potential unit] [food name]
    const regex = /^(\d+)\s*(\w+)?\s*(.*)$/i;
    const match = foodInput.match(regex);
    
    let amount = 100;
    let unitInput = '';
    let nameInput = foodInput;

    if (match) {
      amount = Number(match[1]);
      unitInput = (match[2] || '').toLowerCase().trim();
      nameInput = (match[3] || '').trim();
      
      // If nameInput is empty, it means the user might have written "2 eggs" 
      // where match[2] is the food name, not the unit.
      if (!nameInput) {
        nameInput = unitInput;
        unitInput = '';
      }
    }

    const foodItem = findFoodByName(nameInput);
    
    if (foodItem) {
      let finalWeight = amount;
      
      // Try to find if the unitInput matches any of the food's servings
      const serving = foodItem.servings.find(s => 
        s.unit === unitInput || 
        s.unit + 's' === unitInput || // handle plural like "eggs"
        (unitInput === '' && (s.unit === 'piece' || s.unit === 'unit' || s.unit === 'egg'))
      );

      if (serving) {
        finalWeight = amount * serving.weight;
      } else if (['g', 'gram', 'grams', 'ml'].includes(unitInput)) {
        finalWeight = amount; // It's already in grams/ml
      } else if (unitInput !== '') {
        // If they wrote a unit we don't know, but it's not "g", 
        // we check if it's the first serving unit (like if they wrote "1 big plate")
        finalWeight = amount * (foodItem.servings[0]?.weight || 100);
      }

      const factor = finalWeight / 100;
      
      addFoodEntry(today, {
        name: foodItem.name,
        calories: Math.round(factor * foodItem.calories),
        protein: Math.round(factor * foodItem.protein),
        carbs: Math.round(factor * foodItem.carbs),
        fat: Math.round(factor * foodItem.fat),
        amount: finalWeight,
        unit: foodItem.baseUnit,
        mealType,
      });
      setFoodInput('');
      setIsAddingFood(false);
    } else {
      // Manual fallback...
      addFoodEntry(today, {
        name: foodInput || 'Custom Food',
        calories: amount > 50 ? amount * 2 : amount,
        protein: Math.round(amount * 0.05),
        carbs: Math.round(amount * 0.2),
        fat: Math.round(amount * 0.05),
        amount,
        unit: 'g',
        mealType,
      });
      setFoodInput('');
      setIsAddingFood(false);
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto space-y-8 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-medium text-gray-400">Today, {format(new Date(), 'MMM dd')}</h2>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
          {profile.gender === 'male' ? 'M' : 'F'}
        </div>
      </div>

      {/* Calorie Card */}
      <motion.div 
        layout
        className="bg-green-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-green-200 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="text-green-100/80 text-sm font-medium flex items-center gap-2">
                <Target size={14} />
                Daily Goal
              </div>
              <div className="text-3xl font-black">{profile.calorieTarget} <span className="text-sm font-normal text-green-100/80">kcal</span></div>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Flame size={24} className="text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>{consumed} consumed</span>
              <span>{Math.max(0, remaining)} left</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              />
            </div>

            <div className="flex justify-between pt-2 border-t border-white/10 mt-4">
              <div className="text-center">
                <div className="text-xs text-green-100/60 uppercase font-bold">Protein</div>
                <div className="font-bold">{totalProtein}g</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-green-100/60 uppercase font-bold">Carbs</div>
                <div className="font-bold">{totalCarbs}g</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-green-100/60 uppercase font-bold">Fat</div>
                <div className="font-bold">{totalFat}g</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative circle */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />
      </motion.div>

      {/* Smart Suggestion */}
      {remaining > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-green-100 flex items-start gap-4"
        >
          <div className="bg-green-100 p-3 rounded-2xl text-green-600">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Smart Suggestion</h4>
            <p className="text-gray-500 text-sm mt-1">
              You have <span className="text-green-600 font-bold">{remaining} kcal</span> left.
              {remaining > 500 ? " Try a healthy Tajine or Couscous for lunch!" : 
               remaining > 200 ? " How about a banana or some almonds?" : 
               " A light salad would be perfect now."}
            </p>
          </div>
        </motion.div>
      )}

      {/* Meal Sections */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Utensils size={18} className="text-green-500" />
          Meals
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {MEAL_TYPES.map((meal) => {
            const mealEntries = dayLog.entries.filter(e => e.mealType === meal.id);
            const mealCals = mealEntries.reduce((sum, e) => sum + e.calories, 0);

            return (
              <motion.div 
                key={meal.id}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meal.icon}</span>
                    <span className="font-bold text-gray-800">{meal.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{mealCals} kcal</span>
                    <button 
                      onClick={() => {
                        setMealType(meal.id as any);
                        setIsAddingFood(true);
                      }}
                      className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {mealEntries.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-gray-50">
                    {mealEntries.map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">
                          <span className="font-medium text-gray-800">{entry.name}</span>
                          <span className="text-gray-400 ml-2">{entry.amount}{entry.unit}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{entry.calories} kcal</span>
                          <button 
                            onClick={() => removeFoodEntry(today, entry.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal (Simplified) */}
      <AnimatePresence>
        {isAddingFood && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingFood(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8 sm:hidden" />
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. 2 eggs, 100g bread, banana"
                    value={foodInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFood()}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                {/* Suggestions List */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl"
                    >
                      {suggestions.map((food) => (
                        <button
                          key={food.id}
                          onClick={() => selectSuggestion(food)}
                          className="w-full px-4 py-3 text-left hover:bg-green-50 flex justify-between items-center transition-colors border-b border-gray-50 last:border-none"
                        >
                          <span className="font-bold text-gray-700">{food.name}</span>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            {food.calories} kcal/100{food.baseUnit}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-xs text-gray-400 px-1">
                  💡 Tip: Include amount (e.g. "2 eggs" or "150g tajine")
                </p>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsAddingFood(false)}
                    className="flex-1 py-4 font-bold text-gray-500"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddFood}
                    className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100"
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
