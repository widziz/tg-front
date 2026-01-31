import React, { useState, useEffect } from "react";

export const SpinButton = ({ onSpin, isSpinning, canSpinFree, nextFreeSpinTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (canSpinFree || !nextFreeSpinTime) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diff = nextFreeSpinTime - now;
      
      if (diff <= 0) {
        setTimeLeft("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [canSpinFree, nextFreeSpinTime]);

  const isDisabled = isSpinning || (!canSpinFree && timeLeft);

  return (
    <button
      onClick={onSpin}
      disabled={isDisabled}
      className={`
        relative w-full py-4 px-6 rounded-2xl font-bold text-lg
        flex items-center justify-center gap-3
        transition-all duration-200
        ${isDisabled 
          ? "bg-dark-50 text-white/40 cursor-not-allowed" 
          : "bg-gradient-to-r from-accent to-accent-dark text-white shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-[1.02] active:scale-[0.98]"
        }
      `}
    >
      {isSpinning ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Spinning...</span>
        </>
      ) : canSpinFree ? (
        <>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          <span>Spin for Free</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 opacity-50" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Next spin in {timeLeft}</span>
        </>
      )}
    </button>
  );
};
