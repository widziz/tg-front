import React from "react";

export const ProfilePage = ({ user }) => {
  const level = user?.level || 7;
  const xp = user?.xp || 2450;
  const xpMax = user?.xpMax || 3000;
  const xpPercent = (xp / xpMax) * 100;

  return (
    <div className="flex-1 px-4 pt-4 pb-28">
      {/* Profile Header */}
      <div className="bg-dark-50 rounded-3xl p-5 border border-white/5 mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt=""
                className="w-16 h-16 rounded-full object-cover ring-2 ring-accent/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-purple flex items-center justify-center text-white font-bold text-2xl">
                {user?.first_name?.[0] || "?"}
              </div>
            )}
            {/* Level badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gold flex items-center justify-center text-dark font-bold text-xs">
              {level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg">
              {user?.first_name || "Player"}
            </h2>
            <p className="text-white/40 text-sm">
              @{user?.username || "player"}
            </p>
            
            {/* XP Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/40">Level {level}</span>
                <span className="text-accent">{xp}/{xpMax} XP</span>
              </div>
              <div className="h-2 bg-dark rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-purple rounded-full transition-all"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-dark-50 rounded-2xl p-4 border border-purple/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💎</span>
            <span className="text-white/50 text-sm">Credits</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {(user?.credits || 0).toLocaleString()}
          </div>
        </div>
        
        <div className="bg-dark-50 rounded-2xl p-4 border border-gold/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⭐</span>
            <span className="text-white/50 text-sm">Stars</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {(user?.stars || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-dark-50 rounded-2xl p-4 border border-white/5 mb-4">
        <h3 className="text-white font-bold mb-3">📊 Statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/50">Total Spins</span>
            <span className="text-white font-semibold">156</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/50">Cases Opened</span>
            <span className="text-white font-semibold">42</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/50">Best Win</span>
            <span className="text-gold font-semibold">2,500 💎</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/50">Total Won</span>
            <span className="text-success font-semibold">15,320 💎</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/50">Current Streak</span>
            <span className="text-accent font-semibold">5 days 🔥</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button className="w-full p-4 bg-dark-50 rounded-2xl border border-white/5 flex items-center justify-between hover:border-accent/30 transition-all active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <span className="text-xl">💰</span>
            <span className="text-white font-semibold">Buy Stars</span>
          </div>
          <svg className="w-5 h-5 text-white/30" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        
        <button className="w-full p-4 bg-dark-50 rounded-2xl border border-white/5 flex items-center justify-between hover:border-accent/30 transition-all active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <span className="text-xl">👥</span>
            <span className="text-white font-semibold">Invite Friends</span>
          </div>
          <svg className="w-5 h-5 text-white/30" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        
        <button className="w-full p-4 bg-dark-50 rounded-2xl border border-white/5 flex items-center justify-between hover:border-accent/30 transition-all active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <span className="text-white font-semibold">Settings</span>
          </div>
          <svg className="w-5 h-5 text-white/30" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};
