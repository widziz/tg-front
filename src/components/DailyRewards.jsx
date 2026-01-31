import React from "react";

export const DailyRewards = ({ streak = 5, claimed = false, onClaim }) => {
  return (
    <div className="relative bg-dark-50 rounded-3xl p-4 border border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-accent/15 rounded-full blur-[60px]" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <h3 className="text-white font-bold">Daily Rewards</h3>
        <span className="text-white/40 text-sm font-medium">Day {streak}/30</span>
      </div>

      {/* Reward Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-3 relative z-10">
        {/* Today */}
        <div className={`relative rounded-2xl p-3 flex flex-col items-center transition-all ${
          claimed 
            ? "bg-dark-100 border border-white/5 opacity-50" 
            : "bg-accent/10 border border-accent/30 glow-accent"
        }`}>
          <span className="text-3xl mb-1">💰</span>
          <span className="text-white font-bold text-sm">+50</span>
          
          {!claimed ? (
            <button
              onClick={onClaim}
              className="mt-2 w-full py-1.5 bg-success hover:bg-success-dark text-white text-xs font-bold rounded-xl transition-all active:scale-95"
            >
              Claim
            </button>
          ) : (
            <div className="mt-2 w-full py-1.5 bg-dark text-white/40 text-xs font-semibold rounded-xl text-center">
              ✓ Done
            </div>
          )}
        </div>

        {/* Tomorrow */}
        <div className="relative rounded-2xl p-3 flex flex-col items-center bg-dark-100 border border-white/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl opacity-50">🔒</span>
          </div>
          <span className="text-3xl mb-1 opacity-20">💎</span>
          <span className="text-white/20 font-bold text-sm">+75</span>
          <div className="mt-2 w-full py-1.5 bg-dark/50 text-white/30 text-xs font-semibold rounded-xl text-center">
            23:59
          </div>
        </div>

        {/* Day 30 */}
        <div className="relative rounded-2xl p-3 flex flex-col items-center bg-gold/5 border border-gold/20">
          <span className="text-3xl mb-1">📦</span>
          <span className="text-gold text-xs font-bold text-center">Epic Case</span>
          <div className="mt-2 w-full py-1.5 bg-dark/50 text-white/40 text-xs font-semibold rounded-xl text-center">
            Day 30
          </div>
          
          {/* Progress bar */}
          <div className="absolute -bottom-0.5 left-2 right-2 h-1 bg-dark rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-purple rounded-full"
              style={{ width: `${(streak / 30) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streak info */}
      <div className="flex items-center justify-center gap-1.5 text-white/40 text-xs relative z-10">
        <span>🔥</span>
        <span>Streak active</span>
        <span className="text-white/20">•</span>
        <span className="text-gold/70">Miss = reset</span>
      </div>
    </div>
  );
};
