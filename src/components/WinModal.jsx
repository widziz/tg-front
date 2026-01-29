import React, { useEffect, useState } from "react";

export const WinModal = ({ prize, winAmount, onClose }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Создаём конфетти
    const colors = ["#667eea", "#764ba2", "#4ade80", "#ffd700", "#ff6b6b"];
    const newConfetti = [];
    
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        size: Math.random() * 10 + 5,
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

  return (
    <div className="modal-overlay win-modal" onClick={onClose}>
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti"
          style={{
            left: `${c.left}%`,
            backgroundColor: c.color,
            width: c.size,
            height: c.size,
            animationDelay: `${c.delay}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="win-prize">{prize?.image || "🎁"}</div>

        {isBoost ? (
          <>
            <div className="modal-title">BOOST АКТИВИРОВАН!</div>
            <div className="win-multiplier" style={{ color: "#ff9033" }}>
              Следующий выигрыш x2
            </div>
          </>
        ) : (
          <>
            <div className="modal-title">
              {isJackpot ? "🎉 ДЖЕКПОТ! 🎉" : "ПОЗДРАВЛЯЕМ!"}
            </div>
            <div className="win-amount">+{winAmount} ⭐</div>
            <div className="win-multiplier">
              Множитель: x{prize?.multiplier || 1}
            </div>
          </>
        )}

        <button className="btn btn-primary" onClick={onClose}>
          ЗАБРАТЬ
        </button>
      </div>
    </div>
  );
};
