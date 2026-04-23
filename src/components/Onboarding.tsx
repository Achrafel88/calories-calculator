'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { calculateBMR, calculateTDEE, calculateTargetCalories, Gender, ActivityLevel, Goal } from '@/lib/calculations';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Onboarding = () => {
  const { profile, updateProfile } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    weight: profile.weight,
    height: profile.height,
    age: profile.age,
    gender: profile.gender,
    activityLevel: profile.activityLevel,
    goal: profile.goal,
    calorieTarget: profile.calorieTarget,
  });

  const [calculatedTarget, setCalculatedTarget] = useState(0);

  useEffect(() => {
    const bmr = calculateBMR(formData.weight, formData.height, formData.age, formData.gender);
    const tdee = calculateTDEE(bmr, formData.activityLevel);
    const target = calculateTargetCalories(tdee, formData.goal);
    setCalculatedTarget(target);
    setFormData(prev => ({ ...prev, calorieTarget: target }));
  }, [formData.weight, formData.height, formData.age, formData.gender, formData.activityLevel, formData.goal]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      updateProfile({ ...formData, isOnboarded: true });
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 flex flex-col justify-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-green-600">Welcome!</h1>
          <p className="text-gray-500">Let's set up your personalized calorie goal.</p>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                s <= step ? "bg-green-500" : "bg-gray-100"
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-xl font-semibold">Tell us about yourself</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <div className="flex gap-2">
                  {(['male', 'female'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => updateField('gender', g)}
                      className={cn(
                        "flex-1 py-3 rounded-2xl border-2 transition-all capitalize",
                        formData.gender === g 
                          ? "border-green-500 bg-green-50 text-green-700" 
                          : "border-gray-100 bg-white text-gray-500"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateField('weight', Number(e.target.value))}
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateField('height', Number(e.target.value))}
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField('age', Number(e.target.value))}
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-xl font-semibold">Activity & Goal</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Activity Level</label>
                <div className="grid grid-cols-1 gap-2">
                  {(['low', 'medium', 'high'] as ActivityLevel[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => updateField('activityLevel', a)}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left transition-all capitalize",
                        formData.activityLevel === a 
                          ? "border-green-500 bg-green-50" 
                          : "border-gray-100 bg-white"
                      )}
                    >
                      <div className="font-semibold">{a}</div>
                      <div className="text-xs text-gray-500">
                        {a === 'low' && 'Sedentary, little to no exercise'}
                        {a === 'medium' && 'Moderate exercise 3-5 days/week'}
                        {a === 'high' && 'Heavy exercise 6-7 days/week'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['lose', 'maintain', 'gain'] as Goal[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => updateField('goal', g)}
                      className={cn(
                        "p-3 rounded-2xl border-2 transition-all capitalize text-sm",
                        formData.goal === g 
                          ? "border-green-500 bg-green-50 text-green-700" 
                          : "border-gray-100 bg-white text-gray-500"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-xl font-semibold">Your Daily Target</h2>
            <div className="bg-green-50 p-8 rounded-[2rem] text-center space-y-2 border-2 border-green-100">
              <div className="text-green-600 text-sm font-medium flex items-center justify-center gap-2">
                <Calculator size={16} />
                Calculated for you
              </div>
              <div className="text-5xl font-black text-green-700">
                {calculatedTarget}
              </div>
              <div className="text-green-600/70 text-sm">calories / day</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Adjust manually (optional)</label>
              <input
                type="number"
                value={formData.calorieTarget}
                onChange={(e) => updateField('calorieTarget', Number(e.target.value))}
                className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 outline-none text-center text-xl font-bold"
              />
            </div>
          </motion.div>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-green-600 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
        >
          {step === 3 ? "Complete Profile" : "Continue"}
          {step === 3 ? <CheckCircle2 size={20} /> : <ArrowRight size={20} />}
        </button>
      </motion.div>
    </div>
  );
};
