import { Avatar, AvatarFallback } from '../ui/avatar';

interface HeaderProps {
  username: string;
  onOpenSettings: () => void;
}

export function Header({ username, onOpenSettings }: HeaderProps) {
  // Получаем первую букву для аватара
  const initial = username ? username.charAt(0).toUpperCase() : 'A';

  return (
    <header className="bg-gray-900 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h2 className="text-white font-semibold text-slate-700">
          Панель администратора
        </h2>
      </div>

      <div className="flex items-center">
        {/* Кликабельная область профиля */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white group-hover:text-blue-600 transition-colors">
              {username}
            </p>
            <p className="text-xs text-slate-500">Администратор</p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-slate-100 group-hover:border-blue-200 transition-colors">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}