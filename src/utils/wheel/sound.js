// src/utils/wheel/sound.js
export const wheelAudio = {
  triggerFeedback() {
    try {
      const tg = window.Telegram?.WebApp;
      const hasHaptics = tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === "function";

      if (hasHaptics) {
        tg.HapticFeedback.impactOccurred("medium");
        return;
      }

      if ("vibrate" in navigator) {
        navigator.vibrate(30);
        return;
      }
    } catch (err) {
      console.error("Ошибка при вибрации:", err);
    }
  }
};
