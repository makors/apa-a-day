'use client';

import { useStreakStore } from "@/app/_stores/streak";

export default function StreakCounter() {
    const streakStore = useStreakStore();

    return <h1 className="fixed right-3 md:right-auto top-3 md:top-auto text-lg font-semibold">🔥 {streakStore.streak}</h1>
}