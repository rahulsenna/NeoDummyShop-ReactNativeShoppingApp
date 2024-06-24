import axios from 'axios';
import { Product } from '@/src/types/Product';

axios.defaults.baseURL = 'https://dummyjson.com/';

interface AuthResponse {
  token: string;
}

interface ItemsResponse {
  products: Product[];
  total: number
}

export const register = async (userid: string, password: string): Promise<void> => {
  await axios.post(`users/register`, { userid, password });
};

export const login = async (userid: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`users/login`, { userid, password });
  return response.data;
};

export const updateUser = async (name: string, age: number): Promise<void> => { 
  await axios.put(`users/update`, { name, age });
};

export const getItems = async (skip: number, limit: number) : Promise<ItemsResponse> =>{
  const response = await axios.get<ItemsResponse>(`products?skip=${skip}&limit=${limit}`);
  return response.data;
}

export const getAnItem = async (id: number) : Promise<Product> =>{
  const response = await axios.get<Product>(`products/${id}`);
  return response.data;
}




export const setAuthToken = async (token: string) : Promise<void> =>{
  axios.defaults.headers.common['Authorization'] = token;
}

export const removeAuthToken = async () : Promise<void> =>{
  axios.defaults.headers.common['Authorization'] = '';
}
