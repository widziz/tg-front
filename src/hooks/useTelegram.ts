import { useEffect, useState, useCallback } from 'react';
import type { TelegramWebApp, WebAppUser, InvoiceStatus } from '@/types/telegram';

interface UseTelegramReturn {
  webApp: TelegramWebApp | null;
  user: WebAppUser | null;
  initData: string;
  isReady: boolean;
  isInTelegram: boolean;
  colorScheme: 'light' | 'dark';
  openInvoice: (url: string) => Promise<InvoiceStatus>;
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  hapticFeedback: (type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => void;
  hapticTick: () => void;
  close: () => void;
}

export function useTelegram(): UseTelegramReturn {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Устанавливаем цвета темы
      try {
        tg.setHeaderColor('#1a1a2e');
        tg.setBackgroundColor('#1a1a2e');
      } catch (e) {
        console.log('Could not set theme colors');
      }
      
      setWebApp(tg);
    }
    
    setIsReady(true);
  }, []);

  const openInvoice = useCallback((url: string): Promise<InvoiceStatus> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.openInvoice(url, (status) => {
          resolve(status);
        });
      } else {
        console.log('Demo: Would open invoice:', url);
        resolve('cancelled');
      }
    });
  }, [webApp]);

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

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed) => resolve(confirmed));
      } else {
        resolve(confirm(message));
      }
    });
  }, [webApp]);

  const hapticFeedback = useCallback((type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => {
    if (!webApp?.HapticFeedback) return;
    
    try {
      if (['success', 'error', 'warning'].includes(type)) {
        webApp.HapticFeedback.notificationOccurred(type as 'success' | 'error' | 'warning');
      } else {
        webApp.HapticFeedback.impactOccurred(type as 'light' | 'medium' | 'heavy');
      }
    } catch (e) {
      // Haptic not available
    }
  }, [webApp]);

  const hapticTick = useCallback(() => {
    try {
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      } else if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch (e) {
      // Haptic not available
    }
  }, [webApp]);

  const close = useCallback(() => {
    webApp?.close();
  }, [webApp]);

  return {
    webApp,
    user: webApp?.initDataUnsafe?.user || null,
    initData: webApp?.initData || '',
    isReady,
    isInTelegram: !!webApp?.initData,
    colorScheme: webApp?.colorScheme || 'dark',
    openInvoice,
    showAlert,
    showConfirm,
    hapticFeedback,
    hapticTick,
    close,
  };
}
