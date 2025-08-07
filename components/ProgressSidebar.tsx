'use client';

import { useStreakStore, useCompletedStore } from "@/app/_stores/streak";
import { Crown, Star, Target, Trophy } from "lucide-react";

function getNextMilestone(streak: number) {
  if (streak < 5) return 5;
  if (streak < 10) return 10;
  if (streak < 20) return 20;
  if (streak < 30) return 30;
  return null;
}

export default function ProgressSidebar() {
  const streakStore = useStreakStore();
  const completedStore = useCompletedStore();

  const lastCompletedEST = new Date(completedStore.last_completed).toLocaleString("en-US", {
    timeZone: "America/New_York"
  });
  const nowEST = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York"
  });

  const isCompletedToday = new Date(lastCompletedEST).toDateString() === new Date(nowEST).toDateString();
  const nextMilestone = getNextMilestone(streakStore.streak);
  const progressPct = nextMilestone ? Math.min((streakStore.streak / nextMilestone) * 100, 100) : 100;

  return (
    <aside className="hidden lg:block lg:sticky lg:top-16 self-start w-80 space-y-4">
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-gray-300">Current Streak</h3>
          <span className="text-orange-400 font-semibold">{streakStore.streak}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="mt-2 text-xs text-gray-400">
          {nextMilestone ? `${nextMilestone - streakStore.streak} day(s) to next milestone` : 'Max milestone achieved'}
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
        <h3 className="text-sm text-gray-300 mb-3">Milestones</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-300"><Target className="w-4 h-4 text-red-400" /> 5 days: Rookie</div>
          <div className="flex items-center gap-2 text-gray-300"><Star className="w-4 h-4 text-orange-400" /> 10 days: Star</div>
          <div className="flex items-center gap-2 text-gray-300"><Trophy className="w-4 h-4 text-yellow-500" /> 20 days: Champion</div>
          <div className="flex items-center gap-2 text-gray-300"><Crown className="w-4 h-4 text-yellow-400" /> 30 days: Legend</div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
        <h3 className="text-sm text-gray-300 mb-2">Today</h3>
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2.5 h-2.5 rounded-full ${isCompletedToday ? 'bg-green-500' : 'bg-gray-600'}`} />
          <span className="text-gray-300">{isCompletedToday ? "Completed" : "Not completed yet"}</span>
        </div>
      </div>
    </aside>
  );
}