import { useEffect, useState, useCallback } from 'react';
import type { TelegramWebApp, WebAppUser, InvoiceStatus } from '@/types/telegram';

interface UseTelegramReturn {
  webApp: TelegramWebApp | null;
  user: WebAppUser | null;
  initData: string;
  isReady: boolean;
  isAuthenticated: boolean;
  colorScheme: 'light' | 'dark';
  openInvoice: (url: string) => Promise<InvoiceStatus>;
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  hapticFeedback: (type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => void;
  close: () => void;
}

export function useTelegram(): UseTelegramReturn {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      // Инициализация Mini App
      tg.ready();
      tg.expand();
      
      setWebApp(tg);
      setIsReady(true);

      // Применяем тему Telegram
      if (tg.themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
      }
      if (tg.themeParams.text_color) {
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
      }
    } else {
      // Для тестирования в браузере без Telegram
      setIsReady(true);
    }
  }, []);

  // Открыть инвойс для оплаты
  const openInvoice = useCallback((url: string): Promise<InvoiceStatus> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.openInvoice(url, (status) => {
          resolve(status);
        });
      } else {
        // Для тестирования
        console.log('Would open invoice:', url);
        resolve('cancelled');
      }
    });
  }, [webApp]);

  // Показать алерт
  const showAlert = useCallback((message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showAlert(message, () => resolve());
      } else {
        alert(message);
        resolve();
      }
    });
  }, [webApp]);

  // Показать подтверждение
  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed) => resolve(confirmed));
      } else {
        resolve(confirm(message));
      }
    });
  }, [webApp]);

  // Haptic feedback (вибрация)
  const hapticFeedback = useCallback((type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => {
    if (!webApp?.HapticFeedback) return;
    
    if (['success', 'error', 'warning'].includes(type)) {
      webApp.HapticFeedback.notificationOccurred(type as 'success' | 'error' | 'warning');
    } else {
      webApp.HapticFeedback.impactOccurred(type as 'light' | 'medium' | 'heavy');
    }
  }, [webApp]);

  // Закрыть Mini App
  const close = useCallback(() => {
    webApp?.close();
  }, [webApp]);

  return {
    webApp,
    user: webApp?.initDataUnsafe?.user || null,
    initData: webApp?.initData || '',
    isReady,
    isAuthenticated: !!webApp?.initDataUnsafe?.user,
    colorScheme: webApp?.colorScheme || 'light',
    openInvoice,
    showAlert,
    showConfirm,
    hapticFeedback,
    close,
  };
}
