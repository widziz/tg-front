import { useState } from 'react';
import { DEPOSIT_OPTIONS } from '@/config/prizes';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  isDemo?: boolean;
}

export function DepositModal({ isOpen, onClose, onDeposit, isDemo }: DepositModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(DEPOSIT_OPTIONS[0].amount);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const selectedOption = DEPOSIT_OPTIONS.find(o => o.amount === selectedAmount);
  const bonusAmount = selectedOption ? Math.floor(selectedAmount * selectedOption.bonus / 100) : 0;
  const totalAmount = selectedAmount + bonusAmount;

  const handleDeposit = async () => {
    if (isDemo) {
      try {
        window.Telegram?.WebApp?.showAlert('Пополнение недоступно в демо режиме');
      } catch {
        alert('Пополнение недоступно в демо режиме');
      }
      return;
    }
    
    setIsLoading(true);
    try {
      await onDeposit(selectedAmount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a2e] rounded-t-3xl p-6 w-full max-w-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Пополнить баланс</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        {/* Demo warning */}
        {isDemo && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
            <p className="text-yellow-400 text-sm text-center">
              ⚠️ Пополнение недоступно в демо режиме
            </p>
          </div>
        )}

        {/* Amount options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {DEPOSIT_OPTIONS.map((option) => (
            <button
              key={option.amount}
              onClick={() => setSelectedAmount(option.amount)}
              className={`
                p-4 rounded-xl border-2 transition-all relative overflow-hidden
                ${selectedAmount === option.amount
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-[#2d2d4a] hover:border-gray-500'
                }
              `}
            >
              {option.bonus > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs 
                               px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold">
                  +{option.bonus}%
                </div>
              )}
              
              <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                {option.amount} <span className="text-xl">⭐</span>
              </div>
              
              {option.bonus > 0 && (
                <div className="text-xs text-green-400 mt-1">
                  +{Math.floor(option.amount * option.bonus / 100)} бонус
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-[#2d2d4a] rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Оплата:</span>
            <span className="text-white font-bold">{selectedAmount} ⭐</span>
          </div>
          {bonusAmount > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Бонус:</span>
              <span className="text-green-400 font-bold">+{bonusAmount} ⭐</span>
            </div>
          )}
          <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between items-center">
            <span className="text-gray-300">Итого:</span>
            <span className="text-yellow-400 font-bold text-xl">{totalAmount} ⭐</span>
          </div>
        </div>

        {/* Deposit button */}
        <button
          onClick={handleDeposit}
          disabled={isLoading || isDemo}
          className={`
            w-full py-4 rounded-xl font-bold text-lg text-white transition-all
            ${isLoading || isDemo
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 active:scale-95'
            }
          `}
        >
          {isLoading ? '⏳ Создание платежа...' : `Оплатить ${selectedAmount} ⭐`}
        </button>

        <p className="text-center text-gray-500 text-xs mt-4">
          Оплата через Telegram Stars
        </p>
      </div>
    </div>
  );
}
