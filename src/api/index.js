const API_URL = import.meta.env.VITE_API_URL || "";

// Получить initData из Telegram
const getInitData = () => {
  return window.Telegram?.WebApp?.initData || "";
};

// Авторизация
export async function authWithTelegram() {
  const initData = getInitData();
  
  if (!initData) {
    console.warn("initData пустая — демо режим");
    return null;
  }

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

    return await response.json();
  } catch (err) {
    console.error("Ошибка соединения с API:", err);
    return null;
  }
}

// Крутить рулетку
export async function spin(betAmount) {
  const initData = getInitData();
  
  try {
    const response = await fetch(`${API_URL}/api/spin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        initData,
        betAmount 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка при вращении");
    }

    return await response.json();
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("Ошибка получения баланса:", err);
    return null;
  }
}

// Создать инвойс для пополнения
export async function createDeposit(amount) {
  const initData = getInitData();
  
  try {
    const response = await fetch(`${API_URL}/api/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        initData,
        amount 
      }),
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
export async function getHistory() {
  const initData = getInitData();
  
  try {
    const response = await fetch(`${API_URL}/api/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      return { games: [] };
    }

    return await response.json();
  } catch (err) {
    console.error("Ошибка получения истории:", err);
    return { games: [] };
  }
}
