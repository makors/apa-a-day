'use client';

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StreakState {
    streak: number;
    resetStreak: () => void;
    incrementStreak: () => void;
}

interface CompletedState {
    last_completed: Date;
    setLastCompleted: (date: Date) => void;
    setCompletedDefault: () => void;
}

export const useStreakStore = create<StreakState>()(
    persist(
        (set) => ({
            streak: 0,
            resetStreak: () => set({ streak: 0 }),
            incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
        }),
        {
            name: 'streak-storage',
        }
    )
);

export const useCompletedStore = create<CompletedState>()(
    persist(
        (set) => ({
            last_completed: new Date("1970-01-01"),
            setLastCompleted: (date: Date) => set({ last_completed: date }),
            setCompletedDefault: () => set({ last_completed: new Date("1970-01-01") }),
        }),
        {
            name: 'completed-storage',
        }
    )
);