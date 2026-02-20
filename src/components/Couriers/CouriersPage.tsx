import { useState } from 'react';
import { CourierList } from './CourierList';

export function CouriersPage() {
  const [couriers, setCouriers] = useState([]);

  const handleAdd = () => {
    console.log('add courier');
  };

  const handleEdit = (courier: any) => {
    console.log('edit courier', courier);
  };

  const handleDelete = (id: number) => {
    console.log('delete courier', id);
  };

  return (
    <CourierList
      couriers={couriers}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
