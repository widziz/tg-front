import React, { useEffect, useState, useCallback } from "react";
import { TopBar } from "./components/TopBar";
import { Wheel } from "./components/Wheel";
import { DailyRewards } from "./components/DailyRewards";
import { SpinButton } from "./components/SpinButton";
import { BottomNav } from "./components/BottomNav";
import { WinModal } from "./components/WinModal";
import { CasesPage } from "./pages/CasesPage";
import { GamesPage } from "./pages/GamesPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { authWithTelegram, spin } from "./api";
import { wheelConfig } from "./utils/wheel/config";

// Demo user for testing
const DEMO_USER = {
  id: 12345,
  first_name: "Player",
  username: "player",
  photo_url: null,
  credits: 1250,
  stars: 85,
  has_boost: false,
  level: 7,
  xp: 2450,
  xpMax: 3000,
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
        tg.setHeaderColor('#0a0a0b');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#0a0a0b');
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
          ...DEMO_USER,
          ...data.user,
          credits: data.user.balance || DEMO_USER.credits,
          stars: data.user.stars || DEMO_USER.stars,
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
    if (isSpinning || !canSpinFree) return;
    
    setIsSpinning(true);

    try {
      const result = await spin(0);
      
      setTargetSlot(result.slotIndex);
      setShouldSpin(true);
      
      setWinResult({
        prize: wheelConfig.prizes[result.slotIndex] || result.prize,
        winAmount: result.winAmount,
        newBalance: result.newBalance,
        isBoost: result.isBoost,
      });
      
      setCanSpinFree(false);
      const nextSpin = new Date();
      nextSpin.setHours(nextSpin.getHours() + 24);
      setNextFreeSpinTime(nextSpin);
      
    } catch (err) {
      console.error("Spin error:", err);
      demoSpin();
    }
  }, [isSpinning, canSpinFree]);

  // Demo spin
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
    let winAmount = isBoost ? 0 : Math.floor(50 * prize.multiplier);

    setTargetSlot(slotIndex);
    setShouldSpin(true);
    
    setWinResult({
      prize,
      winAmount,
      newBalance: (user?.credits || 0) + winAmount,
      isBoost,
    });
    
    setCanSpinFree(false);
    const nextSpin = new Date();
    nextSpin.setHours(nextSpin.getHours() + 24);
    setNextFreeSpinTime(nextSpin);
  };

  // Spin complete
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

  // Claim daily
  const handleClaimDaily = () => {
    if (dailyClaimed) return;
    
    const reward = 50;
    setUser(prev => ({
      ...prev,
      credits: (prev?.credits || 0) + reward,
    }));
    setDailyClaimed(true);
    setDailyStreak(prev => prev + 1);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-dark flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-dark-50 border-t-accent animate-spin" />
        <p className="mt-4 text-white/50 font-semibold">Loading SpinGift...</p>
      </div>
    );
  }

  // Render active page
  const renderPage = () => {
    switch (activeTab) {
      case "cases":
        return <CasesPage user={user} setUser={setUser} />;
      case "games":
        return <GamesPage user={user} />;
      case "inventory":
        return <InventoryPage user={user} />;
      case "profile":
        return <ProfilePage user={user} />;
      default:
        return (
          <>
            {/* Wheel Section */}
            <div className="wheel-section">
              <Wheel
                onSpinStart={() => setIsSpinning(true)}
                onSpinEnd={handleSpinEnd}
                targetSlot={targetSlot}
                shouldSpin={shouldSpin}
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 flex flex-col px-4 pt-4 pb-28 space-y-4">
              <DailyRewards
                streak={dailyStreak}
                claimed={dailyClaimed}
                onClaim={handleClaimDaily}
              />
              
              <SpinButton
                onSpin={handleSpin}
                isSpinning={isSpinning}
                canSpinFree={canSpinFree}
                nextFreeSpinTime={nextFreeSpinTime}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-dark flex flex-col">
      {/* Top fade */}
      <div className="top-fade" />
      
      {/* Top Bar */}
      <TopBar user={user} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16">
        {renderPage()}
      </main>
      
      {/* Bottom Nav */}
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
