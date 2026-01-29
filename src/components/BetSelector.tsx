interface BetSelectorProps {
  bets: number[];
  selectedBet: number;
  onSelect: (bet: number) => void;
  disabled?: boolean;
  balance: number;
}

export function BetSelector({ bets, selectedBet, onSelect, disabled, balance }: BetSelectorProps) {
  return (
    <div className="flex justify-center gap-2">
      {bets.map((bet) => {
        const isSelected = bet === selectedBet;
        const canAfford = balance >= bet;
        
        return (
          <button
            key={bet}
            onClick={() => onSelect(bet)}
            disabled={disabled || !canAfford}
            className={`
              px-4 py-2 rounded-xl font-bold text-sm transition-all
              ${isSelected 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-lg shadow-purple-500/30' 
                : canAfford
                  ? 'bg-[#2d2d4a] text-white hover:bg-[#3d3d5a]'
                  : 'bg-[#1d1d3a] text-gray-500 cursor-not-allowed'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {bet} ⭐
          </button>
        );
      })}
    </div>
  );
}
