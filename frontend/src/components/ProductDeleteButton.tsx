import React from 'react';
import { useDeleteProduct } from '../hooks/useApi';

export const ProductDeleteButton = ({ id }) => {
  const { mutate } = useDeleteProduct(id);

  return (
    <button 
      onClick={() => mutate()}
      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
    >
      Eliminar
    </button>
  );
};
