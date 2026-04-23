# Calorie Tracker Web App

A modern, responsive calorie tracking application built with Next.js 15, Tailwind CSS, and Zustand.

## Features

- **Personalized Setup:** Onboarding flow to calculate BMR and TDEE using the Mifflin-St Jeor Equation.
- **Goal Setting:** Choose between losing, maintaining, or gaining weight with automatic calorie targeting.
- **Smart Food Tracking:** Add food using a smart parser (e.g., "2 eggs", "150g bread").
- **Moroccan Food Database:** Includes items like Khobz, Tajine, Couscous, Zaalouk, and more.
- **Real-time Dashboard:** Track consumed vs. remaining calories with animated progress bars.
- **Mobile-First Design:** Sticky bottom navigation and responsive UI optimized for mobile devices.
- **Persistence:** All data is saved locally using `localStorage` via Zustand.

## Tech Stack

- **Framework:** Next.js (App Router)
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Calculation Logic

The app uses the **Mifflin-St Jeor Equation**:
- **Men:** 10 × weight (kg) + 6.25 × height (cm) - 5 × age (y) + 5
- **Women:** 10 × weight (kg) + 6.25 × height (cm) - 5 × age (y) - 161

Target calories are adjusted based on your goal:
- **Lose Weight:** TDEE - 500 kcal
- **Maintain Weight:** TDEE
- **Gain Weight:** TDEE + 300 kcal
