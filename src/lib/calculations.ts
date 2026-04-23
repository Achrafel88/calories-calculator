export type Gender = 'male' | 'female';
export type ActivityLevel = 'low' | 'medium' | 'high';
export type Goal = 'lose' | 'maintain' | 'gain';

export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  const multipliers = {
    low: 1.2,
    medium: 1.55,
    high: 1.9,
  };
  return Math.round(bmr * multipliers[activityLevel]);
};

export const calculateTargetCalories = (tdee: number, goal: Goal): number => {
  switch (goal) {
    case 'lose':
      return tdee - 500;
    case 'gain':
      return tdee + 300;
    case 'maintain':
    default:
      return tdee;
  }
};
