import React from "react";
import "./SpinPanel.css";

const BET_OPTIONS = [25, 50, 100, 250];

export const SpinPanel = ({ 
  selectedBet, 
  onBetChange, 
  onSpin, 
  isSpinning, 
  balance,
  hasBoost 
}) => {
  const canAfford = (amount) => balance >= amount;
  const canSpin = canAfford(selectedBet) && !isSpinning;

  return (
    <div className="spin-panel">
      <div className="bet-options">
        {BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            className={`bet-button ${selectedBet === amount ? "active" : ""} ${
              !canAfford(amount) ? "disabled" : ""
            }`}
            onClick={() => canAfford(amount) && onBetChange(amount)}
            disabled={isSpinning}
          >
            {amount}
            <svg className="star-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#FFD700" />
              <path
                d="M12 6l1.5 3.5L17 11l-3.5 1.5L12 16l-1.5-3.5L7 11l3.5-1.5L12 6z"
                fill="#FFA500"
              />
            </svg>
          </button>
        ))}
      </div>

      <button
        className={`spin-button-main ${isSpinning ? "spinning" : ""}`}
        onClick={() => canSpin && onSpin(selectedBet)}
        disabled={!canSpin}
      >
        {isSpinning ? (
          "КРУТИТСЯ..."
        ) : (
          <>
            КРУТИТЬ
            {hasBoost && <span style={{ color: "#ff9033" }}> x2</span>}
            <span className="spin-cost">
              {selectedBet}
              <svg className="star-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#FFD700" />
                <path
                  d="M12 6l1.5 3.5L17 11l-3.5 1.5L12 16l-1.5-3.5L7 11l3.5-1.5L12 6z"
                  fill="#FFA500"
                />
              </svg>
            </span>
          </>
        )}
      </button>

      {!canAfford(selectedBet) && !isSpinning && (
        <div className="insufficient-balance">
          Недостаточно средств. Пополните баланс!
        </div>
      )}
    </div>
  );
};
