import React, { useEffect, useState } from "react";

export const WinModal = ({ prize, winAmount, onClose }) => {
  const [confetti, setConfetti] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setShow(true), 50);
    
    // Create confetti
    const colors = ["#2AABEE", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444"];
    const newConfetti = [];
    
    for (let i = 0; i < 30; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
      });
    }
    setConfetti(newConfetti);

    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    }
  }, []);

  const isBoost = prize?.type === "boost";
  const isJackpot = prize?.multiplier >= 10;

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${show ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${c.rotation}deg)`,
            animation: `confetti-fall 2s ease-out ${c.delay}s forwards`,
          }}
        />
      ))}

      {/* Modal */}
      <div 
        className={`
          relative bg-sg-surface rounded-3xl p-6 max-w-[320px] w-[90%]
          border border-sg-border shadow-2xl
          transform transition-all duration-300
          ${show ? "scale-100 translate-y-0" : "scale-90 translate-y-4"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-3xl blur-xl opacity-30 ${
          isBoost ? "bg-sg-warning" : isJackpot ? "bg-rarity-legendary" : "bg-sg-success"
        }`} />
        
        <div className="relative z-10">
          {/* Prize emoji */}
          <div className="text-7xl text-center mb-4 animate-bounce">
            {prize?.image ? (
              <img src={`/assets/svg/${prize.image}`} alt="" className="w-24 h-24 mx-auto" />
            ) : "🎁"}
          </div>

          {isBoost ? (
            <>
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                ⚡ BOOST ACTIVATED!
              </h2>
              <p className="text-sg-warning text-center font-semibold">
                Next win x2 multiplier
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                {isJackpot ? "🎉 JACKPOT! 🎉" : "You Won!"}
              </h2>
              <div className={`text-4xl font-extrabold text-center mb-2 ${
                isJackpot ? "text-gradient-gold" : "text-sg-success"
              }`}>
                +{winAmount?.toLocaleString()} 💰
              </div>
              <p className="text-sg-text-secondary text-center text-sm">
                Multiplier: x{prize?.multiplier || 1}
              </p>
            </>
          )}

          {/* Claim button */}
          <button
            onClick={handleClose}
            className="
              w-full mt-6 py-3.5 rounded-2xl font-bold text-white
              bg-gradient-to-r from-sg-accent to-sg-accent-dark
              shadow-lg shadow-sg-accent/30
              hover:shadow-sg-accent/50 active:scale-[0.98]
              transition-all duration-200
            "
          >
            COLLECT
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
