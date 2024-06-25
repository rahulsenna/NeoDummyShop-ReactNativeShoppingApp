import axios from 'axios';
import { Product } from '@my_types/Product';
import { useSession } from '@app';
import { User } from '@screens/ProfileScreen';

axios.defaults.baseURL = 'https://dummyjson.com/';

export interface AuthResponse {
  token: string;
  refreshToken: string
}

interface ItemsResponse {
  products: Product[];
  total: number
}

export const register = async (userid: string, password: string): Promise<void> => {
  await axios.post(`users/register`, { userid, password });
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`auth/login`, { username, password, expiresInMins: 30 });  
  return response.data;
};

export const fetchUser = async (token: string): Promise<User> => {
  const response = await axios.get('auth/me', { headers: { 'Authorization': `Bearer ${token}`, } });
  return await response.data;
};

export const updateUser = async (name: string, age: number): Promise<void> => { 
  await axios.put(`users/update`, { name, age });
};

export const fetchProducts = async (skip: number, limit: number) : Promise<ItemsResponse> =>{
  const response = await axios.get<ItemsResponse>(`products?skip=${skip}&limit=${limit}`);
  return response.data;
}

export const fecthProductByID = async (id: number) : Promise<Product> =>{
  const response = await axios.get<Product>(`products/${id}`);
  return response.data;
}




export const setAuthToken = async (token: string) : Promise<void> =>{
  axios.defaults.headers.common['Authorization'] = token;
}

export const removeAuthToken = async () : Promise<void> =>{
  axios.defaults.headers.common['Authorization'] = '';
}

/* const { session, signIn, signOut } = useSession();

export const refreshToken = async () => {
  const response = await axios.post('refresh', {
    refreshToken: session?.refresh_token,
    expiresInMins: 3,
  });

  signIn(response.data.token, response.data.refresh_token)
};

// Axios interceptor to handle token expiry
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        return axios(originalRequest);
      } catch (err) {
        signOut();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
 */
export default axios;