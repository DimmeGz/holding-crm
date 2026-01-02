import axios, { type AxiosInstance } from 'axios';

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
