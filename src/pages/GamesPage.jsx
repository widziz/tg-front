import React from "react";

const GAMES = [
  {
    id: "coinflip",
    name: "Coin Flip",
    description: "50/50 chance to double",
    emoji: "🪙",
    color: "from-gold to-gold-dark",
    available: true,
  },
  {
    id: "dice",
    name: "Lucky Dice",
    description: "Roll and win up to 6x",
    emoji: "🎲",
    color: "from-accent to-accent-dark",
    available: true,
  },
  {
    id: "slots",
    name: "Mini Slots",
    description: "Match 3 to win big",
    emoji: "🎰",
    color: "from-purple to-purple-dark",
    available: false,
    comingSoon: true,
  },
  {
    id: "crash",
    name: "Crash",
    description: "Cash out before crash",
    emoji: "📈",
    color: "from-success to-success-dark",
    available: false,
    comingSoon: true,
  },
];

export const GamesPage = ({ user }) => {
  const handlePlayGame = (game) => {
    if (!game.available) return;
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
    }
    
    // Game logic would go here
    console.log("Playing:", game.name);
  };

  return (
    <div className="flex-1 px-4 pt-4 pb-28">
      <h2 className="text-xl font-bold text-white mb-4">🎮 Games</h2>
      
      <div className="space-y-3">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => handlePlayGame(game)}
            disabled={!game.available}
            className={`
              w-full p-4 rounded-2xl border transition-all
              flex items-center gap-4
              ${game.available 
                ? "bg-dark-50 border-white/10 hover:border-accent/30 hover:scale-[1.01] active:scale-[0.99]" 
                : "bg-dark-100 border-white/5 opacity-50 cursor-not-allowed"
              }
            `}
          >
            {/* Game icon */}
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center text-3xl
              bg-gradient-to-br ${game.color}
            `}>
              {game.emoji}
            </div>

            {/* Game info */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold">{game.name}</h3>
                {game.comingSoon && (
                  <span className="px-2 py-0.5 bg-purple/20 text-purple text-xs font-semibold rounded-full">
                    Soon
                  </span>
                )}
              </div>
              <p className="text-white/40 text-sm">{game.description}</p>
            </div>

            {/* Arrow */}
            {game.available && (
              <svg className="w-5 h-5 text-white/30" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-6 p-4 bg-dark-50 rounded-2xl border border-white/5">
        <h3 className="text-white font-bold mb-3">📊 Your Stats</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">24</div>
            <div className="text-white/40 text-xs">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">58%</div>
            <div className="text-white/40 text-xs">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">1.2k</div>
            <div className="text-white/40 text-xs">Best Win</div>
          </div>
        </div>
      </div>
    </div>
  );
};
