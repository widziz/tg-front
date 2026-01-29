interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  emoji: string;
  loading?: boolean;
  purchased?: boolean;
  onBuy: () => void;
}

export function ProductCard({ 
  title, 
  description, 
  price, 
  emoji, 
  loading, 
  purchased,
  onBuy 
}: ProductCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-lg border transition-all ${
      purchased ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:shadow-xl'
    }`}>
      <div className="flex items-start gap-4">
        {/* Emoji иконка */}
        <div className="text-4xl flex-shrink-0">{emoji}</div>
        
        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {purchased && (
              <span className="text-green-500">✓</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          
          {/* Цена и кнопка */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <span className="text-xl">⭐</span>
              <span className="text-lg font-bold text-gray-900">{price}</span>
              <span className="text-gray-500 text-sm">Stars</span>
            </div>
            
            <button
              onClick={onBuy}
              disabled={loading || purchased}
              className={`px-4 py-2 font-medium rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed ${
                purchased
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white disabled:opacity-50'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="none" 
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                    />
                  </svg>
                  Загрузка...
                </span>
              ) : purchased ? (
                'Куплено'
              ) : (
                'Купить'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
