import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProduct, getCustomers, getCustomerTransactions, getProducts } from '../services/api';


// Customers 
export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers
  });
};

export const useCustomersTransactions = () => {
    return useQuery({
        queryKey: ["customers-transactions"],
        queryFn: getCustomerTransactions
    });
};


// TODO: Transactions 

// Products

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    });
};

export const useDeleteProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["products"],
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["products"]})
    }
  })
}

// TODO: Events