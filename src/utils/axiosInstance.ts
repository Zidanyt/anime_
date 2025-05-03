import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/';

const axiosInstance = axios.create({
  baseURL,               // <- sem '=' aqui!
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // remova se não usar cookies
});

axiosInstance.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers!['Authorization'] = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
