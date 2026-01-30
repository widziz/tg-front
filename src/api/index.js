const API_URL = import.meta.env.VITE_API_URL || "";

// Получить initData из Telegram
const getInitData = () => {
  return window.Telegram?.WebApp?.initData || "";
};

// Базовый fetch с авторизацией
async function apiRequest(endpoint, options = {}) {
  const initData = getInitData();
  
  const headers = {
    "Content-Type": "application/json",
    ...(initData && { "X-Telegram-Init-Data": initData }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

// Авторизация
export async function authWithTelegram() {
  const initData = getInitData();
  
  console.log("🔐 Авторизация, initData:", initData ? "есть" : "нет");

  try {
    const response = await fetch(`${API_URL}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      console.error("Ошибка авторизации:", response.status);
      return null;
    }

    const data = await response.json();
    console.log("✅ Авторизация успешна:", data);
    return data;
  } catch (err) {
    console.error("Ошибка соединения с API:", err);
    return null;
  }
}

// Крутить рулетку
export async function spin(betAmount) {
  const initData = getInitData();
  
  console.log("🎰 Spin запрос, ставка:", betAmount);

  try {
    const response = await fetch(`${API_URL}/api/spin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData,
      },
      body: JSON.stringify({ bet: betAmount }), // Бекенд ожидает "bet", не "betAmount"
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Spin ошибка:", error);
      throw new Error(error.error || "Ошибка при вращении");
    }

    const data = await response.json();
    console.log("✅ Spin успех:", data);
    
    // Преобразуем ответ для фронтенда
    return {
      slotIndex: data.targetSlot,
      winAmount: data.winAmount,
      newBalance: data.newBalance,
      hasBoost: data.hasBoost,
      isBoost: data.prize?.isBoost || false,
      prize: data.prize,
    };
  } catch (err) {
    console.error("Ошибка spin:", err);
    throw err;
  }
}

// Получить баланс
export async function getBalance() {
  const initData = getInitData();
  
  try {
    const response = await fetch(`${API_URL}/api/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      balance: data.balance,
      has_boost: data.hasBoost,
    };
  } catch (err) {
    console.error("Ошибка получения баланса:", err);
    return null;
  }
}

// Создать инвойс для пополнения
export async function createDeposit(amount) {
  const initData = getInitData();
  
  try {
    const response = await fetch(`${API_URL}/api/deposit/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData,
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка создания инвойса");
    }

    return await response.json();
  } catch (err) {
    console.error("Ошибка deposit:", err);
    throw err;
  }
}

// Получить историю игр
export async function getHistory(limit = 20) {
  const initData = getInitData();
  
  try {
    const response = await fetch(`${API_URL}/api/history?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData,
      },
    });

    if (!response.ok) {
      return { history: [] };
    }

    return await response.json();
  } catch (err) {
    console.error("Ошибка получения истории:", err);
    return { history: [] };
  }
}
