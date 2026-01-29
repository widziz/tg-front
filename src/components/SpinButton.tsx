interface SpinButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isSpinning?: boolean;
  bet: number;
  hasBoost?: boolean;
}

export function SpinButton({ onClick, disabled, isSpinning, bet, hasBoost }: SpinButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 rounded-2xl font-bold text-lg text-white
        transition-all duration-300 relative overflow-hidden
        ${disabled
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-[0.98]'
        }
        ${isSpinning ? 'animate-pulse' : ''}
      `}
    >
      {/* Boost indicator */}
      {hasBoost && !isSpinning && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl animate-bounce">
          ⚡
        </span>
      )}
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isSpinning ? (
          <>
            <span className="animate-spin">🎰</span>
            КРУТИТСЯ...
          </>
        ) : (
          <>
            КРУТИТЬ за {bet} ⭐
            {hasBoost && <span className="text-yellow-300 ml-1">(x2)</span>}
          </>
        )}
      </span>
    </button>
  );
}
