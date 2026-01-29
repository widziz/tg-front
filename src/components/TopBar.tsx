import type { User } from '@/api';

interface TopBarProps {
  user: User | null;
  hasBoost: boolean;
  isDemo?: boolean;
  onDeposit: () => void;
}

export function TopBar({ user, hasBoost, isDemo, onDeposit }: TopBarProps) {
  if (!user) return null;

  const displayName = user.username 
    ? `@${user.username}` 
    : user.first_name || 'Player';

  return (
    <div className="flex items-center justify-between p-4 pt-2">
      {/* User Info */}
      <div className="flex items-center gap-3">
        {user.photo_url ? (
          <img 
            src={user.photo_url} 
            alt={displayName}
            className="w-10 h-10 rounded-full border-2 border-purple-500"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
          </div>
        )}
        <div>
          <div className="text-white font-medium text-sm truncate max-w-[100px]">
            {displayName}
          </div>
          {isDemo && (
            <div className="text-xs text-yellow-400">Demo</div>
          )}
        </div>
      </div>

      {/* Balance + Boost */}
      <div className="flex items-center gap-2">
        {hasBoost && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-full px-2 py-1 flex items-center gap-1">
            <span className="text-base">⚡</span>
            <span className="text-yellow-400 text-xs font-bold">x2</span>
          </div>
        )}
        
        <button
          onClick={onDeposit}
          className="flex items-center gap-2 bg-[#2d2d4a] hover:bg-[#3d3d5a] 
                     rounded-full px-3 py-2 transition-colors"
        >
          <span className="text-lg">⭐</span>
          <span className="text-white font-bold">{user.balance.toLocaleString()}</span>
          <span className="text-green-400 text-base">+</span>
        </button>
      </div>
    </div>
  );
}
