import React, { useEffect, useState, useCallback } from "react";
import { TopBar } from "./components/TopBar";
import { Wheel } from "./components/Wheel";
import { DailyRewards } from "./components/DailyRewards";
import { SpinButton } from "./components/SpinButton";
import { BottomNav } from "./components/BottomNav";
import { WinModal } from "./components/WinModal";
import { authWithTelegram, spin, getBalance } from "./api";
import { wheelConfig } from "./utils/wheel/config";

// Demo user for testing outside Telegram
const DEMO_USER = {
  id: 12345,
  first_name: "Demo",
  username: "demo_user",
  photo_url: null,
  credits: 1000,
  stars: 100,
  has_boost: false,
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("spin");
  
  // Game state
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetSlot, setTargetSlot] = useState(null);
  const [shouldSpin, setShouldSpin] = useState(false);
  const [canSpinFree, setCanSpinFree] = useState(true);
  const [nextFreeSpinTime, setNextFreeSpinTime] = useState(null);
  
  // Daily rewards
  const [dailyStreak, setDailyStreak] = useState(5);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  
  // Modals
  const [showWinModal, setShowWinModal] = useState(false);
  const [winResult, setWinResult] = useState(null);

  // Initialize Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      tg.expand();
      
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#0d0d0f');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#0d0d0f');
      }
    }

    initAuth();
  }, []);

  const initAuth = async () => {
    setIsLoading(true);
    
    try {
      const data = await authWithTelegram();
      
      if (data?.user) {
        setUser({
          ...data.user,
          credits: data.user.balance || 1000,
          stars: data.user.stars || 100,
          has_boost: data.user.has_boost || false,
        });
      } else {
        setUser(DEMO_USER);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setUser(DEMO_USER);
    }
    
    setIsLoading(false);
  };

  // Handle spin
  const handleSpin = useCallback(async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);

    try {
      const result = await spin(0); // Free spin
      
      setTargetSlot(result.slotIndex);
      setShouldSpin(true);
      
      setWinResult({
        prize: wheelConfig.prizes[result.slotIndex] || result.prize,
        winAmount: result.winAmount,
        newBalance: result.newBalance,
        isBoost: result.isBoost,
      });
      
      // Set cooldown for next free spin
      setCanSpinFree(false);
      const nextSpin = new Date();
      nextSpin.setHours(nextSpin.getHours() + 24);
      setNextFreeSpinTime(nextSpin);
      
    } catch (err) {
      console.error("Spin error:", err);
      // Demo spin
      demoSpin();
    }
  }, [isSpinning]);

  // Demo spin (without server)
  const demoSpin = () => {
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
    let winAmount = isBoost ? 0 : Math.floor(25 * prize.multiplier);

    setTargetSlot(slotIndex);
    setShouldSpin(true);
    
    setWinResult({
      prize,
      winAmount,
      newBalance: (user?.credits || 0) + winAmount,
      isBoost,
    });
    
    // Demo cooldown
    setCanSpinFree(false);
    const nextSpin = new Date();
    nextSpin.setHours(nextSpin.getHours() + 24);
    setNextFreeSpinTime(nextSpin);
  };

  // Spin animation complete
  const handleSpinEnd = useCallback((slotIndex, prize) => {
    setShouldSpin(false);
    setIsSpinning(false);
    
    if (winResult) {
      setUser(prev => ({
        ...prev,
        credits: winResult.newBalance,
        has_boost: winResult.isBoost ? true : prev?.has_boost,
      }));
      
      setShowWinModal(true);
    }
  }, [winResult]);

  // Claim daily reward
  const handleClaimDaily = () => {
    if (dailyClaimed) return;
    
    const reward = 50; // Credits reward
    setUser(prev => ({
      ...prev,
      credits: (prev?.credits || 0) + reward,
    }));
    setDailyClaimed(true);
    setDailyStreak(prev => prev + 1);
    
    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-sg-bg flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-3 border-sg-border border-t-sg-accent rounded-full animate-spin" />
        <p className="mt-4 text-sg-text-secondary text-sm">Loading SpinGift...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sg-bg flex flex-col">
      {/* Top fade overlay for wheel visibility */}
      <div className="top-fade" />
      
      {/* Top Bar */}
      <TopBar user={user} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Wheel Section */}
        <div className="relative h-[220px]">
          <Wheel
            onSpinStart={() => setIsSpinning(true)}
            onSpinEnd={handleSpinEnd}
            targetSlot={targetSlot}
            shouldSpin={shouldSpin}
          />
        </div>
        
        {/* Content below wheel */}
        <div className="flex-1 flex flex-col px-4 pb-24 space-y-4">
          {/* Daily Rewards Widget */}
          <DailyRewards
            streak={dailyStreak}
            claimed={dailyClaimed}
            onClaim={handleClaimDaily}
          />
          
          {/* Spin Button */}
          <SpinButton
            onSpin={handleSpin}
            isSpinning={isSpinning}
            canSpinFree={canSpinFree}
            nextFreeSpinTime={nextFreeSpinTime}
          />
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Win Modal */}
      {showWinModal && winResult && (
        <WinModal
          prize={winResult.prize}
          winAmount={winResult.winAmount}
          onClose={() => {
            setShowWinModal(false);
            setWinResult(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
