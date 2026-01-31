import React from "react";

export const TopBar = ({ user }) => {
  const getInitial = () => {
    if (user?.first_name) return user.first_name[0].toUpperCase();
    if (user?.username) return user.username[0].toUpperCase();
    return "?";
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 safe-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* User Info */}
        <div className="flex items-center gap-2">
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.username || user.first_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-sg-accent/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sg-accent to-sg-purple flex items-center justify-center text-white font-bold text-lg">
              {getInitial()}
            </div>
          )}
          <span className="text-white font-semibold text-sm truncate max-w-[100px]">
            @{user?.username || user?.first_name || "user"}
          </span>
        </div>

        {/* Balances */}
        <div className="flex items-center gap-2">
          {/* Credits */}
          <div className="flex items-center gap-1.5 h-9 px-3 rounded-full glass border border-sg-purple/30">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#8B5CF6" />
              <path d="M12 6v12M8 10l4-4 4 4M8 14l4 4 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white font-semibold text-sm">
              {user?.credits?.toLocaleString() || 0}
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 h-9 px-3 rounded-full glass border border-sg-warning/30">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#F59E0B" />
              <path
                d="M12 6l1.5 3.5L17 11l-3.5 1.5L12 16l-1.5-3.5L7 11l3.5-1.5L12 6z"
                fill="#FEF3C7"
              />
            </svg>
            <span className="text-white font-semibold text-sm">
              {user?.stars?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
