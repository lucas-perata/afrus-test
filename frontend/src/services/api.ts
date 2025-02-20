import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  documentId: string;
  documentType: string;
  transactions: Transaction[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  paidPrice: number;
  tax: number;
  transactionDate: string;
  relatedEventId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

interface CustomerTransaction {
  firstName: string;
  lastName: string;
  id: string;
  transactionid: string;
  documentId: string;
  paidPrice: string;
  transactionDate: string;
  relatedEventId: string;
}

export const getCustomers = async () => {
  const { data } = await api.get<Customer[]>('/customers');
  return data;
};

export const getCustomerTransactions = async () => {
  const { data } = await api.get<CustomerTransaction[]>('/customers/transactions');
  return data;
};

export const getProducts = async () => {
  const { data } = await api.get<Product[]>('/products');
  return data;
};

export const createProduct = async (product: Omit<Product, 'id'>) => {
  const { data } = await api.post<Product>('/products', product);
  return data;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/products/${id}`);
};

export default api;