import { useState } from 'react';
import { User } from '../../types/User';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table } from '../ui/table';
import { Trash2 } from 'lucide-react';

interface SettingsFormProps {
  user: User;
  onUpdate: (data: { name: string; username: string; password: string }) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function SettingsForm({ user, onUpdate, onDelete, onCancel }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    password: '', // Пустое поле означает "не менять пароль"
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Если пароль пустой, оставляем старый
    const passwordToSend = formData.password || user.password;
    onUpdate({
      name: formData.name,
      username: formData.username,
      password: passwordToSend,
    });
  };

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDelete();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Table htmlFor="name">Имя (отображаемое)</Table>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Иван Иванов"
            required
          />
        </div>

        <div className="space-y-2">
          <Table htmlFor="username">Логин</Table>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="admin"
            required
          />
        </div>

        <div className="space-y-2">
          <Table htmlFor="password">Новый пароль (оставьте пустым, чтобы не менять)</Table>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
            Сохранить изменения
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Отмена
          </Button>
        </div>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Опасная зона</h3>
        <p className="text-sm text-slate-500 mb-4">
          Удаление аккаунта приведет к потере доступа к панели управления. Это действие нельзя отменить.
        </p>
        
        {!showDeleteConfirm ? (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteClick}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Удалить аккаунт
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteClick}
              className="flex-1"
            >
              Подтвердить удаление
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelDelete}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}