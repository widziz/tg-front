// API клиент для бэкенда
const API_URL = import.meta.env.VITE_API_URL || '';

interface ApiOptions {
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
  initData?: string;
}

async function apiCall<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, initData } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (initData) {
    headers['X-Telegram-Init-Data'] = initData;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

// Типы
export interface User {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  balance: number;
  has_boost: boolean;
  total_spins: number;
  total_won: number;
}

export interface AuthResponse {
  success: boolean;
  demo?: boolean;
  user: User;
}

export interface Prize {
  id: number;
  image: string;
  name: string;
  value: string;
  multiplier: number;
  isBoost?: boolean;
}

export interface SpinResponse {
  success: boolean;
  targetSlot: number;
  prize: Prize;
  bet: number;
  winAmount: number;
  boostUsed: boolean;
  newBalance: number;
  hasBoost: boolean;
}

export interface BalanceResponse {
  success: boolean;
  balance: number;
  hasBoost: boolean;
}

export interface DepositResponse {
  success: boolean;
  invoiceLink: string;
  amount: number;
  bonus: number;
  total: number;
}

export interface HistoryItem {
  id: number;
  bet: number;
  prize: Prize;
  winAmount: number;
  boostUsed: boolean;
  createdAt: string;
}

// API функции
export const api = {
  // Авторизация
  auth: (initData: string): Promise<AuthResponse> => 
    apiCall('/api/auth', { method: 'POST', body: { initData } }),

  // Баланс
  getBalance: (initData: string): Promise<BalanceResponse> => 
    apiCall('/api/balance', { initData }),

  // Спин рулетки
  spin: (initData: string, bet: number): Promise<SpinResponse> => 
    apiCall('/api/spin', { method: 'POST', body: { bet }, initData }),

  // История игр
  getHistory: (initData: string, limit = 20): Promise<{ success: boolean; history: HistoryItem[] }> => 
    apiCall(`/api/history?limit=${limit}`, { initData }),

  // Создать инвойс для депозита
  createDeposit: (initData: string, amount: number): Promise<DepositResponse> => 
    apiCall('/api/deposit', { method: 'POST', body: { amount }, initData }),

  // Health check
  health: (): Promise<{ status: string; botConfigured: boolean }> => 
    apiCall('/api/health'),
};

export default api;
