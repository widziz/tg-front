import React from "react";

const DEPOSIT_OPTIONS = [
  { amount: 100, bonus: 0 },
  { amount: 250, bonus: 10 },
  { amount: 500, bonus: 15 },
  { amount: 1000, bonus: 20 },
];

export const DepositModal = ({ onDeposit, onClose, isLoading }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">💫 Пополнить баланс</div>

        <div className="deposit-options">
          {DEPOSIT_OPTIONS.map((option) => (
            <div
              key={option.amount}
              className="deposit-option"
              onClick={() => !isLoading && onDeposit(option.amount)}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              <div>
                <div className="deposit-amount">
                  {option.amount}{" "}
                  <svg
                    style={{ width: 20, height: 20, verticalAlign: "middle" }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" fill="#FFD700" />
                    <path
                      d="M12 6l1.5 3.5L17 11l-3.5 1.5L12 16l-1.5-3.5L7 11l3.5-1.5L12 6z"
                      fill="#FFA500"
                    />
                  </svg>
                </div>
                {option.bonus > 0 && (
                  <div className="deposit-bonus">+{option.bonus}% бонус</div>
                )}
              </div>
              <div className="deposit-total">
                = {Math.floor(option.amount * (1 + option.bonus / 100))} ⭐
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-secondary" onClick={onClose}>
          Отмена
        </button>
      </div>
    </div>
  );
};
