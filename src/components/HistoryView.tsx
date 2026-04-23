'use client';

import React from 'react';
import { useAppStore, DayLog } from '@/store/useAppStore';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Flame, Target, Beef, Wheat, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

export const HistoryView = () => {
  const { dailyLogs, profile } = useAppStore();

  // Get last 7 days including today
  const last7Days = [...Array(7)].map((_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dailyLogs[dateStr] || { date: dateStr, entries: [] };
    
    const consumed = log.entries.reduce((sum, e) => sum + e.calories, 0);
    const protein = log.entries.reduce((sum, e) => sum + (e.protein || 0), 0);
    const carbs = log.entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
    const fat = log.entries.reduce((sum, e) => sum + (e.fat || 0), 0);

    return {
      date,
      dateStr,
      consumed,
      protein,
      carbs,
      fat,
      label: format(date, 'EEE'),
    };
  }).reverse();

  const maxCalories = Math.max(...last7Days.map(d => d.consumed), profile.calorieTarget, 1);

  return (
    <div className="pb-32 pt-12 px-6 max-w-md mx-auto space-y-8 min-h-screen bg-gray-50/30">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">History</h1>
        <p className="text-gray-500 font-medium">Your progress over the last week.</p>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className="flex justify-between items-end h-40 gap-2 mb-4">
          {last7Days.map((day, i) => {
            const height = (day.consumed / maxCalories) * 100;
            const isToday = isSameDay(day.date, new Date());
            const overTarget = day.consumed > profile.calorieTarget;

            return (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="relative w-full flex justify-center group">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap z-10">
                    {day.consumed} kcal
                  </div>
                  
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                    className={cn(
                      "w-full max-w-[12px] rounded-full",
                      isToday ? "bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.4)]" : 
                      overTarget ? "bg-red-400" : "bg-gray-200"
                    )}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-tighter",
                  isToday ? "text-green-600" : "text-gray-400"
                )}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-green-600" /> Today
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-gray-200" /> Past
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-red-400" /> Over
           </div>
        </div>
      </div>

      {/* Daily Logs List */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-gray-800 px-2">Daily Logs</h3>
        {last7Days.slice().reverse().map((day, i) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={day.dateStr}
            className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black",
                isSameDay(day.date, new Date()) ? "bg-green-100 text-green-600" : "bg-gray-50 text-gray-400"
              )}>
                <span className="text-[10px] leading-none uppercase">{format(day.date, 'MMM')}</span>
                <span className="text-lg leading-none">{format(day.date, 'dd')}</span>
              </div>
              <div>
                <div className="font-black text-gray-800">{isSameDay(day.date, new Date()) ? 'Today' : format(day.date, 'EEEE')}</div>
                <div className="flex gap-3 mt-1">
                   <div className="flex items-center gap-1 text-[10px] font-bold text-red-500/70 uppercase">
                     <Beef size={10} /> {day.protein}g
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500/70 uppercase">
                     <Wheat size={10} /> {day.carbs}g
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500/70 uppercase">
                     <Droplets size={10} /> {day.fat}g
                   </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={cn(
                "text-xl font-black",
                day.consumed > profile.calorieTarget ? "text-red-500" : "text-gray-900"
              )}>
                {day.consumed}
              </div>
              <div className="text-[10px] text-gray-400 uppercase font-black">kcal</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
