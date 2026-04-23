import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Gender, ActivityLevel, Goal } from '@/lib/calculations';

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: number;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
}

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  calorieTarget: number;
  isOnboarded: boolean;
}

interface AppState {
  profile: UserProfile;
  dailyLogs: Record<string, DayLog>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addFoodEntry: (date: string, entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
  removeFoodEntry: (date: string, entryId: string) => void;
  resetLogs: () => void;
}

const initialProfile: UserProfile = {
  weight: 70,
  height: 175,
  age: 25,
  gender: 'male',
  activityLevel: 'medium',
  goal: 'maintain',
  calorieTarget: 2000,
  isOnboarded: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: initialProfile,
      dailyLogs: {},

      updateProfile: (newProfile) =>
        set((state) => ({
          profile: { ...state.profile, ...newProfile },
        })),

      addFoodEntry: (date, entry) =>
        set((state) => {
          const currentDay = state.dailyLogs[date] || { date, entries: [] };
          const newEntry: FoodEntry = {
            ...entry,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
          };
          return {
            dailyLogs: {
              ...state.dailyLogs,
              [date]: {
                ...currentDay,
                entries: [...currentDay.entries, newEntry],
              },
            },
          };
        }),

      removeFoodEntry: (date, entryId) =>
        set((state) => {
          const currentDay = state.dailyLogs[date];
          if (!currentDay) return state;
          return {
            dailyLogs: {
              ...state.dailyLogs,
              [date]: {
                ...currentDay,
                entries: currentDay.entries.filter((e) => e.id !== entryId),
              },
            },
          };
        }),

      resetLogs: () => set({ dailyLogs: {} }),
    }),
    {
      name: 'calorie-tracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
