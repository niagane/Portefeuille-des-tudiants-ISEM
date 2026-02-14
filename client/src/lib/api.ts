'use client';

import axios from 'axios';

// Ensure API base URL always points to the server `/api` prefix.
const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const baseURL = envUrl.endsWith('/api') ? envUrl : envUrl.replace(/\/$/, '') + '/api';

const api = axios.create({
  baseURL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    const networkError = !error.response;
    const timeoutError = error.code === 'ECONNABORTED';
    const retriableStatus = [502, 503, 504].includes(error.response?.status);

    if ((networkError || timeoutError || retriableStatus) && !config.__retry) {
      config.__retry = true;
      await new Promise((resolve) => setTimeout(resolve, 700));
      return api(config);
    }

    if (networkError || timeoutError) {
      error.message = 'Serveur indisponible. Verifiez le backend puis reessayez.';
    }

    return Promise.reject(error);
  }
);

export default api;
