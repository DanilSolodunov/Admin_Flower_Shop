import { useState, useEffect } from 'react';
import { User } from '../../types/User';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Trash2, LogOut, MapPin, Plus, Trash, X, Lock, Eye, EyeOff } from 'lucide-react';
import { addressApi, AddressRequest } from '../../api/addressApi';
import { phoneApi } from '../../api/phoneApi';

interface SettingsFormProps {
  user: User;
  onUpdate: (data: { username: string; password: string }) => void;
  onDelete: () => void;
  onCancel: () => void;
  onLogout: () => void;
}

export function SettingsForm({ user, onUpdate, onDelete, onCancel, onLogout }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    username: user.username,
    password: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [phone, setPhone] = useState<string | null>(null);
  const [phoneForm, setPhoneForm] = useState({
    phone: '',
  });
  const [isLoadingPhone, setIsLoadingPhone] = useState(true);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [addressString, setAddressString] = useState<string | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    city: '',
    street: '',
    houseNumber: '',
  });

  useEffect(() => {
    loadAddress();
    loadPhone();
  }, []);

  const loadAddress = async () => {
    try {
      setIsLoadingAddress(true);
      const data = await addressApi.getAddress();
      setAddressString(data);
    } catch (err) {
      console.error('Ошибка при загрузке адреса:', err);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const loadPhone = async () => {
    try {
      setIsLoadingPhone(true);
      const data = await phoneApi.getPhone();
      setPhone(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPhone(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.city.trim() || !addressForm.street.trim() || !addressForm.houseNumber.trim()) return;

    try {
      const request: AddressRequest = {
        city: addressForm.city,
        street: addressForm.street,
        houseNumber: addressForm.houseNumber,
      };
      await addressApi.setAddress(request);
      setAddressString(`${addressForm.city}, ул. ${addressForm.street}, д. ${addressForm.houseNumber}`);
      setAddressForm({ city: '', street: '', houseNumber: '' });
      setShowAddressForm(false);
    } catch (err) {
      console.error('Ошибка при сохранении адреса:', err);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      await addressApi.deleteAddress();
      setAddressString(null);
    } catch (err) {
      console.error('Ошибка при удалении адреса:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Новые пароли не совпадают');
      return;
    }

    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setPasswordError('Заполните все поля');
      return;
    }

    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
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
      {/* Секция адреса */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-semibold text-slate-800">Адрес</h3>
        </div>

        {isLoadingAddress ? (
          <div className="flex items-center justify-center py-6">
            <div className="text-slate-500">Загрузка адреса...</div>
          </div>
        ) : addressString ? (
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-base text-slate-800">{addressString}</p>
            <button
              type="button"
              onClick={handleDeleteAddress}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Введите данные адреса доставки
            </p>
            <form onSubmit={handleAddressSubmit} className="space-y-3">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="city">Город</Label>
                <Input
                  id="city"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="Город/населённый пункт"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="street">Улица</Label>
                <Input
                  id="street"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="Улица"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="houseNumber">Номер дома</Label>
                <Input
                  id="houseNumber"
                  value={addressForm.houseNumber}
                  onChange={(e) => setAddressForm({ ...addressForm, houseNumber: e.target.value })}
                  placeholder="Номер дома"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Сохранить адрес
              </Button>
            </form>
          </>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Номер телефона
        </h3>

        {isLoadingPhone ? (
          <p>Загрузка...</p>
        ) : phone ? (
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
            <span>{phone}</span>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              await phoneApi.savePhone(phoneForm.phone);

              setPhone(phoneForm.phone);
              setPhoneForm({ phone: "" });
            }}
            className="space-y-3"
          >
            <Input
              value={phoneForm.phone}
              onChange={(e) =>
                setPhoneForm({
                  phone: e.target.value,
                })
              }
              placeholder="+7 (999) 123-45-67"
            />

            <Button type="submit">
              Сохранить
            </Button>
          </form>
        )}
      </div>

      {/* Смена пароля */}
      <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-slate-800" />
          <h3 className="text-lg font-semibold text-slate-800">Сменить пароль</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {passwordError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {passwordError}
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <Label htmlFor="oldPassword" className="text-sm font-semibold text-slate-800">Старый пароль</Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                placeholder="Введите старый пароль"
                // autoComplete="off"
                className="pr-10 bg-slate-100 border-slate-200 rounded-lg w-full"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-slate-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-semibold text-slate-800">Новый пароль</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Введите новый пароль"
                autoComplete="off"
                className="pr-10 border-slate-200 rounded-lg w-full"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-slate-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-800">Повторите новый пароль</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Введите новый пароль еще раз"
                autoComplete="off"
                className="pr-10 border-slate-200 rounded-lg w-full"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-slate-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold py-2"
          >
            <Lock className="w-4 h-4 mr-2" />
            Сменить пароль
          </Button>
        </form>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Выход из аккаунта</h3>
        <p className="text-sm text-slate-500 mb-4">
          Выйдите из системы, чтобы завершить сеанс.
        </p>
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Опасная зона</h3>
        <p className="text-sm text-slate-500 mb-4">
          Удаление аккаунта приведет к потере доступа к панели управления. Это действие нельзя отменить.
        </p>
        <div className="flex flex-col space-y-2">
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
    </div>
  );
}
