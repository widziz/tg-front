import React, { useState } from "react";

const ITEMS = [
  { id: 1, name: "Golden Trophy", emoji: "🏆", rarity: "legendary", value: 500 },
  { id: 2, name: "Diamond Ring", emoji: "💍", rarity: "epic", value: 250 },
  { id: 3, name: "Rocket", emoji: "🚀", rarity: "rare", value: 100 },
  { id: 4, name: "Red Rose", emoji: "🌹", rarity: "common", value: 25 },
  { id: 5, name: "Gift Box", emoji: "🎁", rarity: "common", value: 25 },
  { id: 6, name: "Teddy Bear", emoji: "🧸", rarity: "common", value: 15 },
  { id: 7, name: "Heart", emoji: "❤️", rarity: "common", value: 15 },
  { id: 8, name: "Flowers", emoji: "💐", rarity: "rare", value: 75 },
];

const rarityColors = {
  common: "border-white/10 bg-dark-50",
  rare: "border-accent/30 bg-accent/5",
  epic: "border-purple/30 bg-purple/5",
  legendary: "border-gold/30 bg-gold/5",
};

const rarityTextColors = {
  common: "text-white/50",
  rare: "text-accent",
  epic: "text-purple",
  legendary: "text-gold",
};

export const InventoryPage = ({ user }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const totalValue = ITEMS.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex-1 px-4 pt-4 pb-28">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">🎒 Inventory</h2>
        <div className="text-white/50 text-sm">
          Total: <span className="text-gold font-bold">{totalValue}</span> 💎
        </div>
      </div>

      {ITEMS.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`
                aspect-square rounded-xl p-2 border transition-all
                flex flex-col items-center justify-center gap-1
                hover:scale-105 active:scale-95
                ${rarityColors[item.rarity]}
              `}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className={`text-[10px] font-semibold ${rarityTextColors[item.rarity]}`}>
                {item.value}💎
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-5xl mb-4">📭</span>
          <p className="text-white/40 text-center">
            No items yet. Open some cases!
          </p>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className={`
              bg-dark-50 rounded-3xl p-6 max-w-[280px] w-[85%] border
              ${rarityColors[selectedItem.rarity]}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl text-center mb-4">{selectedItem.emoji}</div>
            <h3 className="text-white font-bold text-center text-lg mb-1">
              {selectedItem.name}
            </h3>
            <p className={`text-center text-sm mb-4 ${rarityTextColors[selectedItem.rarity]}`}>
              {selectedItem.rarity.charAt(0).toUpperCase() + selectedItem.rarity.slice(1)}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-2.5 rounded-xl bg-success text-white font-bold text-sm active:scale-95 transition-all"
              >
                Sell for {selectedItem.value}💎
              </button>
            </div>
            
            <button
              onClick={() => setSelectedItem(null)}
              className="w-full mt-2 py-2.5 rounded-xl bg-white/5 text-white/50 font-semibold text-sm active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
