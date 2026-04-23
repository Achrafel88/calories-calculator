'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Utensils, Zap, Search, Target, Flame, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { findFoodByName, foodDatabase } from '@/lib/foodDatabase';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch', label: 'Lunch', icon: '🍲' },
  { id: 'dinner', label: 'Dinner', icon: '🥗' },
  { id: 'snack', label: 'Snacks', icon: '🍎' },
];

export const Dashboard = () => {
  const { profile, dailyLogs, addFoodEntry, removeFoodEntry, addWater } = useAppStore();
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

      {/* Calorie Card */}
      <motion.div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="text-blue-100/80 text-sm font-medium flex items-center gap-2"><Target size={14} /> Daily Goal</div>
              <div className="text-3xl font-black">{profile.calorieTarget} <span className="text-sm font-normal text-blue-100/80">kcal</span></div>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl"><Flame size={24} /></div>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-white rounded-full" />
          </div>
          <div className="flex justify-between pt-4 mt-2 border-t border-white/10">
              <div className="text-center"><div className="text-[10px] text-blue-100/60 uppercase font-bold">Protein</div><div className="font-bold">{totalProtein}g</div></div>
              <div className="text-center"><div className="text-[10px] text-blue-100/60 uppercase font-bold">Carbs</div><div className="font-bold">{totalCarbs}g</div></div>
              <div className="text-center"><div className="text-[10px] text-blue-100/60 uppercase font-bold">Fat</div><div className="font-bold">{totalFat}g</div></div>
          </div>
      </motion.div>

      {/* Water Tracker */}
      <div className="bg-blue-500 rounded-[2.5rem] p-6 text-white flex justify-between items-center">
         <div className="flex items-center gap-3">
           <div className="bg-white/20 p-2 rounded-xl"><Droplets size={20} /></div>
           <div><div className="text-[10px] uppercase font-bold">Water</div><div className="text-xl font-black">{water} ml</div></div>
         </div>
         <div className="flex gap-2">
           <button onClick={() => addWater(today, 250)} className="bg-white/20 px-4 py-2 rounded-xl font-bold">+250</button>
           <button onClick={() => addWater(today, -250)} className="bg-white/10 px-4 py-2 rounded-xl font-bold">-</button>
         </div>
      </div>
      
      {/* Smart Suggestion */}
      {remaining > 0 && (
        <div className="bg-white p-5 rounded-3xl border border-blue-50 flex items-start gap-4 shadow-sm">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Zap size={20} /></div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Smart Tip</h4>
            <p className="text-gray-500 text-xs mt-1">You have {remaining} kcal left. {remaining > 500 ? "Try a healthy Tajine!" : "Maybe some fruit?"}</p>
          </div>
        </div>
      )}

      {/* Meal Sections */}
      <div className="grid grid-cols-1 gap-4">
          {MEAL_TYPES.map((meal) => {
            const entries = dayLog.entries.filter(e => e.mealType === meal.id);
            return (
              <div key={meal.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center">
                 <div className="flex items-center gap-3"><span className="text-2xl">{meal.icon}</span><span className="font-bold">{meal.label}</span></div>
                 <button onClick={() => { setMealType(meal.id as any); setIsAddingFood(true); }} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><Plus size={18} /></button>
              </div>
            )
          })}
      </div>
      
      {/* Add Food Modal */}
      <AnimatePresence>
        {isAddingFood && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
             <div className="absolute inset-0 bg-black/40" onClick={() => setIsAddingFood(false)} />
             <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8">
               <input autoFocus value={foodInput} onChange={(e) => handleInputChange(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl" placeholder="Search food..." />
               {suggestions.map(s => <button key={s.id} onClick={() => selectSuggestion(s)} className="w-full text-left p-3 border-b">{s.name}</button>)}
               <button onClick={handleAddFood} className="w-full mt-4 p-4 bg-blue-600 text-white rounded-2xl font-bold">Add Food</button>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
