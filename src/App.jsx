import React, { useEffect, useState, useCallback } from "react";
import { TopBar } from "./components/TopBar";
import { Wheel } from "./components/Wheel";
import { SpinPanel } from "./components/SpinPanel";
import { WinModal } from "./components/WinModal";
import { DepositModal } from "./components/DepositModal";
import { authWithTelegram, spin, createDeposit, getBalance } from "./api";
import { wheelConfig } from "./utils/wheel/config";
import "./App.css";

// Демо пользователь для тестирования вне Telegram
const DEMO_USER = {
  id: 12345,
  first_name: "Demo",
  username: "demo_user",
  photo_url: null,
  balance: 500,
  has_boost: false,
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Игровое состояние
  const [selectedBet, setSelectedBet] = useState(25);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetSlot, setTargetSlot] = useState(null);
  const [shouldSpin, setShouldSpin] = useState(false);
  
  // Модалки
  const [showWinModal, setShowWinModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [winResult, setWinResult] = useState(null);

  // Инициализация Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Настройка темы Telegram
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#17212b');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#17212b');
      }
    }

    // Авторизация
    initAuth();
  }, []);

  const initAuth = async () => {
    setIsLoading(true);
    
    try {
      const data = await authWithTelegram();
      
      if (data?.user) {
        setUser({
          ...data.user,
          balance: data.balance || data.user.balance || 0,
          has_boost: data.has_boost || data.user.has_boost || false,
        });
      } else {
        // Демо режим
        console.log("Запуск в демо режиме");
        setUser(DEMO_USER);
      }
    } catch (err) {
      console.error("Ошибка авторизации:", err);
      setUser(DEMO_USER);
    }
    
    setIsLoading(false);
  };

  // Обновить баланс
  const refreshBalance = async () => {
    try {
      const data = await getBalance();
      if (data) {
        setUser(prev => ({
          ...prev,
          balance: data.balance,
          has_boost: data.has_boost,
        }));
      }
    } catch (err) {
      console.error("Ошибка обновления баланса:", err);
    }
  };

  // Крутить рулетку
  const handleSpin = useCallback(async (betAmount) => {
    if (isSpinning || user.balance < betAmount) return;
    
    setIsSpinning(true);
    
    // Снимаем ставку сразу визуально
    setUser(prev => ({
      ...prev,
      balance: prev.balance - betAmount,
    }));

    try {
      // Запрос к серверу
      const result = await spin(betAmount);
      
      console.log("📦 Результат spin:", result);
      
      // Устанавливаем целевой слот и запускаем анимацию
      const slotIndex = result.slotIndex;
      setTargetSlot(slotIndex);
      setShouldSpin(true);
      
      // Сохраняем результат для показа после анимации
      setWinResult({
        prize: wheelConfig.prizes[slotIndex] || result.prize,
        winAmount: result.winAmount,
        newBalance: result.newBalance,
        hasBoost: result.hasBoost,
        isBoost: result.isBoost || wheelConfig.prizes[slotIndex]?.type === 'boost',
      });
      
    } catch (err) {
      console.error("Ошибка spin:", err);
      
      // Возвращаем ставку если ошибка
      setUser(prev => ({
        ...prev,
        balance: prev.balance + betAmount,
      }));
      
      // Демо спин если нет сервера
      if (err.message?.includes("fetch") || err.message?.includes("Failed")) {
        demoSpin(betAmount);
      } else {
        setIsSpinning(false);
        alert(err.message || "Ошибка при вращении");
      }
    }
  }, [isSpinning, user?.balance]);

  // Демо спин (без сервера)
  const demoSpin = (betAmount) => {
    // Выбираем случайный слот на основе шансов
    const prizes = wheelConfig.prizes;
    const totalChance = prizes.reduce((sum, p) => sum + p.chance, 0);
    let random = Math.random() * totalChance;
    let slotIndex = 0;
    
    for (let i = 0; i < prizes.length; i++) {
      random -= prizes[i].chance;
      if (random <= 0) {
        slotIndex = i;
        break;
      }
    }

    const prize = prizes[slotIndex];
    const isBoost = prize.type === "boost";
    let winAmount = 0;
    
    if (!isBoost) {
      winAmount = Math.floor(betAmount * prize.multiplier);
      if (user.has_boost) {
        winAmount *= 2;
      }
    }

    setTargetSlot(slotIndex);
    setShouldSpin(true);
    
    setWinResult({
      prize,
      winAmount,
      newBalance: user.balance + winAmount,
      hasBoost: isBoost || user.has_boost,
      isBoost,
    });
  };

  // Когда анимация завершена
  const handleSpinEnd = useCallback((slotIndex, prize) => {
    setShouldSpin(false);
    setIsSpinning(false);
    
    if (winResult) {
      // Обновляем баланс
      setUser(prev => ({
        ...prev,
        balance: winResult.newBalance,
        has_boost: winResult.isBoost ? true : (winResult.hasBoost ? false : prev.has_boost),
      }));
      
      // Показываем модалку
      setShowWinModal(true);
    }
  }, [winResult]);

  // Пополнение баланса
  const handleDeposit = async (amount) => {
    try {
      const result = await createDeposit(amount);
      
      if (result.invoiceLink) {
        // Открываем инвойс в Telegram
        const tg = window.Telegram?.WebApp;
        if (tg?.openInvoice) {
          tg.openInvoice(result.invoiceLink, (status) => {
            if (status === "paid") {
              refreshBalance();
              setShowDepositModal(false);
              
              if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred("success");
              }
            }
          });
        } else {
          window.open(result.invoiceLink, "_blank");
        }
      }
    } catch (err) {
      console.error("Ошибка пополнения:", err);
      
      // Демо пополнение
      setUser(prev => ({
        ...prev,
        balance: prev.balance + amount,
      }));
      setShowDepositModal(false);
    }
  };

  // Закрыть модалку выигрыша
  const handleCloseWinModal = () => {
    setShowWinModal(false);
    setWinResult(null);
  };

  // Загрузка
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className="error-screen">
        <div className="error-icon">⚠️</div>
        <div className="error-title">Ошибка</div>
        <div className="error-message">{error}</div>
        <button className="btn btn-primary" onClick={initAuth}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {user && (
        <TopBar 
          user={user} 
          onBalanceClick={() => setShowDepositModal(true)} 
        />
      )}
      
      {user?.has_boost && !isSpinning && (
        <div className="boost-indicator">
          ⚡ BOOST x2 активен!
        </div>
      )}

      <Wheel
        onSpinStart={() => setIsSpinning(true)}
        onSpinEnd={handleSpinEnd}
        targetSlot={targetSlot}
        shouldSpin={shouldSpin}
      />

      <div className="bottom-panel">
        <SpinPanel
          selectedBet={selectedBet}
          onBetChange={setSelectedBet}
          onSpin={handleSpin}
          isSpinning={isSpinning}
          balance={user?.balance || 0}
          hasBoost={user?.has_boost || false}
        />
      </div>

      {showWinModal && winResult && (
        <WinModal
          prize={winResult.prize}
          winAmount={winResult.winAmount}
          onClose={handleCloseWinModal}
        />
      )}

      {showDepositModal && (
        <DepositModal
          onDeposit={handleDeposit}
          onClose={() => setShowDepositModal(false)}
        />
      )}
    </div>
  );
}

export default App;
