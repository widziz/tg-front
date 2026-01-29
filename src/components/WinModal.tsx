import { useEffect, useState } from 'react';
import type { Prize } from '@/api';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: Prize | null;
  amount: number;
  boostUsed?: boolean;
}

export function WinModal({ isOpen, onClose, prize, amount, boostUsed }: WinModalProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (isOpen && (amount > 0 || prize?.isBoost)) {
      // Генерируем конфетти
      const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d', '#ff9ff3'];
      const newConfetti = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfetti(newConfetti);

      // Haptic feedback
      try {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
      } catch {
        // Haptic not available
      }
    }
  }, [isOpen, amount, prize]);

  if (!isOpen || !prize) return null;

  const isBoostPrize = prize.isBoost;
  const isBigWin = amount >= 200;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute w-3 h-3 rounded-full pointer-events-none animate-confetti"
          style={{
            left: `${c.left}%`,
            top: '-5%',
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      {/* Modal */}
      <div 
        className="bg-gradient-to-b from-[#2d2d4a] to-[#1a1a2e] rounded-3xl p-8 max-w-sm w-full 
                   animate-bounce-in shadow-2xl border border-purple-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prize emoji */}
        <div className={`text-center mb-4 ${isBigWin ? 'animate-bounce' : ''}`}>
          <span className="text-7xl filter drop-shadow-lg">
            {prize.image}
          </span>
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold text-center mb-2 ${
          isBigWin ? 'text-yellow-400' : isBoostPrize ? 'text-purple-400' : 'text-white'
        }`}>
          {isBoostPrize ? 'BOOST!' : isBigWin ? '🎉 ДЖЕКПОТ!' : 'Выигрыш!'}
        </h2>

        {/* Amount or Boost info */}
        {isBoostPrize ? (
          <div className="text-center">
            <p className="text-purple-300 mb-2">
              Следующий выигрыш <span className="text-yellow-400 font-bold">x2</span>!
            </p>
            <div className="text-4xl animate-pulse">⚡</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-4xl font-bold text-yellow-400">
              <span>+{amount}</span>
              <span>⭐</span>
            </div>
            
            {boostUsed && (
              <div className="mt-2 text-sm text-purple-300 flex items-center justify-center gap-1">
                <span>⚡</span>
                <span>Boost использован (x2)</span>
              </div>
            )}
            
            <div className="mt-2 text-gray-400 text-sm">
              {prize.value}
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl font-bold text-white
                     bg-gradient-to-r from-purple-600 to-pink-600 
                     hover:from-purple-500 hover:to-pink-500 
                     transition-all active:scale-95"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}
