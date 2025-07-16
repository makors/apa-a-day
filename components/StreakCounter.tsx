'use client';

import { useState } from 'react';
import { useStreakStore, useCompletedStore } from "@/app/_stores/streak";
import { Flame, Trophy, Star, Target, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const getStreakIcon = (streak: number) => {
  if (streak >= 30) return <Crown className="w-6 h-6 text-yellow-400" />;
  if (streak >= 20) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (streak >= 10) return <Star className="w-6 h-6 text-orange-400" />;
  if (streak >= 5) return <Target className="w-6 h-6 text-red-400" />;
  if (streak >= 1) return <Flame className="w-6 h-6 text-orange-500" />;
  return <Zap className="w-6 h-6 text-gray-400" />;
};

const getStreakMessage = (streak: number) => {
  if (streak >= 30) return "Citation Legend! You're unstoppable! 👑";
  if (streak >= 20) return "Incredible dedication! Keep the fire burning! 🔥";
  if (streak >= 10) return "Double digits! You're on fire! ⭐";
  if (streak >= 5) return "Great momentum! Keep it up! 🎯";
  if (streak >= 1) return "You're building a streak! 🔥";
  return "Start your citation journey today! ⚡";
};

const getNextMilestone = (streak: number) => {
  if (streak < 5) return 5;
  if (streak < 10) return 10;
  if (streak < 20) return 20;
  if (streak < 30) return 30;
  return null;
};

export default function StreakCounter() {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <>
      <div className="fixed right-4 top-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 rounded-full p-3 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              {getStreakIcon(streakStore.streak)}
              {streakStore.streak > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {streakStore.streak}
                </div>
              )}
            </div>
            <span className="font-semibold text-orange-400 group-hover:text-orange-300 transition-colors">
              {streakStore.streak}
            </span>
          </div>
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-orange-500/20 shadow-2xl">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              Your Streak Stats
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Current Streak Display */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  {getStreakIcon(streakStore.streak)}
                  {streakStore.streak > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-bold animate-bounce">
                      {streakStore.streak}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {streakStore.streak} Day{streakStore.streak !== 1 ? 's' : ''} Streak
              </h3>
              <p className="text-gray-300 text-sm">
                {getStreakMessage(streakStore.streak)}
              </p>
            </div>

            {/* Progress to Next Milestone */}
            {nextMilestone && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Next Milestone</span>
                  <span className="text-sm font-semibold text-orange-400">{nextMilestone} days</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((streakStore.streak / nextMilestone) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {nextMilestone - streakStore.streak} more day{nextMilestone - streakStore.streak !== 1 ? 's' : ''} to go!
                </p>
              </div>
            )}

            {/* Today's Status */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-white mb-2">Today&apos;s Progress</h4>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isCompletedToday ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">
                  {isCompletedToday ? 'Completed today&apos;s citation! 🎉' : 'Citation not completed yet'}
                </span>
              </div>
            </div>

            {/* Milestone Rewards */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-white mb-3">Milestone Rewards</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300">5 days: Citation Rookie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300">10 days: Citation Star</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-300">20 days: Citation Champion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">30 days: Citation Legend</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}