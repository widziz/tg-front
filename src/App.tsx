import { useEffect, useState, useCallback } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { api, User, Prize } from '@/api';
import { PRIZES, BET_OPTIONS, getRandomPrizeIndex } from '@/config/prizes';
import { TopBar } from '@/components/TopBar';
import { Wheel } from '@/components/Wheel';
import { BetSelector } from '@/components/BetSelector';
import { SpinButton } from '@/components/SpinButton';
import { WinModal } from '@/components/WinModal';
import { DepositModal } from '@/components/DepositModal';
import { Loading } from '@/components/Loading';

function App() {
  const { webApp, initData, isReady, isInTelegram } = useTelegram();
  
  // State
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  
  // Game state
  const [selectedBet, setSelectedBet] = useState(BET_OPTIONS[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetSlot, setTargetSlot] = useState<number | null>(null);
  const [hasBoost, setHasBoost] = useState(false);
  
  // Modals
  const [showWinModal, setShowWinModal] = useState(false);
  const [winData, setWinData] = useState<{ prize: Prize; amount: number; boostUsed: boolean } | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Авторизация
  useEffect(() => {
    const authenticate = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        
        // Если нет API URL, работаем в демо режиме
        if (!apiUrl) {
          setUser({
            id: 123456789,
            username: 'demo_user',
            first_name: 'Demo',
            balance: 500,
            has_boost: false,
            total_spins: 0,
            total_won: 0,
          });
          setIsDemo(true);
          setIsLoading(false);
          return;
        }

        const response = await api.auth(initData || '');
        setUser(response.user);
        setHasBoost(response.user.has_boost);
        setIsDemo(response.demo || false);
      } catch (err) {
        console.error('Auth error:', err);
        // Fallback to demo mode
        setUser({
          id: 123456789,
          username: 'demo_user',
          first_name: 'Demo',
          balance: 500,
          has_boost: false,
          total_spins: 0,
          total_won: 0,
        });
        setIsDemo(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (isReady) {
      authenticate();
    }
  }, [initData, isReady]);

  // Обработка спина
  const handleSpin = useCallback(async () => {
    if (!user || isSpinning) return;
    
    if (user.balance < selectedBet) {
      if (webApp) {
        webApp.showAlert('Недостаточно средств! Пополните баланс.');
      } else {
        alert('Недостаточно средств!');
      }
      setShowDepositModal(true);
      return;
    }

    setIsSpinning(true);
    setTargetSlot(null);
    
    // Haptic feedback
    try {
      webApp?.HapticFeedback?.impactOccurred('medium');
    } catch {
      // Haptic not available
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      if (isDemo || !apiUrl) {
        // Демо режим - локальная логика
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const demoSlot = getRandomPrizeIndex();
        const prize = PRIZES[demoSlot];
        const isBoost = prize.isBoost;
        
        let winAmount = 0;
        if (!isBoost && prize.multiplier > 0) {
          winAmount = Math.floor(selectedBet * prize.multiplier * (hasBoost ? 2 : 1));
        }
        
        setTargetSlot(demoSlot);
        
        // Обновляем баланс после анимации
        setTimeout(() => {
          setUser(prev => prev ? {
            ...prev,
            balance: prev.balance - selectedBet + winAmount,
            total_spins: prev.total_spins + 1,
            total_won: prev.total_won + winAmount,
          } : null);
          
          if (isBoost) {
            setHasBoost(true);
          } else if (hasBoost) {
            setHasBoost(false);
          }
          
          if (winAmount > 0 || isBoost) {
            setWinData({
              prize: {
                id: demoSlot,
                image: prize.image,
                name: prize.name,
                value: prize.value,
                multiplier: prize.multiplier,
                isBoost: prize.isBoost,
              },
              amount: winAmount,
              boostUsed: hasBoost && !isBoost,
            });
            setShowWinModal(true);
          }
          
          setIsSpinning(false);
        }, 5000);
        
      } else {
        // Реальный API
        const response = await api.spin(initData || '', selectedBet);
        
        setTargetSlot(response.targetSlot);
        
        // Обновляем после анимации
        setTimeout(() => {
          setUser(prev => prev ? {
            ...prev,
            balance: response.newBalance,
          } : null);
          setHasBoost(response.hasBoost);
          
          if (response.winAmount > 0 || response.prize.isBoost) {
            setWinData({
              prize: response.prize,
              amount: response.winAmount,
              boostUsed: response.boostUsed,
            });
            setShowWinModal(true);
          }
          
          setIsSpinning(false);
        }, 5000);
      }
    } catch (err) {
      console.error('Spin error:', err);
      setIsSpinning(false);
      if (webApp) {
        webApp.showAlert('Произошла ошибка. Попробуйте снова.');
      } else {
        alert('Произошла ошибка');
      }
    }
  }, [user, selectedBet, isSpinning, isDemo, hasBoost, initData, webApp]);

  // Обработка депозита
  const handleDeposit = useCallback(async (amount: number) => {
    if (!initData || !isInTelegram) {
      if (webApp) {
        webApp.showAlert('Пополнение доступно только в Telegram');
      } else {
        alert('Пополнение доступно только в Telegram');
      }
      return;
    }

    try {
      const response = await api.createDeposit(initData, amount);
      
      // Открываем инвойс через Telegram
      webApp?.openInvoice(response.invoiceLink, (status) => {
        if (status === 'paid') {
          // Обновляем баланс
          api.getBalance(initData).then(balanceResponse => {
            setUser(prev => prev ? {
              ...prev,
              balance: balanceResponse.balance,
            } : null);
            setHasBoost(balanceResponse.hasBoost);
          });
          
          webApp?.showAlert(`✅ Баланс пополнен на ${response.total}⭐`);
          setShowDepositModal(false);
        }
      });
    } catch (err) {
      console.error('Deposit error:', err);
      if (webApp) {
        webApp.showAlert('Ошибка создания платежа');
      } else {
        alert('Ошибка создания платежа');
      }
    }
  }, [initData, isInTelegram, webApp]);

  // Loading
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <TopBar 
        user={user}
        hasBoost={hasBoost}
        isDemo={isDemo}
        onDeposit={() => setShowDepositModal(true)}
      />

      {/* Wheel Container */}
      <div className="flex-1 relative flex items-center justify-center px-4">
        <Wheel 
          targetSlot={targetSlot}
          isSpinning={isSpinning}
        />
      </div>

      {/* Bottom Panel */}
      <div className="p-4 pb-8 space-y-4 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e] to-transparent">
        <BetSelector
          bets={BET_OPTIONS}
          selectedBet={selectedBet}
          onSelect={setSelectedBet}
          disabled={isSpinning}
          balance={user?.balance || 0}
        />
        
        <SpinButton
          onClick={handleSpin}
          disabled={isSpinning || !user || user.balance < selectedBet}
          isSpinning={isSpinning}
          bet={selectedBet}
          hasBoost={hasBoost}
        />
      </div>

      {/* Win Modal */}
      <WinModal
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        prize={winData?.prize || null}
        amount={winData?.amount || 0}
        boostUsed={winData?.boostUsed || false}
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
        isDemo={isDemo}
      />
    </div>
  );
}

export default App;
