'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/components/Dashboard';
import { FoodCatalog } from '@/components/FoodCatalog';
import { HistoryView } from '@/components/HistoryView';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, History as HistoryIcon, Trash2 } from 'lucide-react';

export default function Home() {
  const { profile, resetLogs, updateProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!profile.isOnboarded) {
    return <Onboarding />;
  }

  return (
    <main className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Dashboard />
          </motion.div>
        )}

        {activeTab === 'catalog' && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <FoodCatalog />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <HistoryView />
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 max-w-md mx-auto pt-12 space-y-8"
          >
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h2 className="font-bold text-lg capitalize">{profile.gender}</h2>
                  <p className="text-sm text-gray-400">{profile.age} years • {profile.weight}kg • {profile.height}cm</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => updateProfile({ isOnboarded: false })}
                className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 font-semibold text-gray-700">
                  <User size={20} />
                  Re-run Onboarding
                </div>
              </button>
              
              <button 
                onClick={() => {
                  if(confirm('Are you sure you want to clear all data?')) {
                    resetLogs();
                    updateProfile({ isOnboarded: false });
                  }
                }}
                className="w-full flex items-center justify-between p-5 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors text-red-600"
              >
                <div className="flex items-center gap-3 font-semibold">
                  <Trash2 size={20} />
                  Clear All Data
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
