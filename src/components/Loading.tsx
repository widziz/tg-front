export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🎰</div>
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500 mx-auto" />
        </div>
        <p className="text-gray-400 font-medium">Загрузка...</p>
      </div>
    </div>
  );
}
