'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Flame, Droplets, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { findFoodByName, foodDatabase } from '@/lib/foodDatabase';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch', label: 'Lunch', icon: '🍲' },
  { id: 'dinner', label: 'Dinner', icon: '🥗' },
  { id: 'snack', label: 'Snacks', icon: '🍎' },
];

export const Dashboard = () => {
  const { profile, dailyLogs, addFoodEntry, addWater } = useAppStore();
  const today = format(new Date(), 'yyyy-MM-dd');
  const dayLog = dailyLogs[today] || { date: today, entries: [], water: 0 };
  
  const consumed = dayLog.entries.reduce((sum, e) => sum + e.calories, 0);
  const totalProtein = dayLog.entries.reduce((sum, e) => sum + (e.protein || 0), 0);
  const totalCarbs = dayLog.entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
  const totalFat = dayLog.entries.reduce((sum, e) => sum + (e.fat || 0), 0);
  const water = dayLog.water || 0;

  const remaining = profile.calorieTarget - consumed;
  const progress = Math.min((consumed / profile.calorieTarget) * 100, 100);

  const [isAddingFood, setIsAddingFood] = useState(false);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [foodInput, setFoodInput] = useState('');
  const [suggestions, setSuggestions] = useState<typeof foodDatabase>([]);

  const handleInputChange = (val: string) => {
    setFoodInput(val);
    const regex = /^(\d+)?\s*(\w+)?\s*(.*)$/i;
    const match = val.match(regex);
    const searchPart = (match?.[3] || match?.[2] || match?.[1] || '').toLowerCase().trim();
    if (searchPart.length > 1) {
      setSuggestions(foodDatabase.filter(f => f.name.toLowerCase().includes(searchPart) || f.id.toLowerCase().includes(searchPart)).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (food: typeof foodDatabase[0]) => {
    const regex = /^(\d+\s*\w*\s*)/i;
    const match = foodInput.match(regex);
    const prefix = match ? match[1] : "";
    setFoodInput(`${prefix}${food.name}`);
    setSuggestions([]);
  };

  const handleAddFood = () => {
    const regex = /^(\d+)\s*(\w+)?\s*(.*)$/i;
    const match = foodInput.match(regex);
    let amount = 100;
    let unitInput = '';
    let nameInput = foodInput;
    if (match) {
      amount = Number(match[1]);
      unitInput = (match[2] || '').toLowerCase().trim();
      nameInput = (match[3] || '').trim();
      if (!nameInput) { nameInput = unitInput; unitInput = ''; }
    }
    const foodItem = findFoodByName(nameInput);
    if (foodItem) {
      let finalWeight = amount;
      const serving = foodItem.servings.find(s => s.unit === unitInput || s.unit + 's' === unitInput || (unitInput === '' && (s.unit === 'piece' || s.unit === 'unit' || s.unit === 'egg')));
      if (serving) finalWeight = amount * serving.weight;
      else if (['g', 'gram', 'grams', 'ml'].includes(unitInput)) finalWeight = amount;
      else if (unitInput !== '') finalWeight = amount * (foodItem.servings[0]?.weight || 100);
      const factor = finalWeight / 100;
      addFoodEntry(today, {
        name: foodItem.name, calories: Math.round(factor * foodItem.calories),
        protein: Math.round(factor * foodItem.protein), carbs: Math.round(factor * foodItem.carbs),
        fat: Math.round(factor * foodItem.fat), amount: finalWeight, unit: foodItem.baseUnit, mealType,
      });
    } else {
      addFoodEntry(today, {
        name: foodInput || 'Custom Food', calories: amount > 50 ? amount * 2 : amount,
        protein: Math.round(amount * 0.05), carbs: Math.round(amount * 0.2), fat: Math.round(amount * 0.05),
        amount, unit: 'g', mealType,
      });
    }
    setFoodInput(''); setIsAddingFood(false);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-medium text-gray-400">Today, {format(new Date(), 'MMM dd')}</h2>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>

      <motion.div className="bg-green-600 dark:bg-green-950 rounded-[2.5rem] p-8 text-white shadow-xl shadow-green-200 dark:shadow-green-950/50">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="text-green-100 dark:text-green-300 text-sm font-medium flex items-center gap-2"><Target size={14} /> Daily Goal</div>
              <div className="text-3xl font-black">{profile.calorieTarget} <span className="text-sm font-normal text-green-100 dark:text-green-300">kcal</span></div>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl"><Flame size={24} /></div>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-white rounded-full" />
          </div>
          <div className="flex justify-between pt-4 mt-2 border-t border-white/10">
              <div className="text-center"><div className="text-[10px] text-green-100 dark:text-green-300 uppercase font-bold">Protein</div><div className="font-bold">{totalProtein}g</div></div>
              <div className="text-center"><div className="text-[10px] text-green-100 dark:text-green-300 uppercase font-bold">Carbs</div><div className="font-bold">{totalCarbs}g</div></div>
              <div className="text-center"><div className="text-[10px] text-green-100 dark:text-green-300 uppercase font-bold">Fat</div><div className="font-bold">{totalFat}g</div></div>
          </div>
      </motion.div>

      <div className="bg-green-500 dark:bg-green-800 rounded-[2.5rem] p-6 text-white flex justify-between items-center shadow-lg">
         <div className="flex items-center gap-3">
           <div className="bg-white/20 p-2 rounded-xl"><Droplets size={20} /></div>
           <div><div className="text-[10px] uppercase font-bold">Water</div><div className="text-xl font-black">{water} ml</div></div>
         </div>
         <div className="flex gap-2">
           <button onClick={() => addWater(today, 250)} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-bold transition-all">+250</button>
           <button onClick={() => addWater(today, -250)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl font-bold transition-all">-</button>
         </div>
      </div>
      
      {remaining > 0 && (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-green-50 dark:border-green-900 flex items-start gap-4 shadow-sm">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-2xl text-green-600"><Zap size={20} /></div>
          <div>
            <h4 className="font-bold dark:text-white text-sm">Smart Tip</h4>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">You have {remaining} kcal left.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
          {MEAL_TYPES.map((meal) => (
              <div key={meal.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
                 <div className="flex items-center gap-3"><span className="text-2xl">{meal.icon}</span><span className="font-bold dark:text-white">{meal.label}</span></div>
                 <button onClick={() => { setMealType(meal.id as any); setIsAddingFood(true); }} className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"><Plus size={18} /></button>
              </div>
          ))}
      </div>
      
      <AnimatePresence>
        {isAddingFood && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingFood(false)} />
             <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
               <input autoFocus value={foodInput} onChange={(e) => handleInputChange(e.target.value)} className="w-full p-4 bg-green-50 dark:bg-green-900/30 rounded-2xl outline-none focus:ring-2 focus:ring-green-500" placeholder="Search food..." />
               <div className="max-h-40 overflow-y-auto mt-2">
                 {suggestions.map(s => <button key={s.id} onClick={() => selectSuggestion(s)} className="w-full text-left p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-green-50">{s.name}</button>)}
               </div>
               <button onClick={handleAddFood} className="w-full mt-4 p-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all">Add Food</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
