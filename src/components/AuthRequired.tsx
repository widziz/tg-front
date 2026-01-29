export function AuthRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center space-y-6 max-w-sm">
        <div className="text-6xl">🔐</div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Требуется авторизация
          </h1>
          <p className="text-gray-500">
            Пожалуйста, откройте это приложение через Telegram для авторизации.
          </p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            💡 Откройте бота в Telegram и нажмите кнопку меню для запуска Mini App.
          </p>
        </div>
        
        <div className="text-xs text-gray-400">
          Если вы разработчик, используйте{' '}
          <a 
            href="https://core.telegram.org/bots/webapps#testing-mini-apps" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            инструменты отладки Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
