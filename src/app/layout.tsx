import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calorie Tracker - Smart Moroccan Food Tracker",
  description: "The smartest calorie tracker for Moroccan food. Track Tajine, Couscous, and more with ease. Calculate your daily needs and reach your goals.",
  icons: {
    icon: "/icon.svg",
  },
  keywords: ["Calorie Tracker", "Moroccan Food", "Fitness", "Nutrition", "Tajine", "Couscous", "Healthy Eating"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
