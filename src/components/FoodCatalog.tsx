'use client';

import React, { useState } from 'react';
import { foodDatabase, FoodItem } from '@/lib/foodDatabase';
import { Search, Beef, Wheat, Droplets, UtensilsCrossed, LayoutGrid, Coffee, Apple, Pizza } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'bread', label: 'Bread', icon: Pizza },
  { id: 'dishes', label: 'Dishes', icon: UtensilsCrossed },
  { id: 'protein', label: 'Protein', icon: Beef },
  { id: 'fruit', label: 'Fruit', icon: Apple },
  { id: 'drink', label: 'Drinks', icon: Coffee },
];

export const FoodCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFood = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-32 pt-12 px-6 max-w-md mx-auto space-y-8 min-h-screen bg-gray-50/30">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Food Catalog</h1>
        <p className="text-gray-500 font-medium">Search for anything you eat.</p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search food (e.g. Tajine, Khobz...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-5 bg-white rounded-[2rem] border-none focus:ring-2 focus:ring-green-500 outline-none shadow-xl shadow-gray-100 transition-all"
        />
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-2",
              activeCategory === cat.id 
                ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200 scale-105" 
                : "bg-white border-gray-50 text-gray-400 hover:border-green-100"
            )}
          >
            <cat.icon size={18} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Food List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredFood.map((food, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={food.id}
              className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-gray-800 text-xl group-hover:text-green-600 transition-colors leading-tight">{food.name}</h3>
                  <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{food.category}</p>
                </div>
                <div className="text-right bg-green-50 p-3 rounded-2xl">
                  <div className="text-2xl font-black text-green-600 leading-none">{food.calories}</div>
                  <div className="text-[10px] text-green-700/50 uppercase font-black mt-1">kcal / 100{food.baseUnit}</div>
                </div>
              </div>

              {/* Servings Info */}
              <div className="bg-gray-50/50 rounded-3xl p-4 mb-6">
                <p className="text-[10px] uppercase font-black text-gray-400 mb-3 tracking-widest">Common Servings</p>
                <div className="flex flex-wrap gap-2">
                  {food.servings.map((s) => (
                    <div key={s.unit} className="bg-white px-3 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-600">
                      1 {s.unit} ≈ <span className="text-green-600">{Math.round((s.weight / 100) * food.calories)} kcal</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-gray-50 pt-6">
                <div className="flex flex-col items-center p-3 rounded-[1.5rem] bg-red-50/50 border border-red-100/20">
                  <Beef size={14} className="text-red-500 mb-1.5" />
                  <span className="text-sm font-black text-gray-800">{food.protein}g</span>
                  <span className="text-[8px] text-red-600/50 uppercase font-black tracking-widest">Protein</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-[1.5rem] bg-amber-50/50 border border-amber-100/20">
                  <Wheat size={14} className="text-amber-500 mb-1.5" />
                  <span className="text-sm font-black text-gray-800">{food.carbs}g</span>
                  <span className="text-[8px] text-amber-600/50 uppercase font-black tracking-widest">Carbs</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-[1.5rem] bg-blue-50/50 border border-blue-100/20">
                  <Droplets size={14} className="text-blue-500 mb-1.5" />
                  <span className="text-sm font-black text-gray-800">{food.fat}g</span>
                  <span className="text-[8px] text-blue-600/50 uppercase font-black tracking-widest">Fat</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredFood.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <UtensilsCrossed size={64} className="mx-auto text-gray-200 mb-6" />
            <p className="text-gray-400 font-bold text-lg">No food found matching your search.</p>
            <p className="text-gray-300 text-sm mt-2">Try searching for Tajine, Khobz, or Egg.</p>
          </div>
        )}
      </div>
    </div>
  );
};
