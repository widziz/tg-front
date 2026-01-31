import React from "react";

export const DailyRewards = ({ streak = 5, claimed = false, onClaim }) => {
  const todayReward = 50;
  const tomorrowReward = 75;
  const day30Reward = "🎁 Epic Case";

  return (
    <div className="relative bg-sg-surface rounded-3xl p-4 border border-sg-border overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-sg-accent/20 rounded-full blur-[80px]" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-white font-bold text-base">Daily Rewards</h3>
        <span className="text-sg-text-secondary text-sm">Day {streak}/30</span>
      </div>

      {/* Reward Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4 relative z-10">
        {/* Today's Reward */}
        <div className={`relative rounded-2xl p-3 flex flex-col items-center transition-all ${
          claimed 
            ? "bg-sg-bg-tertiary border border-sg-border opacity-60" 
            : "bg-gradient-to-b from-sg-accent/20 to-sg-accent/5 border border-sg-accent/40 glow-blue"
        }`}>
          <div className="text-3xl mb-2">💰</div>
          <span className="text-white font-bold text-lg">+{todayReward}</span>
          
          {!claimed ? (
            <button
              onClick={onClaim}
              className="mt-2 w-full py-1.5 bg-sg-success hover:bg-sg-success/90 text-white text-xs font-bold rounded-xl transition-all active:scale-95"
            >
              Claim
            </button>
          ) : (
            <div className="mt-2 w-full py-1.5 bg-sg-bg text-sg-text-secondary text-xs font-semibold rounded-xl text-center">
              Claimed ✓
            </div>
          )}
        </div>

        {/* Tomorrow's Reward */}
        <div className="relative rounded-2xl p-3 flex flex-col items-center bg-sg-bg-tertiary border border-sg-border opacity-60">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl">🔒</div>
          </div>
          <div className="text-3xl mb-2 opacity-30">💎</div>
          <span className="text-white/30 font-bold text-lg">+{tomorrowReward}</span>
          <div className="mt-2 w-full py-1.5 bg-sg-bg/50 text-sg-text-muted text-xs font-semibold rounded-xl text-center">
            In 23:59
          </div>
        </div>

        {/* Day 30 Reward */}
        <div className="relative rounded-2xl p-3 flex flex-col items-center bg-gradient-to-b from-rarity-legendary/10 to-transparent border border-rarity-legendary/30">
          <div className="text-3xl mb-2">📦</div>
          <span className="text-rarity-legendary font-bold text-xs text-center">Epic Case</span>
          <div className="mt-2 w-full py-1.5 bg-sg-bg/50 text-sg-text-secondary text-xs font-semibold rounded-xl text-center">
            Day 30
          </div>
          
          {/* Progress indicator */}
          <div className="absolute -bottom-1 left-2 right-2 h-1 bg-sg-bg rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sg-accent to-sg-purple rounded-full transition-all"
              style={{ width: `${(streak / 30) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streak Warning */}
      <div className="flex items-center justify-center gap-1.5 text-sg-text-secondary text-xs relative z-10">
        <span>🔥</span>
        <span>Streak active</span>
        <span className="text-sg-text-muted">•</span>
        <span className="text-sg-warning">Miss = reset</span>
      </div>
    </div>
  );
};
