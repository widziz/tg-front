import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { createInvoice } from '@/api';
import { UserCard } from '@/components/UserCard';
import { ProductCard } from '@/components/ProductCard';
import { AuthRequired } from '@/components/AuthRequired';
import { Loading } from '@/components/Loading';

// Продукты для продажи
const PRODUCTS = [
  {
    id: 'premium_week',
    title: 'Premium на неделю',
    description: 'Доступ ко всем премиум функциям на 7 дней',
    price: 50,
    emoji: '🚀',
  },
  {
    id: 'premium_month',
    title: 'Premium на месяц',
    description: 'Полный доступ ко всем функциям на 30 дней',
    price: 150,
    emoji: '💎',
  },
  {
    id: 'coins_100',
    title: '100 монет',
    description: 'Виртуальная валюта для покупок в приложении',
    price: 25,
    emoji: '🪙',
  },
  {
    id: 'special_badge',
    title: 'Особый значок',
    description: 'Эксклюзивный значок для вашего профиля',
    price: 100,
    emoji: '🏆',
  },
];

export default function App() {
  const { 
    user, 
    initData, 
    isReady, 
    isAuthenticated, 
    openInvoice, 
    showAlert, 
    hapticFeedback 
  } = useTelegram();
  
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<string[]>([]);

  // Показываем загрузку пока Telegram WebApp инициализируется
  if (!isReady) {
    return <Loading />;
  }

  // Показываем экран авторизации если не открыто из Telegram
  if (!isAuthenticated) {
    return <AuthRequired />;
  }

  // Обработка покупки
  const handleBuy = async (product: typeof PRODUCTS[0]) => {
    setLoadingProduct(product.id);
    hapticFeedback('medium');

    try {
      // Создаём инвойс через backend
      const response = await createInvoice(
        initData,
        product.id,
        product.title,
        product.description,
        product.price
      );

      if (!response.invoiceLink) {
        throw new Error('No invoice link received');
      }

      // Открываем инвойс в Telegram
      const status = await openInvoice(response.invoiceLink);

      if (status === 'paid') {
        hapticFeedback('success');
        setPurchases(prev => [...prev, product.id]);
        await showAlert(`🎉 Спасибо за покупку!\n\n${product.title} успешно активирован!`);
      } else if (status === 'cancelled') {
        hapticFeedback('warning');
      } else if (status === 'failed') {
        hapticFeedback('error');
        await showAlert('❌ Ошибка оплаты. Попробуйте ещё раз.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      hapticFeedback('error');
      
      // Демо режим для тестирования
      await showAlert(
        '📌 Демо режим\n\n' +
        'Для работы оплаты нужно:\n' +
        '1. Задеплоить backend\n' +
        '2. Указать VITE_API_URL\n' +
        '3. Настроить BOT_TOKEN\n\n' +
        'См. README.md для инструкций.'
      );
    } finally {
      setLoadingProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 pb-24">
      <div className="max-w-lg mx-auto space-y-6">
        
        {/* Заголовок */}
        <div className="text-center pt-4 pb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            ⭐ Stars Shop
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Покупайте премиум функции за Telegram Stars
          </p>
        </div>

        {/* Карточка пользователя */}
        {user && <UserCard user={user} />}

        {/* Покупки */}
        {purchases.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-semibold text-green-800 flex items-center gap-2">
              ✅ Ваши покупки
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {purchases.map((id, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {PRODUCTS.find(p => p.id === id)?.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Список продуктов */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 px-1">
            Доступные товары
          </h2>
          
          {PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              emoji={product.emoji}
              loading={loadingProduct === product.id}
              purchased={purchases.includes(product.id)}
              onBuy={() => handleBuy(product)}
            />
          ))}
        </div>

        {/* Информационный блок */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 flex items-center gap-2">
            💡 Как это работает
          </h3>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• Оплата происходит в Telegram Stars</li>
            <li>• Stars - цифровая валюта Telegram</li>
            <li>• Безопасные платежи через Telegram</li>
            <li>• Мгновенная доставка после оплаты</li>
          </ul>
        </div>

        {/* Debug информация (удалите в продакшене) */}
        <details className="bg-gray-100 rounded-xl p-4 text-xs">
          <summary className="font-medium text-gray-600 cursor-pointer">
            🔧 Debug Info
          </summary>
          <pre className="mt-2 overflow-auto text-gray-500 whitespace-pre-wrap break-all">
            {JSON.stringify(
              {
                user_id: user?.id,
                username: user?.username,
                is_premium: user?.is_premium,
                initData_length: initData.length,
                api_url: import.meta.env.VITE_API_URL || 'not set',
              },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    </div>
  );
}
