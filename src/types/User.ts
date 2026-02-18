export interface User {
  id: string;
  username: string; // Логин
  password: string;
  name: string;     // Отображаемое имя
  role: 'admin';
}