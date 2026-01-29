import type { WebAppUser } from '@/types/telegram';

interface UserCardProps {
  user: WebAppUser;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
      <div className="flex items-center gap-4">
        {/* Аватар */}
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.first_name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/20"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.first_name[0]}
          </div>
        )}

        {/* Информация */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {user.first_name} {user.last_name || ''}
          </h2>
          
          {user.username && (
            <p className="text-gray-500 truncate">@{user.username}</p>
          )}
          
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {user.is_premium && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                ⭐ Premium
              </span>
            )}
            <span className="text-xs text-gray-400">ID: {user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
