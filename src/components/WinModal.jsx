import React, { useEffect, useState } from "react";

export const WinModal = ({ prize, winAmount, onClose }) => {
  const [confetti, setConfetti] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 50);
    
    const colors = ["#2AABEE", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444"];
    const newConfetti = [];
    
    for (let i = 0; i < 30; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 4,
      });
    }
    setConfetti(newConfetti);

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
            animation: `confetti-fall 2s ease-out ${c.delay}s forwards`,
          }}
        />
      ))}

      {/* Modal */}
      <div 
        className={`
          relative bg-dark-50 rounded-3xl p-6 max-w-[300px] w-[85%]
          border border-white/10 shadow-2xl
          transform transition-all duration-300
          ${show ? "scale-100 translate-y-0" : "scale-90 translate-y-4"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-30 ${
          isBoost ? "bg-gold" : isJackpot ? "bg-gold" : "bg-success"
        }`} />
        
        <div className="relative z-10">
          {/* Prize image */}
          <div className="text-6xl text-center mb-3 animate-bounce">
            {prize?.image ? (
              <img src={`/assets/svg/${prize.image}`} alt="" className="w-20 h-20 mx-auto" />
            ) : "🎁"}
          </div>

          {isBoost ? (
            <>
              <h2 className="text-xl font-bold text-center text-white mb-1">
                ⚡ BOOST ACTIVATED!
              </h2>
              <p className="text-gold text-center text-sm font-semibold">
                Next win x2 multiplier
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-center text-white mb-1">
                {isJackpot ? "🎉 JACKPOT!" : "You Won!"}
              </h2>
              <div className={`text-3xl font-extrabold text-center mb-1 ${
                isJackpot ? "text-gradient-gold" : "text-success"
              }`}>
                +{winAmount?.toLocaleString()} 💎
              </div>
              <p className="text-white/40 text-center text-sm">
                x{prize?.multiplier || 1} multiplier
              </p>
            </>
          )}

          <button
            onClick={handleClose}
            className="w-full mt-5 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-accent to-accent-dark shadow-lg shadow-accent/30 active:scale-[0.98] transition-all"
          >
            COLLECT
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
