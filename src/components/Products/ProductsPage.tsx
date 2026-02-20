import { useState } from 'react';
import { ProductTable } from './ProductTable';

export function ProductsPage() {
  const [products, setProducts] = useState([]);

  const handleEdit = (product: any) => {
    console.log('edit', product);
  };

  const handleDelete = (id: number) => {
    console.log('delete', id);
  };

  return (
    <ProductTable
      products={products}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
