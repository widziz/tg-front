import React from "react";

export const TopBar = ({ user }) => {
  const getInitial = () => {
    if (user?.first_name) return user.first_name[0].toUpperCase();
    if (user?.username) return user.username[0].toUpperCase();
    return "?";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 safe-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* User Info */}
        <div className="flex items-center gap-2.5">
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt=""
              className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple flex items-center justify-center text-white font-bold text-lg">
              {getInitial()}
            </div>
          )}
          <span className="text-white font-semibold text-sm">
            @{user?.username || user?.first_name || "user"}
          </span>
        </div>

        {/* Balances */}
        <div className="flex items-center gap-2">
          {/* Credits */}
          <div className="flex items-center gap-1.5 h-9 px-3 rounded-full glass border border-purple/30">
            <div className="w-5 h-5 rounded-full bg-purple flex items-center justify-center">
              <span className="text-xs">💎</span>
            </div>
            <span className="text-white font-bold text-sm">
              {(user?.credits || 0).toLocaleString()}
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 h-9 px-3 rounded-full glass border border-gold/30">
            <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
              <span className="text-xs">⭐</span>
            </div>
            <span className="text-white font-bold text-sm">
              {(user?.stars || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
