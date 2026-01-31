import React, { useState } from "react";

const CASES = [
  { id: 1, name: "Starter", price: 50, currency: "credits", rarity: "common", emoji: "📦", items: 5 },
  { id: 2, name: "Bronze Box", price: 100, currency: "credits", rarity: "common", emoji: "🥉", items: 8 },
  { id: 3, name: "Silver Case", price: 250, currency: "credits", rarity: "rare", emoji: "🥈", items: 10 },
  { id: 4, name: "Gold Chest", price: 500, currency: "credits", rarity: "rare", emoji: "🥇", items: 12 },
  { id: 5, name: "Diamond Box", price: 50, currency: "stars", rarity: "epic", emoji: "💎", items: 15 },
  { id: 6, name: "Legendary Vault", price: 100, currency: "stars", rarity: "legendary", emoji: "👑", items: 20 },
];

const rarityColors = {
  common: "border-white/20 bg-dark-50",
  rare: "border-accent/30 bg-accent/5",
  epic: "border-purple/30 bg-purple/5",
  legendary: "border-gold/30 bg-gold/5",
};

const rarityGlow = {
  common: "",
  rare: "glow-accent",
  epic: "glow-purple",
  legendary: "glow-gold",
};

export const CasesPage = ({ user, setUser }) => {
  const [opening, setOpening] = useState(null);

  const handleOpenCase = (caseItem) => {
    const canAfford = caseItem.currency === "credits" 
      ? user.credits >= caseItem.price 
      : user.stars >= caseItem.price;

    if (!canAfford) {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
      }
      return;
    }

    setOpening(caseItem.id);

    // Deduct cost
    if (caseItem.currency === "credits") {
      setUser(prev => ({ ...prev, credits: prev.credits - caseItem.price }));
    } else {
      setUser(prev => ({ ...prev, stars: prev.stars - caseItem.price }));
    }

    // Simulate opening
    setTimeout(() => {
      const reward = Math.floor(caseItem.price * (0.5 + Math.random() * 1.5));
      setUser(prev => ({ ...prev, credits: prev.credits + reward }));
      setOpening(null);
      
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
      }
    }, 1500);
  };

  return (
    <div className="flex-1 px-4 pt-4 pb-28">
      <h2 className="text-xl font-bold text-white mb-4">🎁 Cases</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {CASES.map((caseItem) => {
          const canAfford = caseItem.currency === "credits" 
            ? user?.credits >= caseItem.price 
            : user?.stars >= caseItem.price;
          const isOpening = opening === caseItem.id;

          return (
            <div
              key={caseItem.id}
              className={`
                relative rounded-2xl p-4 border transition-all
                ${rarityColors[caseItem.rarity]}
                ${canAfford ? rarityGlow[caseItem.rarity] : "opacity-60"}
                ${isOpening ? "animate-pulse scale-105" : ""}
              `}
            >
              {/* Case image */}
              <div className="text-5xl text-center mb-2">
                {caseItem.emoji}
              </div>

              {/* Name */}
              <h3 className="text-white font-bold text-center text-sm mb-1">
                {caseItem.name}
              </h3>

              {/* Items count */}
              <p className="text-white/40 text-center text-xs mb-3">
                {caseItem.items} items inside
              </p>

              {/* Open button */}
              <button
                onClick={() => handleOpenCase(caseItem)}
                disabled={!canAfford || isOpening}
                className={`
                  w-full py-2 rounded-xl font-bold text-sm
                  flex items-center justify-center gap-1.5
                  transition-all
                  ${canAfford && !isOpening
                    ? "bg-accent hover:bg-accent-dark text-white active:scale-95" 
                    : "bg-dark text-white/30 cursor-not-allowed"
                  }
                `}
              >
                {isOpening ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{caseItem.price}</span>
                    <span>{caseItem.currency === "credits" ? "💎" : "⭐"}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
